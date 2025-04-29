
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';

type NavigationItemsProps = {
  isMobile?: boolean;
  onItemClick?: () => void;
};

const NavigationItems = ({ isMobile = false, onItemClick }: NavigationItemsProps) => {
  const location = useLocation();

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

  return (
    <>
      <button 
        onClick={() => scrollToSection('features')} 
        className={baseClassName}
      >
        Features
      </button>
      <button 
        onClick={() => scrollToSection('testimonials')} 
        className={baseClassName}
      >
        Testimonials
      </button>
      <Link 
        to="/app" 
        className={baseClassName}
        onClick={onItemClick}
      >
        Try It
      </Link>
    </>
  );
};

export default NavigationItems;
