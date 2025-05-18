
import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { LoginForm, SignupForm } from './auth';

type AuthModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [isClosing, setIsClosing] = useState(false);
  const { user, isLoading } = useAuth();
  
  // If user becomes authenticated while modal is open, close it
  useEffect(() => {
    if (user && isOpen && !isClosing) {
      console.log("User detected, closing auth modal:", user.email);
      setIsClosing(true);
      // Use a short timeout to ensure state transitions happen smoothly
      setTimeout(() => {
        onClose();
        setIsClosing(false);
      }, 300);
    }
  }, [user, isOpen, onClose, isClosing]);
  
  // Reset states when modal closes
  useEffect(() => {
    if (!isOpen) {
      // Reset tab to login when modal is closed
      setActiveTab('login');
      setIsClosing(false);
    }
  }, [isOpen]);

  const handleSuccess = () => {
    setIsClosing(true);
    // Use a short timeout to ensure state transitions happen smoothly
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300);
  };

  // Don't render the modal content while we're closing to prevent any state conflicts
  if (isClosing) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open && !isClosing) {
        setIsClosing(true);
        setTimeout(() => {
          onClose();
          setIsClosing(false);
        }, 100);
      }
    }}>
      <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden">
        <div className="bg-rose-500 p-4">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <span className="bg-white text-rose-500 h-6 w-6 flex items-center justify-center rounded text-sm font-bold">C</span>
              Welcome to Corporify It
            </DialogTitle>
            <DialogDescription className="text-white/90">
              Transform your casual messages into polished corporate language.
            </DialogDescription>
          </DialogHeader>
        </div>
        
        <div className="p-4">
          <Tabs defaultValue="login" value={activeTab} onValueChange={(v) => setActiveTab(v as 'login' | 'signup')}>
            <TabsList className="grid w-full grid-cols-2 mb-4 bg-gray-100">
              <TabsTrigger 
                value="login" 
                className="data-[state=active]:bg-white data-[state=active]:shadow-none"
              >
                Login
              </TabsTrigger>
              <TabsTrigger 
                value="signup"
                className="data-[state=active]:bg-white data-[state=active]:shadow-none"
              >
                Sign Up
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <LoginForm onSuccess={handleSuccess} />
            </TabsContent>
            
            <TabsContent value="signup">
              <SignupForm onSuccess={handleSuccess} />
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
