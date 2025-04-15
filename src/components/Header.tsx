
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import AuthModal from '@/components/AuthModal';
import PricingModal from '@/components/PricingModal';
import { UserRound, LogOut, Clock } from 'lucide-react';

const Header = () => {
  const { user, logout } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);

  return (
    <header className="w-full py-4 px-6 border-b shadow-sm">
      <div className="container flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="corporify-gradient p-2 rounded-lg">
            <h1 className="text-white font-bold text-xl">Corporify It</h1>
          </div>
          <p className="text-sm text-muted-foreground hidden md:block">
            Transform casual text into polished corporate language
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <div className="hidden md:flex items-center gap-2">
                <UserRound className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{user.email}</span>
              </div>
              
              <Button 
                onClick={() => setIsPricingModalOpen(true)}
                variant="outline" 
                size="sm"
                className="hidden md:flex border-corporate-500 text-corporate-800 hover:bg-corporate-50"
              >
                <Clock className="h-4 w-4 mr-1" /> Premium (Coming Soon)
              </Button>
              
              <Button 
                onClick={logout}
                variant="ghost" 
                size="sm"
                className="text-gray-500"
              >
                <LogOut className="h-4 w-4 mr-1" />
                <span className="hidden md:inline">Logout</span>
              </Button>
            </>
          ) : (
            <Button 
              onClick={() => setIsAuthModalOpen(true)}
              className="bg-corporate-800 hover:bg-corporate-900"
            >
              Sign In
            </Button>
          )}
        </div>
      </div>

      {/* Modals */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
      <PricingModal 
        isOpen={isPricingModalOpen} 
        onClose={() => setIsPricingModalOpen(false)} 
      />
    </header>
  );
};

export default Header;
