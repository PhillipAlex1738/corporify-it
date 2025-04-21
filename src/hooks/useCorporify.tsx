
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

export type ToneOption = 'professional' | 'formal' | 'friendly' | 'concise' | 'diplomatic';

export type CorporifyHistory = {
  id: string;
  originalText: string;
  corporateText: string;
  timestamp: Date;
};

export const useCorporify = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<CorporifyHistory[]>([]);
  const [savedMessages, setSavedMessages] = useState<CorporifyHistory[]>([]);
  const [lastError, setLastError] = useState<string | null>(null);
  const [apiDiagnostics, setApiDiagnostics] = useState<any>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  // Load saved messages from localStorage on mount
  useEffect(() => {
    const savedMessagesJSON = localStorage.getItem('corporify_saved_messages');
    if (savedMessagesJSON) {
      try {
        const parsedMessages = JSON.parse(savedMessagesJSON);
        // Ensure timestamps are converted back to Date objects
        const messagesWithDates = parsedMessages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        setSavedMessages(messagesWithDates);
      } catch (e) {
        console.error('Failed to parse saved messages from localStorage', e);
      }
    }
  }, []);

  // Save messages to localStorage when they change
  useEffect(() => {
    localStorage.setItem('corporify_saved_messages', JSON.stringify(savedMessages));
  }, [savedMessages]);

  const corporifyText = async (originalText: string, tone: ToneOption = 'professional'): Promise<string> => {
    setIsLoading(true);
    setLastError(null);
    setApiDiagnostics(null);

    // Modified to support anonymous users
    const isAnonymous = !user;
    
    try {
      console.log("Calling Supabase Edge Function with:", { 
        text: originalText.substring(0, 50) + (originalText.length > 50 ? "..." : ""), 
        userId: user?.id || "anonymous",
        tone: tone
      });

      // Call our Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('corporify', {
        body: { 
          text: originalText,
          userId: user?.id || "anonymous",
          tone: tone
        }
      });

      console.log("Edge function response received:", data);

      if (error) {
        console.error("Supabase Edge Function error:", error);
        setLastError(error.message || 'Failed to corporify text');
        setApiDiagnostics({
          type: 'edge_function_error',
          error: error
        });
        throw new Error(error.message || 'Failed to corporify text');
      }

      if (!data) {
        console.error("Edge function returned empty data");
        setLastError('Empty response from API');
        setApiDiagnostics({
          type: 'empty_response'
        });
        throw new Error('Empty response from API');
      }
      
      if (!data.corporateText) {
        console.error("Edge function response missing corporateText:", data);
        
        // Store raw response for diagnostics
        setApiDiagnostics({
          type: 'invalid_response_format',
          rawResponse: data
        });
        
        // If we got an error response, use that
        if (data.error) {
          setLastError(`API error: ${data.error}${data.details ? ` - ${data.details}` : ''}`);
          throw new Error(`API error: ${data.error}`);
        } else {
          setLastError('Invalid response format from API');
          throw new Error('Invalid response format from API');
        }
      }
      
      const corporateText = data.corporateText;

      // Update usage count if logged in
      if (user) {
        const updatedUser = {
          ...user,
          usageCount: user.usageCount + 1,
        };
        localStorage.setItem('corporify_user', JSON.stringify(updatedUser));
        console.log("Updated user in localStorage:", updatedUser);
      }

      // Add to history (for logged in users)
      if (user) {
        const newEntry = {
          id: `history_${Date.now()}`,
          originalText,
          corporateText,
          timestamp: new Date(),
        };
        setHistory(prevHistory => [newEntry, ...prevHistory]);
      }

      if (user) {
        toast({
          title: "Text corporified!",
          description: `${user.usageCount + 1}/${user.isPremium ? '∞' : user.usageLimit} daily uses.`,
        });
      } else {
        toast({
          title: "Text corporified!",
          description: "Sign in to save this transformation and access more features.",
        });
      }

      return corporateText;
    } catch (error: any) {
      console.error('Corporification failed', error);
      setLastError(error.message || "Unknown error occurred");
      
      // If we haven't set diagnostics yet, set generic error
      if (!apiDiagnostics) {
        setApiDiagnostics({
          type: 'unknown_error',
          error: error
        });
      }
      
      toast({
        title: "Corporification failed",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
      return "";
    } finally {
      setIsLoading(false);
    }
  };

  const saveFeedback = async (originalText: string, corporateText: string, isHelpful: boolean): Promise<boolean> => {
    try {
      console.log('Feedback received:', { 
        originalText: originalText.substring(0, 50) + (originalText.length > 50 ? "..." : ""), 
        corporateText: corporateText.substring(0, 50) + (corporateText.length > 50 ? "..." : ""), 
        isHelpful
      });
      
      // Show toast based on feedback
      toast({
        title: isHelpful ? "Thanks for your feedback!" : "We'll do better",
        description: isHelpful 
          ? "We're glad the transformation was helpful." 
          : "Your feedback helps us improve. Consider contacting support with details.",
      });
      
      // If feedback was negative, suggest support
      if (!isHelpful && user) {
        setTimeout(() => {
          toast({
            title: "Need more help?",
            description: "Visit our support page to tell us how we can improve.",
            action: (
              <button
                onClick={() => window.location.href = "/support"}
                className="bg-primary text-primary-foreground h-8 rounded-md px-3 text-xs"
              >
                Support
              </button>
            ),
          });
        }, 3000);
      }
      
      return true;
    } catch (error) {
      console.error('Error saving feedback:', error);
      return false;
    }
  };

  const toggleSaveMessage = (item: CorporifyHistory) => {
    const isAlreadySaved = savedMessages.some(msg => msg.id === item.id);
    
    if (isAlreadySaved) {
      // Remove from saved messages
      setSavedMessages(saved => saved.filter(msg => msg.id !== item.id));
      toast({ description: "Removed from saved messages" });
    } else {
      // Add to saved messages
      setSavedMessages(saved => [item, ...saved]);
      toast({ description: "Added to saved messages" });
    }
  };

  const removeFromSaved = (id: string) => {
    setSavedMessages(saved => saved.filter(msg => msg.id !== id));
    toast({ description: "Removed from saved messages" });
  };

  return {
    corporifyText,
    saveFeedback,
    isLoading,
    history,
    lastError,
    apiDiagnostics,
    savedMessages,
    toggleSaveMessage,
    removeFromSaved
  };
};
