import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { CorporifyHistory } from '@/types/corporify';

export type ToneOption = 'professional' | 'formal' | 'friendly' | 'concise' | 'diplomatic';

export type HistoryItem = CorporifyHistory;

// Free demo users get 5 transformations per day
export const FREE_DEMO_DAILY_LIMIT = 5;

export const useCorporify = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);
  const [apiDiagnostics, setApiDiagnostics] = useState<any | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [savedMessages, setSavedMessages] = useState<HistoryItem[]>([]);
  const [dailyUsage, setDailyUsage] = useState(0);

  useEffect(() => {
    if (user) {
      try {
        console.log("useCorporify: User auth state:", user ? `Authenticated as ${user.email}` : "Not authenticated");
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
    } else {
      // For anonymous users, check their usage count
      checkAnonUsage();
    }
  }, [user]);

  const checkAnonUsage = () => {
    const today = new Date().toISOString().slice(0, 10);
    try {
      const usageJSON = localStorage.getItem('corporify_anon_usage');
      if (usageJSON) {
        const data = JSON.parse(usageJSON);
        if (data.date === today) {
          setDailyUsage(data.count || 0);
        } else {
          // Reset usage for new day
          localStorage.setItem('corporify_anon_usage', JSON.stringify({ date: today, count: 0 }));
          setDailyUsage(0);
        }
      } else {
        localStorage.setItem('corporify_anon_usage', JSON.stringify({ date: today, count: 0 }));
        setDailyUsage(0);
      }
    } catch (error) {
      console.error('Failed to check anonymous usage', error);
      setDailyUsage(0);
    }
  };

  const incrementAnonUsage = () => {
    const today = new Date().toISOString().slice(0, 10);
    const newCount = dailyUsage + 1;
    setDailyUsage(newCount);
    try {
      localStorage.setItem('corporify_anon_usage', JSON.stringify({ date: today, count: newCount }));
      
      // Trigger an event for other components to update
      window.dispatchEvent(new Event('corporifyUsageUpdated'));
    } catch (error) {
      console.error('Failed to update anonymous usage count', error);
    }
  };

  const isLimitReached = useCallback(() => {
    return !user && dailyUsage >= FREE_DEMO_DAILY_LIMIT;
  }, [user, dailyUsage]);

  const corporifyText = useCallback(async (text: string, tone: ToneOption = 'professional'): Promise<string | null> => {
    if (!text.trim()) return null;
    
    // Check if anonymous user has reached their daily limit
    if (isLimitReached()) {
      toast({
        title: "Daily limit reached",
        description: `Free demo users are limited to ${FREE_DEMO_DAILY_LIMIT} transformations per day. Sign in for unlimited use.`,
        variant: "destructive",
      });
      return null;
    }
    
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
      
      if (user) {
        const newItem: HistoryItem = {
          id: Date.now().toString(),
          input: text,
          output: result,
          timestamp: new Date().toISOString(),
          tone
        };
        
        const updatedHistory = [newItem, ...history].slice(0, 50);
        setHistory(updatedHistory);
        
        try {
          localStorage.setItem(`corporify_history_${user.id}`, JSON.stringify(updatedHistory));
        } catch (error) {
          console.error('Failed to save history to localStorage', error);
        }
      } else {
        // Increment anonymous user usage count
        incrementAnonUsage();
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
  }, [user, history, toast, dailyUsage, isLimitReached]);

  const saveFeedback = useCallback(async (input: string, output: string, isPositive: boolean): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const { error } = await supabase.from('feedback').insert({
        user_email: user.email,
        functionality_rating: isPositive ? 5 : 1,
        ui_rating: isPositive ? 5 : 1,
        recommendation_rating: isPositive ? 5 : 1,
        additional_comments: `Feedback on: "${input.substring(0, 50)}..."`
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
    
    const isSaved = savedMessages.some(saved => saved.id === item.id);
    
    let updatedSavedMessages;
    if (isSaved) {
      updatedSavedMessages = savedMessages.filter(saved => saved.id !== item.id);
    } else {
      updatedSavedMessages = [{ ...item, isSaved: true }, ...savedMessages];
    }
    
    setSavedMessages(updatedSavedMessages);
    
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
    
    try {
      localStorage.setItem(`corporify_saved_${user.id}`, JSON.stringify(updatedSavedMessages));
    } catch (error) {
      console.error('Failed to update localStorage', error);
    }
  }, [user, savedMessages]);

  return {
    corporifyText,
    saveFeedback,
    toggleSaveMessage,
    removeFromSaved,
    isLoading,
    lastError,
    apiDiagnostics,
    history,
    savedMessages,
    dailyUsage,
    isLimitReached,
    FREE_DEMO_DAILY_LIMIT
  };
};
