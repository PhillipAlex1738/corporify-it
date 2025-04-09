
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/hooks/useAuth';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Key } from 'lucide-react';

const UsageDisplay = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState<string>('');
  const [hasStoredKey, setHasStoredKey] = useState<boolean>(false);

  // Check if API key exists on component mount
  useEffect(() => {
    const storedKey = localStorage.getItem('openai_api_key');
    setHasStoredKey(!!storedKey);
  }, []);

  const handleSaveApiKey = () => {
    if (!apiKey.trim()) {
      toast({
        title: "Empty API Key",
        description: "Please enter your OpenAI API key",
        variant: "destructive",
      });
      return;
    }

    // Store in localStorage (NOT secure for production)
    localStorage.setItem('openai_api_key', apiKey);
    setHasStoredKey(true);
    toast({
      title: "API Key Saved",
      description: "Your OpenAI API key has been saved locally",
    });
    setApiKey('');
  };

  const handleRemoveApiKey = () => {
    localStorage.removeItem('openai_api_key');
    setHasStoredKey(false);
    toast({
      title: "API Key Removed",
      description: "Your OpenAI API key has been removed",
    });
  };

  if (!user) return null;

  const { usageCount, usageLimit, isPremium } = user;
  const percentage = isPremium ? 100 : Math.min((usageCount / usageLimit) * 100, 100);
  
  return (
    <div className="w-full mt-2 mb-6">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm text-muted-foreground">
          Today's Usage
        </span>
        <span className="text-sm font-medium">
          {usageCount}/{isPremium ? '∞' : usageLimit}
        </span>
      </div>
      <Progress value={percentage} className="h-2" />
      
      {/* OpenAI API Key Management */}
      <div className="mt-4">
        {!hasStoredKey ? (
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <Key className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">OpenAI API Key</span>
            </div>
            <div className="flex space-x-2">
              <Input 
                type="password"
                placeholder="Enter your OpenAI API key" 
                value={apiKey} 
                onChange={(e) => setApiKey(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleSaveApiKey} size="sm">Save</Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Your API key is stored locally on your device only.
            </p>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Key className="h-4 w-4 text-green-600" />
              <span className="text-sm text-muted-foreground">OpenAI API Key: Saved</span>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleRemoveApiKey}
              className="text-xs hover:bg-red-100 hover:text-red-600"
            >
              Remove
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsageDisplay;
