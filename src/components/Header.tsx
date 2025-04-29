
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import PricingModal from '@/components/PricingModal';
import { HeaderLogo, NavigationItems, UserMenu, MobileMenu } from '@/components/header';

const Header = () => {
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  return (
    <header className="w-full py-4 px-6 bg-white shadow-sm">
      <div className="container max-w-7xl mx-auto flex justify-between items-center">
        <HeaderLogo />
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <NavigationItems />
        </nav>
        
        <div className="hidden md:flex items-center gap-3">
          <UserMenu />
        </div>
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6 text-corporate-800" />
          ) : (
            <Menu className="h-6 w-6 text-corporate-800" />
          )}
        </button>
      </div>
      
      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />

      {/* Modals */}
      <PricingModal
        isOpen={isPricingModalOpen}
        onClose={() => setIsPricingModalOpen(false)}
      />
    </header>
  );
};

export default Header;
