
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Copy, MessageCircle, ThumbsUp, ThumbsDown, Sparkles, RefreshCw, AlertCircle, Terminal } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useCorporify, type ToneOption } from '@/hooks/useCorporify';
import { useAuth } from '@/hooks/useAuth';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import ToneSelector from './ToneSelector';
import TemplateSelector from './TemplateSelector';
import HistoryTab from './HistoryTab';

const CorporifyForm = () => {
  const [inputText, setInputText] = useState('Hey team, I think we need to talk about the new feature. It seems like there\'s a problem with it and we should fix it soon.');
  const [outputText, setOutputText] = useState('');
  const [selectedTone, setSelectedTone] = useState<ToneOption>('professional');
  const [apiErrorDetails, setApiErrorDetails] = useState<string | null>(null);
  const { 
    corporifyText, 
    saveFeedback, 
    isLoading, 
    lastError, 
    apiDiagnostics,
    history,
    savedMessages,
    toggleSaveMessage,
    removeFromSaved
  } = useCorporify();
  const { user } = useAuth();
  const { toast } = useToast();
  const [feedbackGiven, setFeedbackGiven] = useState<'like' | 'dislike' | null>(null);
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const [activeTab, setActiveTab] = useState<'compose' | 'history'>('compose');
  
  const handleCorporify = async () => {
    if (!inputText.trim()) {
      toast({
        title: "Empty message",
        description: "Please enter some text to corporify.",
        variant: "destructive",
      });
      return;
    }
    
    setApiErrorDetails(null);
    setShowDiagnostics(false);
    try {
      const result = await corporifyText(inputText, selectedTone);
      if (result) {
        setOutputText(result);
        setFeedbackGiven(null);
      } else if (lastError) {
        setApiErrorDetails(lastError);
      }
    } catch (err: any) {
      setApiErrorDetails(err.message || "Failed to process your request");
      toast({
        title: "Error",
        description: err.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(outputText);
    toast({
      description: "Copied to clipboard!",
    });
  };
  
  const giveFeedback = async (type: 'like' | 'dislike') => {
    setFeedbackGiven(type);
    
    // Save the feedback locally
    const success = await saveFeedback(inputText, outputText, type === 'like');
    
    toast({
      description: success 
        ? (type === 'like' ? "Thanks for your positive feedback!" : "Thanks for your feedback, we'll improve!") 
        : "Could not save your feedback. Please try again later.",
      variant: success ? "default" : "destructive"
    });
  };
  
  const handleRegenerate = async () => {
    if (inputText.trim()) {
      await handleCorporify();
    }
  };

  const toggleDiagnostics = () => {
    setShowDiagnostics(!showDiagnostics);
  };
  
  const handleSelectTemplate = (templateText: string) => {
    setInputText(templateText);
    // Add a toast notification for better UX
    toast({
      description: "Template selected. You can now edit it before corporifying.",
    });
  };
  
  const handleSelectFromHistory = (text: string) => {
    setInputText(text);
    setActiveTab('compose');
  };

  const isButtonDisabled = isLoading || !user || (user && !user.isPremium && user.usageCount >= user.usageLimit);

  return (
    <div>
      <Tabs 
        defaultValue="compose" 
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as 'compose' | 'history')}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="compose">Compose</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="compose">
          <div className="mb-4">
            <div className="flex flex-wrap gap-2 justify-between items-center mb-2">
              <div className="flex-grow">
                <ToneSelector 
                  selectedTone={selectedTone}
                  onChange={setSelectedTone}
                />
              </div>
              <div className="flex-shrink-0">
                <TemplateSelector onSelect={handleSelectTemplate} />
              </div>
            </div>
            
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
            disabled={isButtonDisabled}
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
          
          {apiErrorDetails && (
            <Alert className="mt-4" variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle className="flex items-center justify-between">
                <span>API Error Detected</span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={toggleDiagnostics}
                  className="ml-auto h-6 px-2 text-xs"
                >
                  <Terminal className="h-3 w-3 mr-1" />
                  {showDiagnostics ? "Hide" : "Show"} Diagnostics
                </Button>
              </AlertTitle>
              <AlertDescription>
                <p className="mt-1">{apiErrorDetails}</p>
                
                <div className="mt-2 text-sm">
                  <p className="font-medium">Possible Solutions:</p>
                  <ol className="list-decimal pl-5 mt-1 space-y-1">
                    <li>Verify the OpenAI API key is correctly formatted and active</li>
                    <li>Check that all required Supabase secrets are properly configured</li>
                    <li>Try refreshing the page and attempting again</li>
                    <li>Contact support if the issue persists</li>
                  </ol>
                </div>
                
                {showDiagnostics && apiDiagnostics && (
                  <div className="mt-3 p-3 bg-black/10 rounded text-xs font-mono overflow-auto max-h-48">
                    <pre className="whitespace-pre-wrap break-all">
                      {JSON.stringify(apiDiagnostics, null, 2)}
                    </pre>
                  </div>
                )}
              </AlertDescription>
            </Alert>
          )}
          
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
        </TabsContent>
        
        <TabsContent value="history">
          <HistoryTab 
            history={history}
            onSelect={handleSelectFromHistory}
            savedMessages={savedMessages}
            onToggleSave={toggleSaveMessage}
            onRemoveFromSaved={removeFromSaved}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CorporifyForm;
