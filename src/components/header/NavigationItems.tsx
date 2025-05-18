
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CreditCard } from 'lucide-react';
import { useState } from 'react';
import PricingModal from '@/components/PricingModal';

type NavigationItemsProps = {
  isMobile?: boolean;
  onItemClick?: () => void;
};

const NavigationItems = ({ isMobile = false, onItemClick }: NavigationItemsProps) => {
  const location = useLocation();
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    if (location.pathname !== '/') {
      // If not on the landing page, navigate to it with hash
      window.location.href = `/#${sectionId}`;
      return;
    }
    
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
      if (onItemClick) onItemClick();
    }
  };

  const baseClassName = isMobile 
    ? "text-corporate-800 hover:text-corporate-500 font-medium py-2" 
    : "text-corporate-800 hover:text-corporate-500 font-medium";

  const handlePremiumClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsPricingModalOpen(true);
    if (onItemClick) onItemClick();
  };

  return (
    <>
      <button 
        onClick={() => scrollToSection('features')} 
        className={baseClassName}
      >
        Features
      </button>
      <button 
        onClick={() => scrollToSection('pricing')} 
        className={baseClassName}
      >
        Pricing
      </button>
      <button 
        onClick={() => scrollToSection('how-it-works')} 
        className={baseClassName}
      >
        How It Works
      </button>
      <Link 
        to="/app" 
        className={baseClassName}
        onClick={onItemClick}
      >
        Try It
      </Link>
      {location.pathname === '/app' && (
        <Link 
          to="#" 
          onClick={handlePremiumClick}
          className={baseClassName + " ml-2 px-4 py-1 bg-corporate-800 text-white rounded hover:bg-corporate-700 flex items-center"}
        >
          <CreditCard className="mr-1 h-4 w-4" />
          Premium
        </Link>
      )}
      <PricingModal isOpen={isPricingModalOpen} onClose={() => setIsPricingModalOpen(false)} />
    </>
  );
};

export default NavigationItems;
