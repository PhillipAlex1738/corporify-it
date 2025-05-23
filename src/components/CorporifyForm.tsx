
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, MessageCircle, Sparkles, AlertCircle, Terminal } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useCorporify, type ToneOption, FREE_DEMO_DAILY_LIMIT } from '@/hooks/useCorporify';
import { useAuth } from '@/hooks/useAuth';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import ToneSelector from './ToneSelector';
import TemplateSelector from './TemplateSelector';
import HistoryTab from './HistoryTab';
import UsageDisplay from './UsageDisplay';

const CorporifyForm = () => {
  useEffect(() => {
    // Reset anonymous usage tracking if it's a new day
    const today = new Date().toISOString().slice(0, 10);
    try {
      const usageJSON = localStorage.getItem('corporify_anon_usage');
      if (usageJSON) {
        const data = JSON.parse(usageJSON);
        if (data.date !== today) {
          localStorage.setItem('corporify_anon_usage', JSON.stringify({ date: today, count: 0 }));
        }
      }
    } catch {
      // ignore
    }
  }, []);

  const [inputText, setInputText] = useState('Hey team, I think we need to talk about the new feature. It seems like there\'s a problem with it and we should fix it soon.');
  const [outputText, setOutputText] = useState('');
  const [selectedTone, setSelectedTone] = useState<ToneOption>('professional');
  const [apiErrorDetails, setApiErrorDetails] = useState<string | null>(null);
  const { 
    corporifyText, 
    isLoading, 
    lastError, 
    apiDiagnostics,
    history,
    savedMessages,
    toggleSaveMessage,
    removeFromSaved,
    dailyUsage,
    isLimitReached
  } = useCorporify();
  const { user } = useAuth();
  const { toast } = useToast();
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

    // Check if anonymous user has reached their daily limit
    if (isLimitReached()) {
      toast({
        description: `You've reached the free daily limit (${FREE_DEMO_DAILY_LIMIT}). Sign in for unlimited use!`,
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await corporifyText(inputText, selectedTone);
      if (result) {
        setOutputText(result);
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

  const toggleDiagnostics = () => {
    setShowDiagnostics(!showDiagnostics);
  };

  const handleSelectTemplate = (templateText: string) => {
    setInputText(templateText);
    toast({
      description: "Template selected. You can now edit it before corporifying.",
    });
  };

  const handleSelectFromHistory = (text: string) => {
    setInputText(text);
    setActiveTab('compose');
  };

  // Anonymous only: check and limit demo usage
  const isAnonLimitReached = isLimitReached();
  const isButtonDisabled = isLoading || isAnonLimitReached;

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
          <UsageDisplay />
          
          <section aria-labelledby="message-input-section">
            <h2 id="message-input-section" className="sr-only">Message Input</h2>
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
          
            {isAnonLimitReached && (
              <div className="mt-5 bg-yellow-50 border border-yellow-200 p-4 rounded flex items-start gap-3 text-sm">
                <div className="pt-1">
                  <Sparkles className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <span className="font-medium text-yellow-800">
                    You've reached the daily free demo limit.
                  </span>{" "}
                  <br />
                  <span className="text-yellow-800">
                    Sign in for unlimited daily uses and to save your history, favorite responses, or provide feedback.
                  </span>
                </div>
              </div>
            )}
          </section>

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
        </TabsContent>
        
        <TabsContent value="history">
          {user ? (
            <HistoryTab 
              history={history}
              onSelect={handleSelectFromHistory}
              savedMessages={savedMessages}
              onToggleSave={toggleSaveMessage}
              onRemoveFromSaved={removeFromSaved}
            />
          ) : (
            <div className="mt-6 p-4 bg-muted rounded-md text-center text-muted-foreground text-sm">
              Sign in to view or save your history and favorites.
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CorporifyForm;
