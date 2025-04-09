
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from '@/hooks/useAuth';

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

  // Mock API call to transform text
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

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      // Here we'd normally call OpenAI API or similar
      // For demo purposes, we'll use a simple transformation
      const corporateText = simulateCorporateTransformation(originalText);

      // Update usage count in localStorage
      const updatedUser = {
        ...user,
        usageCount: user.usageCount + 1,
      };
      localStorage.setItem('corporify_user', JSON.stringify(updatedUser));

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

  const simulateCorporateTransformation = (text: string): string => {
    // This is a very simplified mock of what an AI would do
    // In production, this would call OpenAI or another AI service
    const corporatePhrases = [
      ["good", "favorable"],
      ["bad", "suboptimal"],
      ["problem", "challenge"],
      ["idea", "strategic initiative"],
      ["think", "assess"],
      ["talk", "dialogue"],
      ["meet", "convene"],
      ["use", "leverage"],
      ["make", "implement"],
      ["start", "initiate"],
      ["end", "finalize"],
      ["soon", "in the near term"],
      ["later", "at a subsequent juncture"],
      ["now", "at this point in time"],
      ["I think", "Based on my assessment"],
      ["you should", "it is recommended that you"],
      ["we need to", "it is imperative that we"],
      ["let's", "I propose we"],
    ];

    let result = text;
    corporatePhrases.forEach(([casual, corporate]) => {
      const regex = new RegExp(`\\b${casual}\\b`, 'gi');
      result = result.replace(regex, corporate);
    });

    // Add some corporate framing
    result = `Per our previous correspondence, ${result}. Please don't hesitate to reach out should you require any clarification. Best regards.`;

    return result;
  };

  return {
    corporifyText,
    isLoading,
    history,
  };
};
