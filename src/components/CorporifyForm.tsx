
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Loader2, Copy, SquareTerminal, MessageCircle, ThumbsUp, ThumbsDown, Sparkles, RefreshCw } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useCorporify } from '@/hooks/useCorporify';
import { useAuth } from '@/hooks/useAuth';

const CorporifyForm = () => {
  const [inputText, setInputText] = useState('Hey team, I think we need to talk about the new feature. It seems like there\'s a problem with it and we should fix it soon.');
  const [outputText, setOutputText] = useState('');
  const { corporifyText, isLoading } = useCorporify();
  const { user } = useAuth();
  const { toast } = useToast();
  const [feedbackGiven, setFeedbackGiven] = useState<'like' | 'dislike' | null>(null);
  
  const handleCorporify = async () => {
    if (!inputText.trim()) {
      toast({
        title: "Empty message",
        description: "Please enter some text to corporify.",
        variant: "destructive",
      });
      return;
    }

    const result = await corporifyText(inputText);
    if (result) {
      setOutputText(result);
      setFeedbackGiven(null);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(outputText);
    toast({
      description: "Copied to clipboard!",
    });
  };
  
  const giveFeedback = (type: 'like' | 'dislike') => {
    setFeedbackGiven(type);
    toast({
      description: type === 'like' ? "Thanks for your positive feedback!" : "Thanks for your feedback, we'll improve!",
    });
    // In a real app, send this feedback to your backend
  };
  
  const handleRegenerate = async () => {
    if (inputText.trim()) {
      await handleCorporify();
    }
  };

  return (
    <div>
      <div className="mb-4">
        <label htmlFor="input-text" className="block text-sm font-medium mb-1 flex items-center">
          <MessageCircle className="h-4 w-4 mr-2 text-corporate-700" />
          <span>Your Message</span>
        </label>
        <Textarea
          id="input-text"
          placeholder="Enter your text here..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="min-h-[100px] resize-none"
        />
      </div>
      
      <Button 
        onClick={handleCorporify}
        disabled={isLoading || !user || (user && !user.isPremium && user.usageCount >= user.usageLimit)}
        className="w-full bg-corporate-800 hover:bg-corporate-900 shine-effect group"
        size="lg"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
            Corporifying...
          </>
        ) : (
          <>
            <Sparkles className="mr-2 h-4 w-4 group-hover:animate-pulse-gentle" />
            Corporify It
          </>
        )}
      </Button>
      
      {outputText && (
        <Card className="mt-6 border shadow-sm">
          <CardContent className="pt-6">
            <div className="text-sm font-medium mb-2 font-playfair text-lg text-corporate-800 flex items-center">
              <Sparkles className="h-4 w-4 mr-2 text-corporate-700" /> 
              Corporified Result:
            </div>
            <div className="bg-corporate-50 p-4 rounded-md text-corporate-900">
              {outputText}
            </div>
          </CardContent>
          <CardFooter className="pb-6 flex justify-between">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                className={`${feedbackGiven === 'like' ? 'bg-corporate-100 border-corporate-300' : ''}`}
                onClick={() => giveFeedback('like')}
                disabled={feedbackGiven !== null}
              >
                <ThumbsUp className="h-4 w-4 mr-1" /> Helpful
              </Button>
              <Button
                variant="outline"
                size="sm"
                className={`${feedbackGiven === 'dislike' ? 'bg-corporate-100 border-corporate-300' : ''}`}
                onClick={() => giveFeedback('dislike')}
                disabled={feedbackGiven !== null}
              >
                <ThumbsDown className="h-4 w-4 mr-1" /> Not Helpful
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRegenerate}
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} /> Regenerate
              </Button>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-corporate-800"
              onClick={copyToClipboard}
            >
              <Copy className="h-4 w-4 mr-1" /> Copy
            </Button>
          </CardFooter>
        </Card>
      )}
      
      {!user && (
        <div className="mt-6 p-4 bg-muted rounded-md text-center">
          <p className="text-sm text-muted-foreground">
            Sign in to start corporifying your messages!
          </p>
        </div>
      )}
    </div>
  );
};

export default CorporifyForm;
