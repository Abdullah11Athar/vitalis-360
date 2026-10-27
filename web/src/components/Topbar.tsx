"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface UserSession {
  role: string;
  username: string;
}

export default function Topbar({ 
  onMenuClick, 
  onLogout, 
  user,
  isSidebarOpen 
}: { 
  onMenuClick?: () => void; 
  onLogout?: () => void; 
  user?: UserSession | null;
  isSidebarOpen?: boolean;
}) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLanguages, setShowLanguages] = useState(false);
  const [selectedLang, setSelectedLang] = useState('English');


  useEffect(() => {
    const savedLang = localStorage.getItem('vitalis_lang');
    if (savedLang) {
      setSelectedLang(savedLang);
    }
  }, []);

  const notifications = [
    { id: 1, title: 'Tachycardia Alert', desc: 'Patient Zeeshan Ali HR spiked to 142 bpm.', time: '2m ago', priority: 'critical', href: '/patient/detail?id=8829-XL' },
    { id: 2, title: 'High Fever Spike', desc: 'Patient Umar Farooq core temp spiked to 102.4°F.', time: '4m ago', priority: 'critical', href: '/patient/detail?id=5512-UF' },
    { id: 3, title: 'Acute Guarding Alert', desc: 'Patient Sadia Khan suspected acute appendicitis RLQ pain.', time: '8m ago', priority: 'critical', href: '/patient/detail?id=3389-SK' },
    { id: 4, title: 'Compliance Audit Due', desc: 'Nyquist security verification required.', time: '1h ago', priority: 'normal', href: '/audits/nyquist' }
  ];

  const languages = ['English', 'Urdu / Hindi', 'Arabic', 'Chinese', 'Spanish', 'French'];

  // Unsplash Premium Non-Zoomed Avatars
  const getAvatarUrl = () => {
    if (user?.role === 'Doctor') {
      return "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&auto=format&fit=crop&q=80";
    } else if (user?.role === 'Patient') {
      return "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80";
    } else {
      return "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80";
    }
  };

  const getSubTitle = () => {
    if (user?.role === 'Doctor') return "Chief Medical Officer";
    if (user?.role === 'Patient') return "Telemetry Ward 4B";
    return "Lead Receptionist";
  };

  return (
    <header className="h-20 flex justify-between items-center px-4 md:px-spacing-margin-desktop w-full border-b border-outline-variant bg-background sticky top-0 z-30">
      <div className="flex items-center gap-2 sm:gap-4">
        <button 
          className="text-on-surface hover:text-primary transition-colors p-2 -ml-2 rounded-xl hover:bg-surface-container-low cursor-pointer flex items-center justify-center shrink-0 active:scale-95"
          onClick={onMenuClick}
          title={isSidebarOpen ? "Close Navigation Menu" : "Open Navigation Menu"}
          aria-label="Toggle Navigation Menu"
        >
          <span className="material-symbols-outlined text-2xl transition-transform duration-200">
            {isSidebarOpen ? "menu_open" : "menu"}
          </span>
        </button>
        <div className="hidden md:flex items-center gap-2 lg:gap-4 bg-surface-container-low px-3 py-1.5 rounded-full border border-outline-variant w-48 lg:w-72 xl:w-96 shrink-0">
          <span className="material-symbols-outlined text-outline text-sm">search</span>
          <input 
            className="bg-transparent border-none focus:ring-0 text-on-surface font-body-md w-full placeholder:text-outline-variant outline-none text-xs animate-pulse-soft" 
            placeholder={
              selectedLang === 'Urdu / Hindi' ? "مریض کی شناخت، وائٹلز یا لیبز تلاش کریں..." :
              selectedLang === 'Arabic' ? "ابحث عن هوية المريض أو المؤشرات الحيوية..." :
              selectedLang === 'Spanish' ? "Buscar ID de paciente, signos vitales..." :
              selectedLang === 'French' ? "Rechercher un ID patient, constantes..." :
              selectedLang === 'Chinese' ? "搜索患者ID、生命体征或化验单..." :
              "Search patient ID, vitals, or labs..."
            }
            type="text"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-3.5 relative shrink-0">
        {/* Notifications Bell */}
        <div className="relative">
          <button 
            onClick={() => { setShowNotifications(!showNotifications); setShowLanguages(false); }}
            className="text-on-surface-variant hover:text-primary transition-colors active:scale-95 flex items-center relative p-2 rounded-full hover:bg-surface-container-low cursor-pointer shrink-0"
            title="Notifications"
          >
            <span className="material-symbols-outlined text-xl">notifications</span>
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-error animate-pulse border border-background"></span>
          </button>

          {showNotifications && (
            <>
              {/* Backdrop for click outside */}
              <div 
                className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs"
                onClick={() => setShowNotifications(false)}
              />
              <div className="fixed sm:absolute top-20 sm:top-full left-3 right-3 sm:left-auto sm:right-0 mt-1 sm:w-80 bg-surface-container-low border border-outline-variant rounded-2xl shadow-2xl p-4 space-y-3 z-50">
                <div className="flex justify-between items-center border-b border-outline-variant/30 pb-2.5">
                  <span className="text-xs font-bold text-on-surface uppercase tracking-wider">Clinical Alerts</span>
                  <span className="text-[10px] text-error font-bold bg-error/15 px-2 py-0.5 rounded-md border border-error/20">{notifications.length} Active</span>
                </div>
                <div className="space-y-2 max-h-72 overflow-y-auto custom-scrollbar">
                  {notifications.map((n) => (
                    <Link 
                      key={n.id}
                      href={n.href}
                      prefetch={true}
                      onClick={() => setShowNotifications(false)}
                      className="block p-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high transition-colors border border-outline-variant/20 cursor-pointer"
                    >
                      <div className="flex justify-between items-start">
                        <span className={`text-xs font-bold ${n.priority === 'critical' ? 'text-error' : n.priority === 'warning' ? 'text-amber-500' : 'text-primary'}`}>
                          {n.title}
                        </span>
                        <span className="text-[9px] text-on-surface-variant font-mono">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-on-surface-variant mt-1 leading-normal font-medium">{n.desc}</p>
                    </Link>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Globe Language Translator */}
        <div className="relative">
          <button 
            onClick={() => { setShowLanguages(!showLanguages); setShowNotifications(false); }}
            className="text-on-surface-variant hover:text-primary transition-colors active:scale-95 flex items-center gap-1 p-2 rounded-full hover:bg-surface-container-low cursor-pointer shrink-0"
            title="Translate Portal"
          >
            <span className="material-symbols-outlined text-xl">language</span>
            <span className="text-[10px] font-bold text-on-surface-variant hidden lg:inline">{selectedLang}</span>
          </button>

          {showLanguages && (
            <>
              {/* Backdrop for click outside */}
              <div 
                className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs"
                onClick={() => setShowLanguages(false)}
              />
              <div className="fixed sm:absolute top-20 sm:top-full left-auto right-3 mt-1 w-56 sm:w-48 bg-surface-container-low border border-outline-variant rounded-2xl shadow-2xl p-3 space-y-1.5 z-50">
                <div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider px-2.5 pb-1.5 border-b border-outline-variant/30">Select Language</div>
                {languages.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => { 
                      setSelectedLang(lang); 
                      setShowLanguages(false); 
                      localStorage.setItem('vitalis_lang', lang);
                      window.dispatchEvent(new CustomEvent('language-changed', { detail: lang }));
                    }}
                    className={`w-full text-left px-2.5 py-2 text-xs font-bold rounded-xl transition-colors cursor-pointer ${
                      selectedLang === lang 
                        ? 'bg-primary text-on-primary' 
                        : 'text-on-surface hover:bg-surface-container'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Help Circle Button */}
        <button 
          onClick={() => window.dispatchEvent(new CustomEvent('show-toast', { detail: "ℹ️ VITALIS-360 Clinical Support: System online. All HIPAA / Nyquist security sensors active." }))}
          className="text-on-surface-variant hover:text-primary transition-colors active:scale-95 p-2 rounded-full hover:bg-surface-container-low cursor-pointer shrink-0"
          title="Clinical Support"
        >
          <span className="material-symbols-outlined text-xl">help</span>
        </button>

        {/* Vertical Separator */}
        <div className="hidden md:block w-px h-6 bg-outline-variant/50 shrink-0"></div>

        {/* User Profile Block matching the Aegis/Vitalis Top Right design */}
        {user && (
          <div className="hidden md:flex items-center gap-2 shrink-0">
            <div className="text-right whitespace-nowrap">
              <p className="text-xs font-bold text-on-surface leading-tight">
                {user.username.includes(' (') ? user.username.split(' (')[0] : user.username}
              </p>
              <p className="text-[10px] font-bold text-primary uppercase tracking-wider leading-none mt-0.5">{getSubTitle()}</p>
            </div>
            <div className="w-8 h-8 rounded-full overflow-hidden bg-surface-container border border-primary/30 shrink-0">
              <img 
                className="w-full h-full object-cover" 
                src={getAvatarUrl()} 
                alt={user.username}
              />
            </div>
          </div>
        )}

        {/* Logout Button */}
        <button 
          onClick={onLogout}
          className="text-on-surface-variant hover:text-error transition-colors active:scale-95 p-2 rounded-full hover:bg-surface-container-low cursor-pointer shrink-0"
          title="Sign Out"
        >
          <span className="material-symbols-outlined text-xl">logout</span>
        </button>
      </div>
    </header>
  );
}
