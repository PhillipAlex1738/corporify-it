
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
import LoginForm from './auth/LoginForm';
import SignupForm from './auth/SignupForm';

type AuthModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const { user } = useAuth();
  
  // If user becomes authenticated while modal is open, close it
  useEffect(() => {
    if (user && isOpen) {
      console.log("User detected, closing auth modal:", user.email);
      onClose();
    }
  }, [user, isOpen, onClose]);
  
  // Reset states when modal closes
  useEffect(() => {
    if (!isOpen) {
      // Reset tab to login when modal is closed
      setActiveTab('login');
    }
  }, [isOpen]);

  const handleSuccess = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
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
            <LoginForm onSuccess={handleSuccess} />
          </TabsContent>
          
          <TabsContent value="signup">
            <SignupForm onSuccess={handleSuccess} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
