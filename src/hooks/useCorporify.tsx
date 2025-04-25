import { useState, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';

export type ToneOption = 'professional' | 'formal' | 'friendly' | 'concise' | 'diplomatic';

export type HistoryItem = {
  id: string;
  input: string;
  output: string;
  timestamp: string;
  tone: ToneOption;
  isSaved?: boolean;
};

export const useCorporify = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);
  const [apiDiagnostics, setApiDiagnostics] = useState<any | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [savedMessages, setSavedMessages] = useState<HistoryItem[]>([]);

  // Load history from localStorage on component mount
  useState(() => {
    if (user) {
      try {
        const savedHistoryJSON = localStorage.getItem(`corporify_history_${user.id}`);
        if (savedHistoryJSON) {
          setHistory(JSON.parse(savedHistoryJSON));
        }
        
        const savedMessagesJSON = localStorage.getItem(`corporify_saved_${user.id}`);
        if (savedMessagesJSON) {
          setSavedMessages(JSON.parse(savedMessagesJSON));
        }
      } catch (error) {
        console.error('Failed to load history from localStorage', error);
      }
    }
  });

  const corporifyText = useCallback(async (text: string, tone: ToneOption = 'professional'): Promise<string | null> => {
    if (!text.trim()) return null;
    
    setIsLoading(true);
    setLastError(null);
    setApiDiagnostics(null);
    
    try {
      console.log(`Sending request to corporify function with tone: ${tone}`);
      
      const { data, error } = await supabase.functions.invoke('corporify', {
        body: { 
          text, 
          tone,
          userId: user?.id 
        }
      });
      
      if (error) {
        console.error('Supabase function error:', error);
        setLastError(`API Error: ${error.message || 'Unknown error'}`);
        setApiDiagnostics({ error });
        toast({
          title: "Error",
          description: `Failed to process your text: ${error.message}`,
          variant: "destructive",
        });
        return null;
      }
      
      if (!data || !data.corporateText) {
        console.error('Invalid response format:', data);
        setLastError('Invalid response format from API');
        setApiDiagnostics({ data });
        toast({
          title: "Error",
          description: "Received an invalid response format from the server.",
          variant: "destructive",
        });
        return null;
      }
      
      const result = data.corporateText;
      
      // Add to history if user is logged in
      if (user) {
        const newItem: HistoryItem = {
          id: Date.now().toString(),
          input: text,
          output: result,
          timestamp: new Date().toISOString(),
          tone
        };
        
        const updatedHistory = [newItem, ...history].slice(0, 50); // Keep last 50 items
        setHistory(updatedHistory);
        
        // Save to localStorage
        try {
          localStorage.setItem(`corporify_history_${user.id}`, JSON.stringify(updatedHistory));
        } catch (error) {
          console.error('Failed to save history to localStorage', error);
        }
      }
      
      return result;
    } catch (err: any) {
      console.error('Error in corporifyText:', err);
      setLastError(err.message || 'Unknown error occurred');
      setApiDiagnostics({ error: err });
      toast({
        title: "Error",
        description: err.message || "An unexpected error occurred.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user, history, toast]);

  const saveFeedback = useCallback(async (input: string, output: string, isPositive: boolean): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const { error } = await supabase.from('feedback').insert({
        user_id: user.id,
        input_text: input,
        output_text: output,
        is_positive: isPositive
      });
      
      if (error) {
        console.error('Error saving feedback:', error);
        return false;
      }
      
      return true;
    } catch (err) {
      console.error('Error in saveFeedback:', err);
      return false;
    }
  }, [user]);

  const toggleSaveMessage = useCallback((item: HistoryItem) => {
    if (!user) return;
    
    // Check if the item is already saved
    const isSaved = savedMessages.some(saved => saved.id === item.id);
    
    let updatedSavedMessages;
    if (isSaved) {
      // Remove from saved
      updatedSavedMessages = savedMessages.filter(saved => saved.id !== item.id);
    } else {
      // Add to saved
      updatedSavedMessages = [{ ...item, isSaved: true }, ...savedMessages];
    }
    
    setSavedMessages(updatedSavedMessages);
    
    // Update localStorage
    try {
      localStorage.setItem(`corporify_saved_${user.id}`, JSON.stringify(updatedSavedMessages));
    } catch (error) {
      console.error('Failed to save to localStorage', error);
    }
  }, [user, savedMessages]);

  const removeFromSaved = useCallback((itemId: string) => {
    if (!user) return;
    
    const updatedSavedMessages = savedMessages.filter(item => item.id !== itemId);
    setSavedMessages(updatedSavedMessages);
    
    // Update localStorage
    try {
      localStorage.setItem(`corporify_saved_${user.id}`, JSON.stringify(updatedSavedMessages));
    } catch (error) {
      console.error('Failed to update localStorage', error);
    }
  }, [user, savedMessages]);

  return {
    corporifyText,
    saveFeedback,
    isLoading,
    lastError,
    apiDiagnostics,
    history,
    savedMessages,
    toggleSaveMessage,
    removeFromSaved
  };
};
