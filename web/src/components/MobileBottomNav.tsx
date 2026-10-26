"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const [user, setUser] = React.useState<any>(null);

  React.useEffect(() => {
    const saved = localStorage.getItem('vitalis_user');
    if (saved) {
      setUser(JSON.parse(saved));
    }
  }, []);

  const role = user?.role?.toLowerCase();

  const getNavItems = () => {
    if (role === 'doctor') {
      return [
        { name: 'Rounds', href: '/doctor/rounds', icon: 'calendar_today' },
        { name: 'Patients', href: '/patient', icon: 'groups' },
        { name: 'Alerts', href: '/emergency/alert', icon: 'notifications_active' },
        { name: 'Settings', href: '/settings', icon: 'settings' },
      ];
    } else if (role === 'staff') {
      return [
        { name: 'Patients', href: '/patient', icon: 'groups' },
        { name: 'Alerts', href: '/emergency/alert', icon: 'notifications_active' },
        { name: 'Billing', href: '/billing/ledger', icon: 'account_balance_wallet' },
        { name: 'Settings', href: '/settings', icon: 'settings' },
      ];
    } else {
      return [
        { name: 'Dashboard', href: '/patient/dashboard', icon: 'dashboard' },
        { name: 'AI Advisor', href: '/patient/advisor', icon: 'psychology' },
        { name: 'Billing', href: '/billing/ledger', icon: 'account_balance_wallet' },
        { name: 'Settings', href: '/settings', icon: 'settings' },
      ];
    }
  };

  const navItems = getNavItems();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-3 pb-safe bg-surface-container-lowest border-t border-outline-variant shadow-[0_-4px_20px_rgba(0,0,0,0.2)] rounded-t-2xl">
      {navItems.map((item) => {
        const normalizedPath = pathname.replace(/^\/portal\/(doctor|patient|staff)/, '');
        const isActive = 
          pathname === item.href || 
          pathname.startsWith(item.href) || 
          normalizedPath === item.href || 
          normalizedPath.startsWith(item.href);
        return (
          <Link 
            key={item.name} 
            href={item.href}
            className={`flex flex-col items-center justify-center transition-all active:scale-90 duration-200 ${
              isActive 
                ? 'bg-primary-container text-on-primary-container rounded-full px-5 py-1' 
                : 'text-on-secondary-container hover:text-primary'
            }`}
          >
            <span 
              className="material-symbols-outlined" 
              style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
            >
              {item.icon}
            </span>
            <span className="font-label-sm text-[10px] mt-1">{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
