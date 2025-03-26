// src/components/layout/MainLayout.jsx
// Purpose: Main layout component with correctly imported icons
// Note: Using proper icon names from lucide-react library
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Sun, 
  Moon, 
  Menu, 
  X,
  LayoutDashboard, 
  Building2, 
  Users, 
  Wrench, 
  Wallet,
  LogOut 
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { authService } from '../../services/api';

const MainLayout = ({ children }) => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Properties', path: '/properties', icon: Building2 },
    { name: 'Tenants', path: '/tenants', icon: Users },
    { name: 'Maintenance', path: '/maintenance', icon: Wrench },
    { name: 'Payments', path: '/payments', icon: Wallet }
  ];

  const isActive = (path) => {
    return location.pathname === path ||
           (path !== '/' && location.pathname.startsWith(path));
  };

  return (
    <div className={theme}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Desktop Sidebar */}
        <div className="hidden md:fixed md:flex md:w-64 md:flex-col md:h-screen">
          <div className="flex flex-col flex-1 min-h-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
            <div className="flex items-center h-16 flex-shrink-0 px-4 border-b border-gray-200 dark:border-gray-700">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                PropertyPro
              </h1>
            </div>
            <div className="flex-1 flex flex-col overflow-y-auto">
              <nav className="flex-1 px-4 py-4 space-y-1">
                {navigation.map((item) => {
                  const active = isActive(item.path);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`
                        flex items-center px-4 py-2 rounded-lg text-sm font-medium
                        ${active 
                          ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/50 dark:text-primary-400'
                          : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700'
                        }
                      `}
                    >
                      <item.icon className={`
                        mr-3 h-5 w-5
                        ${active 
                          ? 'text-primary-600 dark:text-primary-400'
                          : 'text-gray-400 dark:text-gray-500'
                        }
                      `} />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>

        {/* Mobile Header */}
        <div className="md:pl-64 flex flex-col flex-1">
          <div className="sticky top-0 z-10 flex-shrink-0 h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 md:border-b">
            <div className="flex items-center justify-between h-full px-4 md:px-6">
              <div className="flex items-center md:hidden">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  {isMobileMenuOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </button>
              </div>

              <div className="flex items-center space-x-4">
                <button
                  onClick={toggleTheme}
                  className="p-2 text-gray-500 hover:text-gray-600 dark:text-gray-400 
                           dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 
                           dark:hover:bg-gray-700"
                >
                  {theme === 'dark' ? (
                    <Sun className="h-5 w-5" />
                  ) : (
                    <Moon className="h-5 w-5" />
                  )}
                </button>
                <button
                  onClick={() => authService.logout()}
                  className="p-2 text-gray-500 hover:text-gray-600 dark:text-gray-400 
                           dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 
                           dark:hover:bg-gray-700"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden fixed inset-0 z-40 bg-gray-600 bg-opacity-75">
              <div className="fixed inset-y-0 left-0 w-full max-w-xs bg-white dark:bg-gray-800">
                <div className="h-full flex flex-col">
                  <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                      PropertyPro
                    </h1>
                    <button
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-gray-500"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>
                  <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
                    {navigation.map((item) => {
                      const active = isActive(item.path);
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`
                            flex items-center px-4 py-2 rounded-lg text-sm font-medium
                            ${active 
                              ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/50 dark:text-primary-400'
                              : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700'
                            }
                          `}
                        >
                          <item.icon className={`
                            mr-3 h-5 w-5
                            ${active 
                              ? 'text-primary-600 dark:text-primary-400'
                              : 'text-gray-400 dark:text-gray-500'
                            }
                          `} />
                          {item.name}
                        </Link>
                      );
                    })}
                  </nav>
                </div>
              </div>
            </div>
          )}

          {/* Main Content */}
          <main className="flex-1">
            <div className="py-6 px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;