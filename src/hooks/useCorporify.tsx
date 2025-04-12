
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

export type CorporifyHistory = {
  id: string;
  originalText: string;
  corporateText: string;
  timestamp: Date;
};

export const useCorporify = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<CorporifyHistory[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();

  const corporifyText = async (originalText: string): Promise<string> => {
    setIsLoading(true);

    // Check user limits
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please login to use this feature.",
        variant: "destructive",
      });
      setIsLoading(false);
      return "";
    }

    if (!user.isPremium && user.usageCount >= user.usageLimit) {
      toast({
        title: "Usage limit reached",
        description: "Upgrade to premium for unlimited corporification.",
        variant: "destructive",
      });
      setIsLoading(false);
      return "";
    }

    try {
      console.log("Calling Supabase Edge Function with:", { 
        text: originalText, 
        userId: user.id 
      });

      // Call our Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('corporify', {
        body: { 
          text: originalText,
          userId: user ? user.id : null
        }
      });

      if (error) {
        console.error("Supabase Edge Function error:", error);
        throw new Error(error.message || 'Failed to corporify text');
      }

      console.log("Supabase Edge Function response:", data);
      const corporateText = data.corporateText;

      // Update usage count in localStorage
      const updatedUser = {
        ...user,
        usageCount: user.usageCount + 1,
      };
      localStorage.setItem('corporify_user', JSON.stringify(updatedUser));
      console.log("Updated user in localStorage:", updatedUser);

      // Add to history
      const newEntry = {
        id: `history_${Date.now()}`,
        originalText,
        corporateText,
        timestamp: new Date(),
      };
      setHistory(prevHistory => [newEntry, ...prevHistory]);

      toast({
        title: "Text corporified!",
        description: `${user.usageCount + 1}/${user.isPremium ? '∞' : user.usageLimit} daily uses.`,
      });

      return corporateText;
    } catch (error) {
      console.error('Corporification failed', error);
      toast({
        title: "Corporification failed",
        description: "Please try again later.",
        variant: "destructive",
      });
      return "";
    } finally {
      setIsLoading(false);
    }
  };

  const saveFeedback = async (originalText: string, corporateText: string, isHelpful: boolean): Promise<boolean> => {
    try {
      console.log('Feedback received:', { originalText, corporateText, isHelpful });
      // In this version, we don't save feedback to the database
      return true;
    } catch (error) {
      console.error('Error saving feedback:', error);
      return false;
    }
  };

  return {
    corporifyText,
    saveFeedback,
    isLoading,
    history,
  };
};
