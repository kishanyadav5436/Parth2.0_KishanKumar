import { Link } from "react-router-dom";
import { Menu, Search, User, Home, Moon, Sun, Settings, LogOut, Wrench, ChevronDown, BookOpen } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { Badge } from "./ui/badge";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, theme, toggleTheme } = useAppContext();

  const isProvider = user?.role === 'provider';

  return (
    <nav className="bg-white dark:bg-slate-900/80 dark:backdrop-blur-xl shadow-sm dark:shadow-slate-900/50 sticky top-0 z-50 transition-colors duration-300 border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="h-9 w-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-md shadow-blue-600/20 group-hover:scale-110 transition-transform">
              <Home className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-black text-slate-900 dark:text-white tracking-tight">ServiceHub</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/services" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-semibold transition-colors">
              Browse Services
            </Link>
            {isProvider ? (
              <Link to="/settings" className="flex items-center space-x-1.5 text-emerald-600 dark:text-emerald-400 font-bold hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors">
                <Wrench className="h-4 w-4" />
                <span>Provider Dashboard</span>
              </Link>
            ) : (
              <Link to="/auth?role=provider" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-semibold transition-colors">
                Become a Provider
              </Link>
            )}
          </div>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center space-x-2">
            {/* Theme Toggle */}
            <Button variant="ghost" size="sm" onClick={toggleTheme} className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl">
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </Button>

            {/* Search */}
            <Button variant="ghost" size="sm" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl" onClick={() => navigate('/services')}>
              <Search className="h-5 w-5" />
            </Button>

            {/* Auth / User Section */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 rounded-xl px-3 py-2 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <div className={`flex items-center justify-center h-8 w-8 rounded-full font-bold text-white text-sm shadow-md ${isProvider ? 'bg-emerald-600 shadow-emerald-600/20' : 'bg-blue-600 shadow-blue-600/20'}`}>
                    {user.name?.[0]?.toUpperCase()}
                  </div>
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{user.name}</span>
                  {isProvider && (
                    <Badge className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 text-[10px] px-1.5 py-0 font-black uppercase tracking-tight">
                      Pro
                    </Badge>
                  )}
                  <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-xl dark:shadow-black/40 border border-slate-200 dark:border-slate-800 overflow-hidden z-50">
                    {/* Role Banner */}
                    <div className={`px-4 py-3 ${isProvider ? 'bg-emerald-50 dark:bg-emerald-900/20' : 'bg-blue-50 dark:bg-blue-900/20'}`}>
                      <p className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Signed in as</p>
                      <p className={`font-black text-sm ${isProvider ? 'text-emerald-700 dark:text-emerald-400' : 'text-blue-700 dark:text-blue-400'}`}>
                        {isProvider ? '🔧 Service Provider' : '👤 Customer'}
                      </p>
                    </div>
                    <div className="p-2">
                      <Link
                        to="/bookings"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <BookOpen className="h-4 w-4 mr-3 text-slate-400" />
                        My Bookings
                      </Link>
                      <Link
                        to="/settings"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <Settings className="h-4 w-4 mr-3 text-slate-400" />
                        Settings
                      </Link>
                      <button
                        onClick={() => { setIsUserMenuOpen(false); }}
                        className="flex items-center w-full px-3 py-2 rounded-xl text-sm font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
                      >
                        <LogOut className="h-4 w-4 mr-3" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/auth">
                  <Button variant="ghost" size="sm" className="font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl">
                    Sign In
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md shadow-blue-600/20 border-0">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-2 md:hidden">
            <Button variant="ghost" size="sm" onClick={toggleTheme} className="text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl">
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </Button>
            <button
              className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex flex-col space-y-1">
              {user && (
                <div className={`mx-1 px-4 py-3 rounded-xl mb-2 ${isProvider ? 'bg-emerald-50 dark:bg-emerald-900/20' : 'bg-blue-50 dark:bg-blue-900/20'}`}>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Logged in as</p>
                  <p className={`font-black text-sm ${isProvider ? 'text-emerald-700 dark:text-emerald-400' : 'text-blue-700 dark:text-blue-400'}`}>
                    {isProvider ? '🔧 Provider · ' : '👤 Customer · '}{user.name}
                  </p>
                </div>
              )}
              <Link to="/services" className="px-4 py-2.5 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                Browse Services
              </Link>
              {isProvider ? (
                <Link to="/settings" className="px-4 py-2.5 rounded-xl text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 font-bold transition-colors flex items-center" onClick={() => setIsMobileMenuOpen(false)}>
                  <Wrench className="h-4 w-4 mr-2" /> Provider Dashboard
                </Link>
              ) : (
                <Link to="/auth?role=provider" className="px-4 py-2.5 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                  Become a Provider
                </Link>
              )}
              {user ? (
                <>
                  <Link to="/bookings" className="px-4 py-2.5 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold transition-colors flex items-center" onClick={() => setIsMobileMenuOpen(false)}>
                    <BookOpen className="h-4 w-4 mr-2 text-slate-400" /> My Bookings
                  </Link>
                  <Link to="/settings" className="px-4 py-2.5 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold transition-colors flex items-center" onClick={() => setIsMobileMenuOpen(false)}>
                    <Settings className="h-4 w-4 mr-2 text-slate-400" /> Settings
                  </Link>
                  <button 
                    onClick={() => { setIsMobileMenuOpen(false); /* logout logic here */ }}
                    className="text-left w-full px-4 py-2.5 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 font-semibold transition-colors flex items-center"
                  >
                    <LogOut className="h-4 w-4 mr-2" /> Sign Out
                  </button>
                </>
              ) : (
                <Link to="/auth" className="px-4 py-2.5 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                  Sign In
                </Link>
              )}

            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
