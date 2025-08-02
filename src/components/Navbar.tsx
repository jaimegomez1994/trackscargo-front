import { useState } from "react";
import Logo from "./navbar/Logo";
import NavLinks from "./navbar/NavLinks";
import MobileMenuButton from "./navbar/MobileMenuButton";

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <nav className="bg-primary px-4 sm:px-6 py-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Logo />

        {/* Desktop Navigation */}
        <NavLinks />

        {/* Mobile Menu Button */}
        <MobileMenuButton 
          isOpen={isMobileMenuOpen} 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
        />
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-primary border-t border-white border-opacity-20">
          <div className="px-4 sm:px-6 py-4">
            <NavLinks isMobile onLinkClick={closeMobileMenu} />
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
