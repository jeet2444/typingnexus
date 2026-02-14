import React, { useState, useEffect } from 'react';
import { Menu, User, LogOut, ShieldCheck, X, Zap, ChevronDown } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAdminStore, SiteSettings } from '../utils/adminStore';

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, isAuthenticated, isAdmin, logout } = useAuth();
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [announcement, setAnnouncement] = useState<any>(null); // [NEW]
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const loadStoreData = () => {
      const store = getAdminStore();
      setSettings(store.settings);
      // Find active announcement
      const active = (store.announcements || []).find((a: any) => a.isActive);
      setAnnouncement(active || null);
    };

    loadStoreData();

    window.addEventListener('adminStoreUpdate', loadStoreData);
    window.addEventListener('storage', loadStoreData);

    return () => {
      window.removeEventListener('adminStoreUpdate', loadStoreData);
      window.removeEventListener('storage', loadStoreData);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);

  // Get visible nav links from admin settings
  const navLinks = settings?.navLinks?.filter(link => link.visible) || [
    { label: "Home", href: "/", visible: true },
    { label: "English Typing", href: "/practice/english", visible: true },
    { label: "Hindi Typing", href: "/practice/hindi", visible: true },
    { label: "Live Test", href: "/start-typing", visible: true },
    { label: "Pricing", href: "/pricing", visible: true }
  ];

  const siteName = settings?.siteName || "TypingNexus";

  return (
    <>
      {/* Top Admin Bar (WordPress Style) */}
      {/* Top Admin Bar Removed as per user request */}

      {/* Announcement Bar */}
      {announcement && (
        <div className={`w-full px-4 py-2 text-center text-sm font-bold flex justify-center items-center gap-2 relative z-[55] animate-in slide-in-from-top-full duration-300 ${announcement.type === 'Warning' ? 'bg-yellow-500/10 text-yellow-400 border-b border-yellow-500/20' :
          announcement.type === 'Success' ? 'bg-green-500/10 text-green-400 border-b border-green-500/20' :
            announcement.type === 'Danger' ? 'bg-red-500/10 text-red-400 border-b border-red-500/20' :
              'bg-brand-purple/10 text-brand-purple border-b border-brand-purple/20'
          }`}>
          <span>{announcement.message}</span>
        </div>
      )}

      {/* Main Navbar */}
      <nav className={`sticky top-0 z-[999] bg-gray-900/80 backdrop-blur-xl border-b border-gray-800 px-4 sm:px-8 py-3 transition-all shadow-lg shadow-black/20`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">


          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="absolute inset-0 bg-brand-purple blur-md opacity-50 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative bg-black border border-gray-700 text-white p-1.5 rounded-md group-hover:border-brand-purple transition-colors">
                <ShieldCheck size={20} className="text-brand-purple" />
              </div>
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-white group-hover:text-brand-purple transition-colors">
              {siteName.includes("Nexus") ? (
                <>{siteName.replace("Nexus", "")}<span className="text-brand-purple">Nexus</span><span className="text-xs text-gray-500 ml-0.5">.in</span></>
              ) : siteName}
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link, idx) => (
              <div
                key={idx}
                className="relative group px-4 py-2"
                onMouseEnter={() => link.subLinks && setActiveDropdown(idx)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  to={link.href}
                  className={`text-sm font-bold transition-all relative z-10 flex items-center gap-1 ${location.pathname === link.href ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}
                >
                  {link.label}
                  {link.subLinks && <ChevronDown size={14} className={`transform transition-transform ${activeDropdown === idx ? 'rotate-180' : ''}`} />}

                  {location.pathname === link.href && (
                    <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-brand-purple shadow-[0_0_10px_rgba(168,85,247,0.8)]"></span>
                  )}
                </Link>

                {/* Submenu - Added padding-top (invisible bridge) to prevent disappearance when moving cursor */}
                {link.subLinks && activeDropdown === idx && (
                  <div className="absolute top-full left-0 pt-4 w-56 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-xl shadow-black/50 overflow-hidden">
                      {link.subLinks.map((sub, sIdx) => (
                        <Link
                          key={sIdx}
                          to={sub.href}
                          className="block px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors border-b border-gray-800 last:border-0 hover:pl-6"
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <Link to="/profile" className="flex items-center gap-2 group">
                  <div className="text-right hidden lg:block">
                    <div className="text-xs font-bold text-white group-hover:text-brand-purple transition-colors">{currentUser?.name}</div>
                    <div className="text-[10px] text-gray-500 uppercase tracking-wider">{currentUser?.plan || 'Free Plan'}</div>
                  </div>
                  <div className="w-9 h-9 bg-gray-800 border-2 border-gray-700 rounded-full flex items-center justify-center group-hover:border-brand-purple transition-colors shadow-lg">
                    <User size={16} className="text-gray-400 group-hover:text-white" />
                  </div>
                </Link>
                <button onClick={handleLogout} className="p-2 text-gray-400 hover:text-red-400 transition-colors" title="Logout">
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="text-sm font-bold text-gray-300 hover:text-white transition-colors">
                  Login
                </Link>
                <Link
                  to="/sign-up"
                  className="bg-white text-black px-5 py-2 rounded-lg font-bold text-sm hover:bg-brand-purple hover:text-white transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] flex items-center gap-2"
                >
                  <Zap size={16} className="fill-current" /> Get Access
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white bg-gray-800 p-2 rounded-lg border border-gray-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-gray-900/95 backdrop-blur-lg pt-24 px-6 animate-in slide-in-from-top-10 overflow-y-auto">
          <div className="flex flex-col gap-2 pb-10">
            {navLinks.map((link, idx) => (
              <div key={idx} className="border-b border-gray-800 pb-2">
                <Link
                  to={link.href}
                  className="flex items-center justify-between text-xl font-bold text-white py-2"
                  onClick={() => !link.subLinks && setMobileMenuOpen(false)}
                >
                  {link.label}
                  {link.subLinks && <ChevronDown size={20} className="text-gray-500" />}
                </Link>

                {/* Mobile Submenu */}
                {link.subLinks && (
                  <div className="pl-4 space-y-2 mt-2 border-l-2 border-brand-purple/30 ml-2">
                    {link.subLinks.map((sub, sIdx) => (
                      <Link
                        key={sIdx}
                        to={sub.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="block text-gray-400 py-2 hover:text-white"
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {!isAuthenticated && (
              <div className="grid grid-cols-2 gap-4 mt-6">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="text-center py-3 rounded-xl bg-gray-800 text-white font-bold border border-gray-700">Login</Link>
                <Link to="/sign-up" onClick={() => setMobileMenuOpen(false)} className="text-center py-3 rounded-xl bg-brand-purple text-white font-bold shadow-lg shadow-purple-900/40">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;