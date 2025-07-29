import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

function Navbar() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const CubeIcon = () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-white"
    >
      <path
        d="M12 2L2 7v10l10 5 10-5V7l-10-5z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2 7l10 5 10-5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 22V12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  return (
    <nav className="bg-primary px-4 sm:px-6 py-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        {/* Logo Section */}
        <Link
          to="/"
          className="flex items-center gap-3 text-white no-underline hover:opacity-90 transition-opacity"
        >
          <CubeIcon />
          <span className="text-lg sm:text-xl font-bold">Tracks Cargo</span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            to="/"
            className={`text-white no-underline hover:opacity-80 transition-opacity font-medium ${
              location.pathname === "/" ? "opacity-100" : "opacity-90"
            }`}
          >
            Track Package
          </Link>
          <Link
            to="/admin"
            className={`text-white no-underline hover:opacity-80 transition-opacity font-medium ${
              location.pathname === "/admin" ? "opacity-100" : "opacity-90"
            }`}
          >
            Admin
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button 
            className="text-white p-2 hover:opacity-80 transition-opacity"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-primary border-t border-white border-opacity-20">
          <div className="px-4 sm:px-6 py-4 space-y-3">
            <Link
              to="/"
              className={`block text-white no-underline hover:opacity-80 transition-opacity font-medium py-2 ${
                location.pathname === "/" ? "opacity-100" : "opacity-90"
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Track Package
            </Link>
            <Link
              to="/admin"
              className={`block text-white no-underline hover:opacity-80 transition-opacity font-medium py-2 ${
                location.pathname === "/admin" ? "opacity-100" : "opacity-90"
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Admin
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
