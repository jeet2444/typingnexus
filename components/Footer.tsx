import React, { useState, useEffect } from 'react';
import { Facebook, Instagram, Twitter, Youtube, Send, ArrowUp, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getAdminStore, SiteSettings } from '../utils/adminStore';

const Footer: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    const loadStoreData = () => {
      const store = getAdminStore();
      setSettings(store.settings);
    };

    loadStoreData();

    // Trigger Hostinger Sync directly in Footer
    import('../utils/adminStore').then(({ syncSettingsFromHost }) => {
      syncSettingsFromHost().then(d => {
        if (d) loadStoreData();
      });
    });

    window.addEventListener('adminStoreUpdate', loadStoreData);
    window.addEventListener('storage', loadStoreData);

    return () => {
      window.removeEventListener('adminStoreUpdate', loadStoreData);
      window.removeEventListener('storage', loadStoreData);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'facebook': return <Facebook size={18} />;
      case 'instagram': return <Instagram size={18} />;
      case 'twitter': return <Twitter size={18} />;
      case 'youtube': return <Youtube size={18} />;
      default: return <Send size={18} />;
    }
  };

  const socialLinks = settings?.socialLinks?.filter(l => l.visible) || [
    { platform: "Facebook", url: "https://facebook.com", visible: true },
    { platform: "Instagram", url: "https://instagram.com", visible: true },
    { platform: "Twitter", url: "https://twitter.com", visible: true },
    { platform: "YouTube", url: "https://youtube.com", visible: true }
  ];

  const siteName = settings?.siteName || "TypingNexus";
  const primaryColor = settings?.primaryColor || "#9333ea"; // brand-purple default
  const footerText = settings?.footerText || "India's Premier Typing & Computer Efficiency Platform for Government Exam Preparation.";
  const copyrightText = settings?.copyrightText || "© 2026 TypingNexus.in. All rights reserved.";

  return (
    <footer className="bg-black text-white pt-16 pb-8 border-t border-gray-800 relative overflow-hidden">
      {/* Glow Effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-brand-purple/50 blur-[20px]"></div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10 mb-12 relative z-10">

        {/* Brand Column */}
        <div className="space-y-6">
          <div className="text-2xl font-bold tracking-tight text-white font-display">
            {siteName.includes("Nexus") ? (
              <>{siteName.replace("Nexus", "")}<span className="text-brand-purple">Nexus</span><span className="text-gray-500 text-sm">.in</span></>
            ) : siteName}
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">
            {footerText}
          </p>
          <div className="flex gap-4 pt-2">
            {socialLinks.map((link, idx) => (
              <a
                key={idx}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:border-brand-purple transition-all hover:shadow-[0_0_10px_rgba(168,85,247,0.3)]"
              >
                {getSocialIcon(link.platform)}
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-6 flex items-center gap-2">
            <div className="w-1 h-4 bg-brand-purple rounded-full"></div> Practice
          </h4>
          <ul className="space-y-3 text-sm text-gray-400">
            {settings?.showTypingTests !== false && <li><Link to="/exams" className="hover:text-brand-purple transition-colors">Typing Tests</Link></li>}
            {settings?.showTypingTutorial !== false && <li><Link to="/learn" className="hover:text-brand-purple transition-colors">Typing Courses</Link></li>}
            {settings?.showRSSBPack !== false && <li><Link to="/cpt/excel" className="hover:text-brand-purple transition-colors">Excel Efficiency</Link></li>}
            {settings?.showRSSBPack !== false && <li><Link to="/cpt/word" className="hover:text-brand-purple transition-colors">Word Formatting</Link></li>}
            <li><Link to="/practice" className="hover:text-brand-purple transition-colors">Practice Library</Link></li>
          </ul>
        </div>

        {/* Exams Covered */}
        <div>
          <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-6 flex items-center gap-2">
            <div className="w-1 h-4 bg-blue-500 rounded-full"></div> Exams Covered
          </h4>
          <ul className="space-y-3 text-sm text-gray-400">
            <li><span className="hover:text-blue-400 cursor-default">RSSB LDC / Junior Assistant</span></li>
            <li><span className="hover:text-blue-400 cursor-default">SSC CGL / CHSL</span></li>
            <li><span className="hover:text-blue-400 cursor-default">RRB NTPC / Group D</span></li>
            <li><span className="hover:text-blue-400 cursor-default">UPPCL / State PSC</span></li>
            {settings?.showPricing !== false && <li><Link to="/pricing" className="hover:text-white bg-white/5 px-2 py-1 rounded inline-block transition-colors font-medium border border-white/10 mt-2">View All Plans →</Link></li>}
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-6 flex items-center gap-2">
            <div className="w-1 h-4 bg-green-500 rounded-full"></div> Contact Us
          </h4>
          <div className="space-y-4 text-sm text-gray-400">
            <div className="flex items-center gap-3 p-3 bg-gray-900 rounded-lg border border-gray-800">
              <Phone size={16} className="text-gray-500" />
              <div>
                <div className="text-[10px] uppercase font-bold text-gray-600">Support Line</div>
                <span className="text-white font-mono">{settings?.supportPhone || '+91 91427 93580'}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-900 rounded-lg border border-gray-800">
              <Mail size={16} className="text-gray-500" />
              <div className="overflow-hidden">
                <div className="text-[10px] uppercase font-bold text-gray-600">Email Query</div>
                <a href={`mailto:${settings?.supportEmail || 'contact@typingnexus.in'}`} className="text-white hover:text-brand-purple transition-colors truncate block">
                  {settings?.supportEmail || 'contact@typingnexus.in'}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center px-6 max-w-7xl mx-auto gap-4">
        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6">
          <span className="text-xs text-gray-600">{copyrightText}</span>
          <div className="flex gap-4 text-xs text-gray-500">
            {settings?.footerLinks?.map((link, idx) => (
              <Link key={idx} to={link.href} className="hover:text-gray-300 transition-colors">{link.label}</Link>
            )) || (
                <>
                  <Link to="#" className="hover:text-gray-300 transition-colors">Privacy Policy</Link>
                  <Link to="#" className="hover:text-gray-300 transition-colors">Terms of Service</Link>
                </>
              )}
          </div>
        </div>
        <button
          onClick={scrollToTop}
          className="p-2 rounded-lg text-white bg-gray-800 hover:bg-brand-purple transition-all shadow-sm border border-gray-700 hover:border-brand-purple"
          aria-label="Scroll to top"
        >
          <ArrowUp size={16} />
        </button>
      </div>
    </footer>
  );
};

export default Footer;