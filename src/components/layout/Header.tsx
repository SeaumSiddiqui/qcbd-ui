import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Menu, X, ChevronDown } from 'lucide-react';
import { ThemeToggle } from '../ui/ThemeToggle';
import { UserMenu } from '../ui/UserMenu';
import { RoleBasedAccess, StaffOnly, UserOnly, AdminOrAgent } from '../auth/RoleBasedAccess';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';

interface HeaderProps {
  onMenuToggle?: () => void;
  isMobileMenuOpen?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onMenuToggle,
  isMobileMenuOpen
}) => {
  const { isAuthenticated, user, login, logout } = useAuth();

  const scrollToFooter = () => {
    const footer = document.querySelector('footer');
    if (footer) {
      footer.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="relative z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-primary-900 dark:bg-secondary-500 rounded-lg">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Qatar Charity
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Bangladesh
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={scrollToFooter}
              className="text-gray-700 dark:text-gray-300 hover:text-primary-900 dark:hover:text-secondary-500 transition-colors duration-200"
            >
              About
            </button>
            
            <StaffOnly>
              <div className="relative group z-50">
                <button className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-primary-900 dark:hover:text-secondary-500 transition-colors duration-200">
                  <span>Programs</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
                <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[100] focus:outline-none">
                  <div className="py-1">
                    <Link
                      to="/applications/create"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 focus:outline-none"
                    >
                      Orphan Campaign
                    </Link>
                  </div>
                </div>
              </div>
            </StaffOnly>

            <StaffOnly>
              <div className="relative group z-50">
                <button className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-primary-900 dark:hover:text-secondary-500 transition-colors duration-200">
                  <span>Application Dashboard</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
                <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[100]">
                  <div className="py-1">
                    <Link
                      to="/applications"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                    >
                      Orphan Applications
                    </Link>
                  </div>
                </div>
              </div>
            </StaffOnly>

            <AdminOrAgent>
              <div className="relative group z-50">
                <button className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-primary-900 dark:hover:text-secondary-500 transition-colors duration-200">
                  <span>User Management</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
                <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[100]">
                  <div className="py-1">
                    <Link
                      to="/users/create"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                    >
                      Create User
                    </Link>
                  </div>
                </div>
              </div>
            </AdminOrAgent>

            <UserOnly>
              <div className="relative group z-50">
                <button className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-primary-900 dark:hover:text-secondary-500 transition-colors duration-200">
                  <span>Dashboard</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
                <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[100]">
                  <div className="py-1">
                    <Link
                      to="/applications/create"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                    >
                      My Enrollments
                    </Link>
                  </div>
                </div>
              </div>
            </UserOnly>
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Authentication Section */}
            {isAuthenticated ? (
              <div className="hidden md:block">
                <UserMenu />
              </div>
            ) : (
              <Button
                onClick={login}
                variant="primary"
                className="bg-primary text-primary-900 hover:bg-gray-100 dark:bg-dark-primary-100 dark:text-dark-primary-900 dark:hover:bg-dark-primary-200 hidden md:inline-flex"
              >
                Sign In
              </Button>
            )}

            <ThemeToggle />
            <button
              onClick={onMenuToggle}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-primary-900 hover:bg-gray-100 dark:hover:text-secondary-500 dark:hover:bg-gray-800 transition-colors duration-200"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden animate-slide-down">
            <div className="px-2 pt-2 pb-3 space-y-1 border-t border-gray-200 dark:border-gray-700">
              {/* Mobile Auth Section */}
              {isAuthenticated ? (
                <div className="px-3 py-2 mb-3">
                  <UserMenu />
                </div>
              ) : (
                <div className="px-3 py-2 mb-3">
                  <Button
                    onClick={login}
                    variant="primary"
                    size="sm"
                    className="w-full"
                  >
                    Sign In
                  </Button>
                </div>
              )}

              <button
                onClick={scrollToFooter}
                className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-primary-900 dark:hover:text-secondary-500 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors duration-200"
              >
                About
              </button>
              
              <StaffOnly>
                <div className="space-y-1">
                  <div className="px-3 py-2 text-sm font-semibold text-gray-900 dark:text-white">
                    Programs
                  </div>
                  <Link
                    to="/applications/create"
                    className="block px-6 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-primary-900 dark:hover:text-secondary-500 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors duration-200"
                  >
                    Orphan Campaign
                  </Link>
                </div>
              </StaffOnly>

              <StaffOnly>
                <div className="space-y-1">
                  <div className="px-3 py-2 text-sm font-semibold text-gray-900 dark:text-white">
                    Application Dashboard
                  </div>
                  <Link
                    to="/applications"
                    className="block px-6 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-primary-900 dark:hover:text-secondary-500 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors duration-200"
                  >
                    Orphan Applications
                  </Link>
                </div>
              </StaffOnly>

              <AdminOrAgent>
                <div className="space-y-1">
                  <div className="px-3 py-2 text-sm font-semibold text-gray-900 dark:text-white">
                    User Management
                  </div>
                  <Link
                    to="/users/create"
                    className="block px-6 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-primary-900 dark:hover:text-secondary-500 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors duration-200"
                  >
                    Create User
                  </Link>
                </div>
              </AdminOrAgent>

              <UserOnly>
                <div className="space-y-1">
                  <div className="px-3 py-2 text-sm font-semibold text-gray-900 dark:text-white">
                    Dashboard
                  </div>
                  <Link
                    to="/applications/create"
                    className="block px-6 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-primary-900 dark:hover:text-secondary-500 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors duration-200"
                  >
                    My Enrollments
                  </Link>
                </div>
              </UserOnly>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};