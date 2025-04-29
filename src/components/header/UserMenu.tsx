
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { LogOut, UserRound } from 'lucide-react';
import AuthModal from '@/components/AuthModal';

type UserMenuProps = {
  isMobile?: boolean;
  onModalOpen?: () => void;
};

const UserMenu = ({ isMobile = false, onModalOpen }: UserMenuProps) => {
  const { user, logout } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      console.log("Starting logout process");
      await logout();
      console.log("Logout completed successfully");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleAuthModalOpen = () => {
    setIsAuthModalOpen(true);
    if (onModalOpen) onModalOpen();
  };

  if (user) {
    return (
      <>
        <div className={`flex items-center gap-2 ${isMobile ? 'py-2' : ''}`}>
          <UserRound className="h-4 w-4 text-corporate-600" />
          <span className="text-sm font-medium">{user.email}</span>
        </div>
        
        <Button 
          onClick={handleLogout}
          variant="ghost" 
          size="sm"
          className={`text-gray-500 hover:text-gray-700 hover:bg-gray-100 ${isMobile ? 'w-full' : ''}`}
          disabled={isLoggingOut}
        >
          <LogOut className="h-4 w-4 mr-1" />
          <span>{isLoggingOut ? "Logging out..." : "Sign Out"}</span>
        </Button>
      </>
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
