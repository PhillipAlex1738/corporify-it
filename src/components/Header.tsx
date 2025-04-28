
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import AuthModal from '@/components/AuthModal';
import PricingModal from '@/components/PricingModal';
import { UserRound, LogOut, Clock, Menu, X } from 'lucide-react';

const Header = () => {
  const { user, logout } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    console.log("Header: User auth state:", user ? `Authenticated as ${user.email}` : "Not authenticated");
  }, [user]);

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

  return (
    <header className="w-full py-4 px-6 bg-white shadow-sm">
      <div className="container max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="corporify-gradient p-2 rounded-lg">
            <h1 className="text-white font-bold text-xl">Corporify</h1>
          </div>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-navy-800 hover:text-coral-500 font-medium">Features</a>
          <a href="#pricing" className="text-navy-800 hover:text-coral-500 font-medium">Pricing</a>
          <a href="#testimonials" className="text-navy-800 hover:text-coral-500 font-medium">Testimonials</a>
          <a href="#demo" className="text-navy-800 hover:text-coral-500 font-medium">Try it</a>
        </nav>
        
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <div className="flex items-center gap-2">
                <UserRound className="h-4 w-4 text-navy-600" />
                <span className="text-sm font-medium">{user.email}</span>
              </div>
              
              <Button 
                onClick={() => setIsPricingModalOpen(true)}
                variant="outline" 
                size="sm"
                className="border-coral-500 text-coral-500 hover:bg-coral-50"
              >
                <Clock className="h-4 w-4 mr-1" /> Premium
              </Button>
              
              <Button 
                onClick={handleLogout}
                variant="ghost" 
                size="sm"
                className="text-gray-500"
                disabled={isLoggingOut}
              >
                <LogOut className="h-4 w-4 mr-1" />
                <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
              </Button>
            </>
          ) : (
            <>
              <Button 
                variant="ghost"
                className="text-navy-800 hover:text-coral-500"
                onClick={() => setIsAuthModalOpen(true)}
              >
                Sign In
              </Button>
              <Button 
                className="bg-coral-500 hover:bg-coral-600"
                onClick={() => setIsAuthModalOpen(true)}
              >
                Get Started
              </Button>
            </>
          )}
        </div>
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6 text-navy-800" />
          ) : (
            <Menu className="h-6 w-6 text-navy-800" />
          )}
        </button>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-md z-50 py-4 px-6">
          <nav className="flex flex-col space-y-4">
            <a 
              href="#features" 
              className="text-navy-800 hover:text-coral-500 font-medium py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Features
            </a>
            <a 
              href="#pricing" 
              className="text-navy-800 hover:text-coral-500 font-medium py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Pricing
            </a>
            <a 
              href="#testimonials" 
              className="text-navy-800 hover:text-coral-500 font-medium py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Testimonials
            </a>
            <a 
              href="#demo" 
              className="text-navy-800 hover:text-coral-500 font-medium py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Try it
            </a>
            
            <div className="pt-4 border-t">
              {user ? (
                <>
                  <div className="flex items-center gap-2 py-2">
                    <UserRound className="h-4 w-4 text-navy-600" />
                    <span className="text-sm font-medium">{user.email}</span>
                  </div>
                  
                  <Button 
                    onClick={() => {
                      setIsPricingModalOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                    variant="outline" 
                    size="sm"
                    className="border-coral-500 text-coral-500 hover:bg-coral-50 w-full mb-2"
                  >
                    <Clock className="h-4 w-4 mr-1" /> Premium
                  </Button>
                  
                  <Button 
                    onClick={handleLogout}
                    variant="ghost" 
                    size="sm"
                    className="text-gray-500 w-full"
                    disabled={isLoggingOut}
                  >
                    <LogOut className="h-4 w-4 mr-1" />
                    <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    variant="ghost"
                    className="text-navy-800 hover:text-coral-500 w-full mb-2"
                    onClick={() => {
                      setIsAuthModalOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Sign In
                  </Button>
                  <Button 
                    className="bg-coral-500 hover:bg-coral-600 w-full"
                    onClick={() => {
                      setIsAuthModalOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Get Started
                  </Button>
                </>
              )}
            </div>
          </nav>
        </div>
      )}

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
