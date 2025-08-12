import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';
import { selectUser } from '../../store/slices/authSlice';
import { useLogout } from '../../api/authApi';

function UserMenu() {
  const user = useAppSelector(selectUser);
  const logoutMutation = useLogout();
  
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      setIsOpen(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const closeMenu = () => setIsOpen(false);

  return (
    <div className="relative" ref={menuRef}>
      {/* User Button */}
      <button
        type="button"
        className="flex items-center gap-2 text-white hover:opacity-80 transition-opacity"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
          <span className="text-sm font-medium text-gray-800">
            {user?.displayName?.charAt(0)?.toUpperCase() || 'U'}
          </span>
        </div>
        <svg 
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg py-1 z-50">
          {/* User Info */}
          <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
            <div className="font-medium">{user?.displayName}</div>
            <div className="text-gray-500 text-xs">
              {user?.email}
            </div>
          </div>
          
          {/* Menu Items */}
          <Link
            to="/dashboard"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 no-underline"
            onClick={closeMenu}
          >
            Dashboard
          </Link>
          
          <Link
            to="/users"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 no-underline"
            onClick={closeMenu}
          >
            Team Management
          </Link>
          
          <div className="border-t border-gray-100"></div>
          
          <button
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
          >
            {logoutMutation.isPending ? 'Signing out...' : 'Sign out'}
          </button>
        </div>
      )}
    </div>
  );
}

export default UserMenu;