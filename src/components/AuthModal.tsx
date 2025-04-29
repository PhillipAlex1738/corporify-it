
import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

type AuthModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [localLoading, setLocalLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { login, signUp, isLoading, user } = useAuth();
  
  // If user becomes authenticated while modal is open, close it
  useEffect(() => {
    if (user && isOpen) {
      onClose();
    }
  }, [user, isOpen, onClose]);
  
  // Reset states when modal closes or opens
  useEffect(() => {
    if (!isOpen) {
      setLocalLoading(false);
      setEmail('');
      setPassword('');
      setError(null);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (localLoading || isLoading) return; // Prevent multiple submissions
    
    setLocalLoading(true);
    setError(null);
    console.log(`Attempting ${activeTab} with email: ${email}`);
    
    try {
      if (activeTab === 'login') {
        const { success } = await login(email, password);
        console.log(`Login attempt result: ${success ? 'success' : 'failure'}`);
        if (success) {
          console.log("Login successful, closing modal");
          onClose();
        }
      } else {
        const { success } = await signUp(email, password);
        console.log(`Signup attempt result: ${success ? 'success' : 'failure'}`);
        if (success) {
          console.log("Signup successful, closing modal");
          onClose();
        }
      }
    } catch (error: any) {
      console.error(`${activeTab} error:`, error);
      setError(error?.message || `${activeTab === 'login' ? 'Login' : 'Sign up'} failed. Please try again.`);
    } finally {
      // Always reset local loading state
      setLocalLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        setLocalLoading(false); // Reset loading when dialog is closed
        onClose();
      }
    }}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-corporate-900 flex items-center gap-2">
            <span className="corporify-gradient p-1 rounded text-white text-sm">C</span>
            Welcome to Corporify It
          </DialogTitle>
          <DialogDescription>
            Transform your casual messages into polished corporate language.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="login" value={activeTab} onValueChange={(v) => setActiveTab(v as 'login' | 'signup')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              {error && (
                <div className="text-red-500 text-sm p-2 bg-red-50 rounded border border-red-200">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={localLoading || isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={localLoading || isLoading}
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-corporate-800 hover:bg-corporate-900"
                disabled={localLoading || isLoading}
              >
                {(localLoading || isLoading) ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : "Login"}
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="signup">
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              {error && (
                <div className="text-red-500 text-sm p-2 bg-red-50 rounded border border-red-200">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="your@email.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={localLoading || isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <Input
                  id="signup-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={localLoading || isLoading}
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-corporate-800 hover:bg-corporate-900"
                disabled={localLoading || isLoading}
              >
                {(localLoading || isLoading) ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : "Create Account"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
