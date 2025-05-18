
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
  const { user, isLoading } = useAuth();
  
  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      console.log("Auth modal opened, setting tab to login");
      setActiveTab('login');
    }
  }, [isOpen]);
  
  // If user becomes authenticated while modal is open, close it
  useEffect(() => {
    if (user && isOpen) {
      console.log("User detected, closing auth modal:", user.email);
      onClose();
    }
  }, [user, isOpen, onClose]);

  const handleSuccess = () => {
    console.log("Auth success, closing modal");
    onClose();
  };

  // Helper to prevent closing when in loading state
  const handleOpenChange = (open: boolean) => {
    if (!open && !isLoading) {
      onClose();
    }
  };

  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={handleOpenChange}
    >
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
          <Tabs 
            value={activeTab} 
            onValueChange={(v) => setActiveTab(v as 'login' | 'signup')}
            defaultValue="login"
          >
            <TabsList className="grid w-full grid-cols-2 mb-4 bg-gray-100">
              <TabsTrigger 
                value="login" 
                className="data-[state=active]:bg-white data-[state=active]:shadow-none"
                disabled={isLoading}
              >
                Login
              </TabsTrigger>
              <TabsTrigger 
                value="signup"
                className="data-[state=active]:bg-white data-[state=active]:shadow-none"
                disabled={isLoading}
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
