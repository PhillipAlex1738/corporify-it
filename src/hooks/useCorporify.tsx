
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
      // Get API key from local storage
      const apiKey = localStorage.getItem('openai_api_key');
      
      let corporateText: string;
      
      // If API key exists, use OpenAI API
      if (apiKey) {
        try {
          corporateText = await callOpenAI(originalText, apiKey);
        } catch (error) {
          console.error('OpenAI API call failed:', error);
          toast({
            title: "OpenAI API Error",
            description: "There was an issue with your API key or the OpenAI service. Falling back to simulated response.",
            variant: "destructive",
          });
          // Fallback to simulated response
          corporateText = simulateCorporateTransformation(originalText);
        }
      } else {
        // If no API key, use simulated transformation
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        corporateText = simulateCorporateTransformation(originalText);
      }

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

  // Function to call OpenAI API
  const callOpenAI = async (text: string, apiKey: string): Promise<string> => {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'Rewrite the user\'s message in a professional, polite corporate tone. Maintain the original intent, but improve tone, clarity, and professionalism.'
          },
          {
            role: 'user',
            content: text
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'API request failed');
    }

    const data = await response.json();
    return data.choices[0].message.content;
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
