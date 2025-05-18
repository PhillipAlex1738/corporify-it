
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { LogOut, UserRound, CreditCard } from 'lucide-react';
import AuthModal from '@/components/AuthModal';
import PricingModal from '@/components/PricingModal';
import { useToast } from '@/components/ui/use-toast';

type UserMenuProps = {
  isMobile?: boolean;
  onModalOpen?: () => void;
};

const UserMenu = ({ isMobile = false, onModalOpen }: UserMenuProps) => {
  const { user, logout } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      console.log("Starting logout process");
      await logout();
      console.log("Logout completed successfully");
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account."
      });
    } catch (error) {
      console.error("Logout failed:", error);
      toast({
        title: "Logout failed",
        description: "There was an issue logging out. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleAuthModalOpen = () => {
    setIsAuthModalOpen(true);
    if (onModalOpen) onModalOpen();
  };

  const handlePremiumClick = () => {
    setIsPricingModalOpen(true);
    if (onModalOpen) onModalOpen();
  };

  if (user) {
    console.log("Rendering user menu for authenticated user:", user.email);
    return (
      <div className={`flex ${isMobile ? 'flex-col' : 'items-center'} gap-2`}>
        <div className={`flex items-center gap-2 ${isMobile ? 'py-2' : ''}`}>
          <UserRound className="h-4 w-4 text-corporate-600" />
          <span className="text-sm font-medium">{user.email}</span>
        </div>
        
        <Button 
          onClick={handlePremiumClick}
          variant="outline" 
          size="sm"
          className={`text-corporate-800 hover:text-corporate-600 hover:bg-corporate-50 ${isMobile ? 'w-full justify-start' : ''}`}
        >
          <CreditCard className="h-4 w-4 mr-1" />
          <span>Go Premium</span>
        </Button>
        
        <Button 
          onClick={handleLogout}
          variant="ghost" 
          size="sm"
          className={`text-gray-500 hover:text-gray-700 hover:bg-gray-100 ${isMobile ? 'w-full justify-start' : ''}`}
          disabled={isLoggingOut}
        >
          <LogOut className="h-4 w-4 mr-1" />
          <span>{isLoggingOut ? "Logging out..." : "Sign Out"}</span>
        </Button>

        <PricingModal isOpen={isPricingModalOpen} onClose={() => setIsPricingModalOpen(false)} />
      </div>
    );
  }
  
  return (
    <>
      <Button 
        variant="ghost"
        className={`text-corporate-800 hover:text-corporate-500 ${isMobile ? 'w-full' : ''}`}
        onClick={handleAuthModalOpen}
      >
        Sign In
      </Button>
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </>
  );
};

export default UserMenu;
