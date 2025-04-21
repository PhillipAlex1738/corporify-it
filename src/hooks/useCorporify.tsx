import { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
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

  useEffect(() => {
    console.log("useCorporify: User auth state:", user ? `Authenticated as ${user.email}` : "Not authenticated");
  }, [user]);

  useEffect(() => {
    const savedMessagesJSON = localStorage.getItem('corporify_saved_messages');
    if (savedMessagesJSON) {
      try {
        const parsedMessages = JSON.parse(savedMessagesJSON);
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

  useEffect(() => {
    localStorage.setItem('corporify_saved_messages', JSON.stringify(savedMessages));
  }, [savedMessages]);

  const corporifyText = async (originalText: string, tone: ToneOption = 'professional'): Promise<string> => {
    setIsLoading(true);
    setLastError(null);
    setApiDiagnostics(null);

    console.log("corporifyText called with user:", user ? `Authenticated as ${user.email}` : "Not authenticated");
    const isAnonymous = !user;

    if (isAnonymous) {
      // Update usage count for anonymous users
      const today = new Date().toISOString().slice(0, 10);
      let currentUsage = 0;
      
      try {
        const usageJSON = localStorage.getItem('corporify_anon_usage');
        if (usageJSON) {
          const data = JSON.parse(usageJSON);
          if (data.date === today) {
            currentUsage = data.count || 0;
          }
        }
        
        // Check if user has reached the daily limit
        const FREE_DEMO_DAILY_LIMIT = 5;
        if (currentUsage >= FREE_DEMO_DAILY_LIMIT) {
          setLastError('Daily limit reached. Sign in for unlimited transformations.');
          toast({
            title: "Daily limit reached",
            description: "Sign in to get unlimited transformations.",
            variant: "destructive",
          });
          setIsLoading(false);
          return "";
        }
        
        // Update the usage count
        localStorage.setItem('corporify_anon_usage', JSON.stringify({
          date: today,
          count: currentUsage + 1
        }));
      } catch (e) {
        console.error('Error updating anonymous usage count', e);
      }
    }

    try {
      console.log("Calling Supabase Edge Function with:", { 
        text: originalText.substring(0, 50) + (originalText.length > 50 ? "..." : ""), 
        userId: user?.id || "anonymous",
        tone: tone
      });

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
        
        setApiDiagnostics({
          type: 'invalid_response_format',
          rawResponse: data
        });
        if (data.error) {
          setLastError(`API error: ${data.error}${data.details ? ` - ${data.details}` : ''}`);
          throw new Error(`API error: ${data.error}`);
        } else {
          setLastError('Invalid response format from API');
          throw new Error('Invalid response format from API');
        }
      }

      const corporateText = data.corporateText;

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
          description: "Unlimited conversions as a signed in user.",
        });
      } else {
        toast({
          title: "Text corporified!",
          description: "Sign in to remove the daily limit and access more features.",
        });
      }

      return corporateText;
    } catch (error: any) {
      console.error('Corporification failed', error);
      setLastError(error.message || "Unknown error occurred");
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
      
      toast({
        title: isHelpful ? "Thanks for your feedback!" : "We'll do better",
        description: isHelpful 
          ? "We're glad the transformation was helpful." 
          : "Your feedback helps us improve. Consider contacting support with details.",
      });
      
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
      setSavedMessages(saved => saved.filter(msg => msg.id !== item.id));
      toast({ description: "Removed from saved messages" });
    } else {
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
