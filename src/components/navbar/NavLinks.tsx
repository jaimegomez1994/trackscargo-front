import { Link, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';
import { selectAuth } from '../../store/slices/authSlice';
import { useLogout } from '../../api/authApi';
import UserMenu from './UserMenu';

interface NavLinksProps {
  isMobile?: boolean;
  onLinkClick?: () => void;
}

function NavLinks({ isMobile = false, onLinkClick }: NavLinksProps) {
  const location = useLocation();
  const { isAuthenticated } = useAppSelector(selectAuth);
  const logoutMutation = useLogout();

  const handleMobileLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      onLinkClick?.();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const linkClassName = (path: string) => {
    const isActive = location.pathname === path;
    const baseClasses = isMobile 
      ? "block text-white no-underline hover:opacity-80 transition-opacity font-medium py-2"
      : "text-white no-underline hover:opacity-80 transition-opacity font-medium";
    
    return `${baseClasses} ${isActive ? "opacity-100" : "opacity-90"}`;
  };

  const containerClassName = isMobile 
    ? "space-y-3"
    : "hidden md:flex items-center gap-8";

  return (
    <div className={containerClassName}>
      {/* Public Link */}
      <Link
        to="/"
        className={linkClassName("/")}
        onClick={onLinkClick}
      >
        Track Package
      </Link>
      
      {isAuthenticated ? (
        <>
          {/* Authenticated Links */}
          <Link
            to="/dashboard"
            className={linkClassName("/dashboard")}
            onClick={onLinkClick}
          >
            Dashboard
          </Link>
          
          {/* User Menu (Desktop Only) */}
          {!isMobile && <UserMenu />}
          
          {/* Mobile User Menu Items */}
          {isMobile && (
            <>
              <Link
                to="/users"
                className={linkClassName("/users")}
                onClick={onLinkClick}
              >
                Team Management
              </Link>
              
              <button
                onClick={handleMobileLogout}
                disabled={logoutMutation.isPending}
                className="block text-left text-white hover:opacity-80 transition-opacity font-medium py-2 disabled:opacity-50"
              >
                {logoutMutation.isPending ? 'Signing out...' : 'Sign Out'}
              </button>
            </>
          )}
        </>
      ) : (
        <>
          {/* Guest Links */}
          <Link
            to="/login"
            className={isMobile ? linkClassName("/login") : "text-white no-underline hover:opacity-80 transition-opacity font-medium"}
            onClick={onLinkClick}
          >
            Sign In
          </Link>

          {/* Hidden for now - Get Started button */}
          {/* <Link
            to="/signup"
            className={isMobile
              ? linkClassName("/signup")
              : "bg-white text-primary px-4 py-2 rounded-md no-underline hover:bg-gray-100 transition-colors font-medium"
            }
            onClick={onLinkClick}
          >
            Get Started
          </Link> */}
        </>
      )}
    </div>
  );
}

export default NavLinks;