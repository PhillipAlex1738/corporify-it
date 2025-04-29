
import NavigationItems from './NavigationItems';
import UserMenu from './UserMenu';

type MobileMenuProps = {
  isOpen: boolean;
  onClose: () => void;
};

const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  if (!isOpen) return null;

  return (
    <div className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-md z-50 py-4 px-6">
      <nav className="flex flex-col space-y-4">
        <NavigationItems isMobile onItemClick={onClose} />
        
        <div className="pt-4 border-t">
          <UserMenu isMobile onModalOpen={onClose} />
        </div>
      </nav>
    </div>
  );
};

export default MobileMenu;
