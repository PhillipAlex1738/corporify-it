
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Link, useLocation } from 'react-router-dom';
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
  const location = useLocation();
  
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

  const scrollToSection = (sectionId: string) => {
    if (location.pathname !== '/') {
      // If not on the landing page, navigate to it with hash
      window.location.href = `/#${sectionId}`;
      return;
    }
    
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header className="w-full py-4 px-6 bg-white shadow-sm">
      <div className="container max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Link to="/" className="bg-corporate-gradient p-2 rounded-lg">
            <h1 className="text-white font-bold text-xl">Corporify It</h1>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <button 
            onClick={() => scrollToSection('features')} 
            className="text-corporate-800 hover:text-corporate-500 font-medium"
          >
            Features
          </button>
          <button 
            onClick={() => scrollToSection('testimonials')} 
            className="text-corporate-800 hover:text-corporate-500 font-medium"
          >
            Testimonials
          </button>
          <Link 
            to="/app" 
            className="text-corporate-800 hover:text-corporate-500 font-medium"
          >
            Try It
          </Link>
        </nav>
        
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <div className="flex items-center gap-2">
                <UserRound className="h-4 w-4 text-corporate-600" />
                <span className="text-sm font-medium">{user.email}</span>
              </div>
              
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
                className="text-corporate-800 hover:text-corporate-500"
                onClick={() => setIsAuthModalOpen(true)}
              >
                Sign In
              </Button>
              <Button 
                className="bg-corporate-500 hover:bg-corporate-600"
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
            <X className="h-6 w-6 text-corporate-800" />
          ) : (
            <Menu className="h-6 w-6 text-corporate-800" />
          )}
        </button>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-md z-50 py-4 px-6">
          <nav className="flex flex-col space-y-4">
            <button 
              onClick={() => scrollToSection('features')} 
              className="text-corporate-800 hover:text-corporate-500 font-medium py-2"
            >
              Features
            </button>
            <button 
              onClick={() => scrollToSection('testimonials')} 
              className="text-corporate-800 hover:text-corporate-500 font-medium py-2"
            >
              Testimonials
            </button>
            <Link 
              to="/app" 
              className="text-corporate-800 hover:text-corporate-500 font-medium py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Try It
            </Link>
            
            <div className="pt-4 border-t">
              {user ? (
                <>
                  <div className="flex items-center gap-2 py-2">
                    <UserRound className="h-4 w-4 text-corporate-600" />
                    <span className="text-sm font-medium">{user.email}</span>
                  </div>
                  
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
                    className="text-corporate-800 hover:text-corporate-500 w-full mb-2"
                    onClick={() => {
                      setIsAuthModalOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Sign In
                  </Button>
                  <Button 
                    className="bg-corporate-500 hover:bg-corporate-600 w-full"
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
