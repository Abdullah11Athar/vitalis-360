"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getAssetPath } from '@/lib/config';

interface UserSession {
  role: string;
  username: string;
}

const translations: Record<string, Record<string, string>> = {
  'English': {
    'Patient Care': 'Patient Care',
    'Dashboard': 'Dashboard',
    'Patient Detail': 'Patient Detail',
    'Lifestyle Audit': 'Lifestyle Audit',
    'Sleep Fidelity': 'Sleep Fidelity',
    'AI Medical Advisor': 'AI Medical Advisor',
    'Clinical & Rounds': 'Clinical & Rounds',
    'Virtual Rounds': 'Virtual Rounds',
    'Clinical Intelligence': 'Clinical Intelligence',
    'Emergency Sentinel': 'Emergency Sentinel',
    'Emergency Alert': 'Emergency Alert',
    'Sentinel Logs': 'Sentinel Logs',
    'Triage Gateway': 'Triage Gateway',
    'Clinical Billing': 'Clinical Billing',
    'Billing Ledger': 'Billing Ledger',
    'Claims Tracking': 'Claims Tracking',
    'Forensic Analysis': 'Forensic Analysis',
    'Governance & Audits': 'Governance & Audits',
    'Forensic Report': 'Forensic Report',
    'Governance Cert': 'Governance Cert',
    'Nyquist Security': 'Nyquist Security',
    'System': 'System',
    'Settings': 'Settings',
    'Add Patient': 'Add Patient'
  },
  'Urdu / Hindi': {
    'Patient Care': 'مریض کی دیکھ بھال',
    'Dashboard': 'ڈیش بورڈ',
    'Patient Detail': 'مریض کی تفصیل',
    'Lifestyle Audit': 'طرز زندگی کا جائزہ',
    'Sleep Fidelity': 'نیند کی تفصیلات',
    'AI Medical Advisor': 'طبی مشیر AI',
    'Clinical & Rounds': 'کلینیکل اور راؤنڈز',
    'Virtual Rounds': 'ورچوئل راؤنڈز',
    'Clinical Intelligence': 'کلینیکل انٹیلیجنس',
    'Emergency Sentinel': 'ہنگامی محافظ',
    'Emergency Alert': 'ایمرجنسی الرٹ',
    'Sentinel Logs': 'محافظ لاگز',
    'Triage Gateway': 'ٹریاج گیٹ وے',
    'Clinical Billing': 'طبی بلنگ',
    'Billing Ledger': 'بلنگ لیجر',
    'Claims Tracking': 'کلیمز ٹریکنگ',
    'Forensic Analysis': 'فارنسک تجزیہ',
    'Governance & Audits': 'گورننس اور آڈٹ',
    'Forensic Report': 'فارنسک رپورٹ',
    'Governance Cert': 'گورننس سرٹیفکیٹ',
    'Nyquist Security': 'سیکیورٹی کمپلائنس',
    'System': 'سسٹم',
    'Settings': 'سیٹنگز',
    'Add Patient': 'مریض شامل کریں'
  },
  'Arabic': {
    'Patient Care': 'رعاية المرضى',
    'Dashboard': 'لوحة القيادة',
    'Patient Detail': 'تفاصيل المريض',
    'Lifestyle Audit': 'تدقيق نمط الحياة',
    'Sleep Fidelity': 'دقة النوم',
    'AI Medical Advisor': 'المستشار الطبي الذكي',
    'Clinical & Rounds': 'السريرية والجولات',
    'Virtual Rounds': 'الجولات الافتراضية',
    'Clinical Intelligence': 'الذكاء السريري',
    'Emergency Sentinel': 'حارس الطوارئ',
    'Emergency Alert': 'تنبيه الطوارئ',
    'Sentinel Logs': 'سجلات الحارس',
    'Triage Gateway': 'بوابة الفرز',
    'Clinical Billing': 'الفواتير السريرية',
    'Billing Ledger': 'دفتر الأستاذ',
    'Claims Tracking': 'تتبع المطالبات',
    'Forensic Analysis': 'التحليل الجنائي',
    'Governance & Audits': 'الحوكمة والتدقيق',
    'Forensic Report': 'تقرير جنائي',
    'Governance Cert': 'شهادة الحوكمة',
    'Nyquist Security': 'أمن نايكويست',
    'System': 'النظام',
    'Settings': 'الإعدادات',
    'Add Patient': 'إضافة مريض'
  },
  'Spanish': {
    'Patient Care': 'Atención al Paciente',
    'Dashboard': 'Panel Principal',
    'Patient Detail': 'Detalle del Paciente',
    'Lifestyle Audit': 'Auditoría de Estilo',
    'Sleep Fidelity': 'Fidelidad del Sueño',
    'AI Medical Advisor': 'Asesor Médico IA',
    'Clinical & Rounds': 'Clínica y Rondas',
    'Virtual Rounds': 'Rondas Virtuales',
    'Clinical Intelligence': 'Inteligencia Clínica',
    'Emergency Sentinel': 'Centinela de Emergencia',
    'Emergency Alert': 'Alerta de Emergencia',
    'Sentinel Logs': 'Registros Centinela',
    'Triage Gateway': 'Portal de Triaje',
    'Clinical Billing': 'Facturación Clínica',
    'Billing Ledger': 'Libro Mayor',
    'Claims Tracking': 'Seguimiento Reclamaciones',
    'Forensic Analysis': 'Análisis Forense',
    'Governance & Audits': 'Gobernanza y Auditoría',
    'Forensic Report': 'Informe Forense',
    'Governance Cert': 'Certificado Gobernanza',
    'Nyquist Security': 'Seguridad Nyquist',
    'System': 'Sistema',
    'Settings': 'Configuración',
    'Add Patient': 'Añadir Paciente'
  },
  'French': {
    'Patient Care': 'Soins des Patients',
    'Dashboard': 'Tableau de Bord',
    'Patient Detail': 'Détail du Patient',
    'Lifestyle Audit': 'Audit de Mode de Vie',
    'Sleep Fidelity': 'Fidélité du Sommeil',
    'AI Medical Advisor': 'Conseiller Médical IA',
    'Clinical & Rounds': 'Clinique & Tournées',
    'Virtual Rounds': 'Tournées Virtuelles',
    'Clinical Intelligence': 'Intelligence Clinique',
    'Emergency Sentinel': 'Sentinelle d\'Urgence',
    'Emergency Alert': 'Alerte d\'Urgence',
    'Sentinel Logs': 'Journaux Sentinelle',
    'Triage Gateway': 'Passerelle de Triage',
    'Clinical Billing': 'Facturation Clinique',
    'Billing Ledger': 'Grand Livre',
    'Claims Tracking': 'Suivi Réclamations',
    'Forensic Analysis': 'Analyse Légale',
    'Governance & Audits': 'Gouvernance & Audits',
    'Forensic Report': 'Rapport Légal',
    'Governance Cert': 'Certificat Gouvernance',
    'Nyquist Security': 'Sécurité Nyquist',
    'System': 'Système',
    'Settings': 'Paramètres',
    'Add Patient': 'Ajouter un Patient'
  },
  'Chinese': {
    'Patient Care': '患者护理',
    'Dashboard': '仪表板',
    'Patient Detail': '患者详情',
    'Lifestyle Audit': '生活方式审计',
    'Sleep Fidelity': '睡眠保真度',
    'AI Medical Advisor': 'AI医疗顾问',
    'Clinical & Rounds': '临床与查房',
    'Virtual Rounds': '虚拟查房',
    'Clinical Intelligence': '临床智能',
    'Emergency Sentinel': '应急哨兵',
    'Emergency Alert': '紧急警报',
    'Sentinel Logs': '哨兵日志',
    'Triage Gateway': '分诊网关',
    'Clinical Billing': '临床计费',
    'Billing Ledger': '计费账本',
    'Claims Tracking': '理赔追踪',
    'Forensic Analysis': '法医分析',
    'Governance & Audits': '治理与审计',
    'Forensic Report': '法医报告',
    'Governance Cert': '治理证书',
    'Nyquist Security': '奈奎斯特安全',
    'System': '系统',
    'Settings': '设置',
    'Add Patient': '添加患者'
  }
};

export default function Sidebar({ 
  isExpanded,
  isPinned,
  setIsPinned,
  setIsHovered,
  isMobileOpen, 
  setIsMobileOpen, 
  user, 
  onAddPatientClick 
}: { 
  isExpanded?: boolean;
  isPinned?: boolean;
  setIsPinned?: (val: boolean) => void;
  setIsHovered?: (val: boolean) => void;
  isMobileOpen?: boolean; 
  setIsMobileOpen?: (val: boolean) => void; 
  user?: UserSession | null;
  onAddPatientClick?: () => void;
}) {
  const pathname = usePathname();
  const [currentLang, setCurrentLang] = useState('English');

  useEffect(() => {
    const savedLang = localStorage.getItem('vitalis_lang');
    if (savedLang) {
      setCurrentLang(savedLang);
    }

    const handleLangChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
        setCurrentLang(customEvent.detail);
      }
    };

    window.addEventListener('language-changed', handleLangChange);
    return () => {
      window.removeEventListener('language-changed', handleLangChange);
    };
  }, []);


  const navGroups = [
    {
      title: 'Patient Care',
      items: [
        { name: 'Patient Directory', href: '/patient', icon: 'groups' },
        { name: 'Dashboard', href: '/patient/dashboard', icon: 'dashboard' },
        { name: 'Patient Detail', href: '/patient/detail', icon: 'person' },
        { name: 'Lifestyle Audit', href: '/patient/lifestyle', icon: 'health_metrics' },
        { name: 'Sleep Fidelity', href: '/patient/sleep', icon: 'bedtime' },
        { name: 'AI Medical Advisor', href: '/patient/advisor', icon: 'psychology' },
      ]
    },
    {
      title: 'Clinical & Rounds',
      items: [
        { name: 'Virtual Rounds', href: '/doctor/rounds', icon: 'calendar_today' },
        { name: 'Clinical Intelligence', href: '/doctor/intelligence', icon: 'auto_awesome' },
      ]
    },
    {
      title: 'Emergency Sentinel',
      items: [
        { name: 'Emergency Alert', href: '/emergency/alert', icon: 'emergency_home' },
        { name: 'Sentinel Logs', href: '/emergency/logs', icon: 'history' },
        { name: 'Triage Gateway', href: '/emergency/triage', icon: 'medical_services' },
      ]
    },
    {
      title: 'Clinical Billing',
      items: [
        { name: 'Billing Ledger', href: '/billing/ledger', icon: 'account_balance_wallet' },
        { name: 'Claims Tracking', href: '/billing/claims', icon: 'receipt_long' },
        { name: 'Forensic Analysis', href: '/billing/analysis', icon: 'troubleshoot' },
      ]
    },
    {
      title: 'Governance & Audits',
      items: [
        { name: 'Forensic Report', href: '/audits/forensic', icon: 'gavel' },
        { name: 'Governance Cert', href: '/audits/governance', icon: 'verified' },
        { name: 'Nyquist Security', href: '/audits/nyquist', icon: 'security' },
      ]
    },
    {
      title: 'System',
      items: [
        { name: 'Settings', href: '/settings', icon: 'settings' }
      ]
    }
  ];

  // Role-Based Filtering
  const filteredGroups = navGroups.map((group) => {
    if (!user) return group;
    
    if (user.role === 'Patient') {
      // Patients only see: Patient Care (excluding Patient Directory), Billing Ledger, and Settings
      if (group.title === 'Patient Care') {
        return {
          ...group,
          items: group.items.filter(item => item.name !== 'Patient Directory')
        };
      }
      if (group.title === 'System') {
        return group;
      }
      if (group.title === 'Clinical Billing') {
        return {
          ...group,
          items: group.items.filter(item => item.name === 'Billing Ledger')
        };
      }
      return null;
    }
    
    if (user.role === 'Staff') {
      // Staff only sees: Patient Care (only Patient Directory), Emergency, Billing, Governance, and Settings
      if (group.title === 'Patient Care') {
        return {
          ...group,
          items: group.items.filter(item => item.name === 'Patient Directory')
        };
      }
      if (group.title === 'Clinical & Rounds') {
        return null;
      }
      return group;
    }
    
    if (user.role === 'Doctor') {
      // Doctor sees: Patient Care (only Patient Directory), Clinical & Rounds, Emergency, Billing, Governance, and Settings
      if (group.title === 'Patient Care') {
        return {
          ...group,
          items: group.items.filter(item => item.name === 'Patient Directory')
        };
      }
      return group;
    }
    
    return group;
  }).filter(Boolean) as typeof navGroups;

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
    if (user?.role === 'Doctor') return "Clinical Lead • CMO";
    if (user?.role === 'Patient') return "Telemetry Ward 4B";
    return "Lead Receptionist";
  };

  const t = (key: string) => {
    return translations[currentLang]?.[key] || key;
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm cursor-pointer"
          onClick={() => {
            setIsMobileOpen?.(false);
            setIsHovered?.(false);
            setIsPinned?.(false);
          }}
        />
      )}
      <aside 
        onMouseEnter={() => {
          if (typeof window !== 'undefined' && window.innerWidth >= 768) {
            setIsHovered?.(true);
          }
        }}
        onMouseLeave={() => {
          if (typeof window !== 'undefined' && window.innerWidth >= 768) {
            setIsHovered?.(false);
          }
        }}
        className={`h-screen w-64 fixed left-0 top-0 border-r border-outline-variant flex flex-col bg-background z-50 transition-transform duration-300 ease-in-out ${
          isExpanded ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        } overflow-y-auto custom-scrollbar`}
      >
        <div className="p-5 pb-4 border-b border-outline-variant/50 sticky top-0 bg-background z-10">
          <div className="flex items-center justify-between">
            <Link href={user?.role === 'Doctor' ? '/doctor/rounds' : user?.role === 'Staff' ? '/patient' : '/patient/dashboard'} prefetch={true} className="flex items-center gap-2.5 hover:opacity-85 transition-opacity cursor-pointer min-w-0">
              <img src={getAssetPath('/favicon.png')} alt="VITALIS-360" className="h-8 w-auto object-contain shrink-0" />
              <span className="font-headline-lg text-2xl font-black text-primary tracking-tighter truncate">VITALIS-360</span>
            </Link>
            <button 
              onClick={() => {
                setIsPinned?.(false);
                setIsHovered?.(false);
                setIsMobileOpen?.(false);
              }}
              className="p-1.5 rounded-xl text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors shrink-0 cursor-pointer"
              title="Close Navigation Panel"
              aria-label="Close Navigation Panel"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>
          <div className="flex items-center mt-3.5 gap-3">
            <div className="w-9 h-9 rounded-full overflow-hidden bg-surface-container-high border border-primary/30 shrink-0">
              <img className="w-full h-full object-cover" src={getAvatarUrl()} alt={user?.username || "Guest User"}/>
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-on-surface truncate">{user?.username || "Dr. Julian Vance"}</p>
              <p className="text-[10px] text-primary uppercase tracking-widest font-bold">{getSubTitle()}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-6">
          {filteredGroups.map((group, groupIdx) => (
            <div key={groupIdx} className="space-y-1">
              <p className="px-3 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">{t(group.title)}</p>
              {group.items.map((item) => {
                const normalizedPath = pathname.replace(/^\/portal\/(doctor|patient|staff)/, '');
                const isActive = 
                  pathname === item.href || 
                  (item.href !== '/' && pathname.startsWith(item.href)) ||
                  normalizedPath === item.href ||
                  (item.href !== '/' && normalizedPath.startsWith(item.href));
                return (
                  <Link 
                    key={item.name} 
                    href={item.href} 
                    prefetch={true}
                    onClick={() => {
                      setIsMobileOpen?.(false);
                      if (!isPinned) setIsHovered?.(false);
                    }}
                    className={`flex items-center px-3 py-2.5 rounded-xl transition-all duration-150 cursor-pointer active:scale-[0.98] ${
                      isActive 
                        ? 'text-primary font-bold bg-primary/10 border border-primary/20 shadow-sm' 
                        : 'text-on-surface-variant font-medium hover:bg-surface-container-low hover:text-on-surface'
                    }`}>
                    <span className={`material-symbols-outlined mr-3 text-xl ${isActive ? 'text-primary' : 'text-on-surface-variant'}`} style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>{item.icon}</span>
                    <span className="text-xs truncate">{t(item.name)}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {user?.role !== 'Patient' && (
          <div className="p-4 border-t border-outline-variant/50 sticky bottom-0 bg-background z-10 space-y-2">
            <button 
              onClick={() => { onAddPatientClick?.(); setIsMobileOpen?.(false); }}
              className="w-full py-2.5 bg-primary text-on-primary font-bold rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity active:scale-95 shadow-md shadow-primary/20 text-xs cursor-pointer">
              <span className="material-symbols-outlined text-base">person_add</span>
              <span>{t('Add Patient')}</span>
            </button>
            <button 
              onClick={() => { window.dispatchEvent(new Event('open-add-doctor-modal')); setIsMobileOpen?.(false); }}
              className="w-full py-2.5 bg-secondary-container text-on-secondary-container font-bold rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity active:scale-95 shadow-sm text-xs cursor-pointer border border-outline-variant/40">
              <span className="material-symbols-outlined text-base">medical_services</span>
              <span>Add Doctor / Staff</span>
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
