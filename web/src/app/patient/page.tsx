"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function PatientDirectory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterWard, setFilterWard] = useState('All');
  const [patients, setPatients] = useState<any[]>([]);

  const defaultPatients = [
    {
      id: '8829-XL',
      name: 'Zeeshan Ali',
      age: 34,
      gender: 'Male',
      ward: 'Telemetry Ward 4B',
      status: 'Critical Alert',
      statusColor: 'error',
      hr: 142,
      bp: '138/88',
      spo2: 94,
      diagnosis: 'Tachycardia / Type 2 DM / Hyperlipidemia',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      href: '/patient/detail'
    },
    {
      id: '9912-KA',
      name: 'Elena Rostova',
      age: 48,
      gender: 'Female',
      ward: 'ICU Bed 2',
      status: 'Monitoring',
      statusColor: 'primary',
      hr: 76,
      bp: '120/78',
      spo2: 98,
      diagnosis: 'Post-op Cardiac Bypass / Stable Recovery',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      href: '/patient/detail'
    },
    {
      id: '7734-BM',
      name: 'Marcus Vance',
      age: 62,
      gender: 'Male',
      ward: 'Telemetry Ward 4A',
      status: 'Stable',
      statusColor: 'primary',
      hr: 68,
      bp: '128/82',
      spo2: 97,
      diagnosis: 'Hypertension / Mild Arrhythmia',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      href: '/patient/detail'
    },
    {
      id: '4421-SP',
      name: 'Sarah Jenkins',
      age: 29,
      gender: 'Female',
      ward: 'Maternity Wing',
      status: 'Observation',
      statusColor: 'amber',
      hr: 88,
      bp: '118/74',
      spo2: 99,
      diagnosis: 'Gestational Diabetes Triage',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      href: '/patient/detail'
    }
  ];

  const [user, setUser] = useState<any>(null);

  const loadPatients = () => {
    const saved = localStorage.getItem('vitalis_patients');
    if (saved) {
      setPatients(JSON.parse(saved));
    } else {
      localStorage.setItem('vitalis_patients', JSON.stringify(defaultPatients));
      setPatients(defaultPatients);
    }
  };

  useEffect(() => {
    loadPatients();
    const savedUser = localStorage.getItem('vitalis_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    window.addEventListener('patients-updated', loadPatients);
    return () => {
      window.removeEventListener('patients-updated', loadPatients);
    };
  }, []);

  const filteredPatients = patients.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesWard = filterWard === 'All' || p.ward.includes(filterWard);
    return matchesSearch && matchesWard;
  });

  const prefix = user?.role === 'Doctor' ? '/portal/doctor' : '/portal/staff';
  const dashboardHref = user?.role === 'Doctor' ? '/portal/doctor/rounds' : '/portal/staff';

  return (
    <div className="py-6 px-4 md:px-8 max-w-6xl mx-auto w-full pb-36 md:pb-12">
      {/* Header Section */}
      <section className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-outline-variant pb-6">
        <div>
          <span className="font-label-sm text-xs text-primary uppercase tracking-widest font-bold">Clinical Census</span>
          <h1 className="font-headline-lg text-2xl md:text-3xl text-on-surface font-bold">Patient Directory</h1>
          <p className="text-xs text-on-surface-variant font-medium mt-1">Real-time vital telemetry & EMR status across all wards</p>
        </div>

        <div className="flex gap-2.5 w-full sm:w-auto">
          <Link href={dashboardHref} prefetch={true} className="flex-1 sm:flex-none justify-center px-4 py-2.5 bg-surface-container text-on-surface text-xs font-bold rounded-xl border border-outline-variant hover:bg-surface-container-high transition-all flex items-center gap-1.5 shadow-sm cursor-pointer">
            <span className="material-symbols-outlined text-base text-primary">dashboard</span>
            Dashboard
          </Link>
          <button 
            onClick={() => window.dispatchEvent(new Event('open-add-patient-modal'))}
            className="flex-1 sm:flex-none justify-center px-4 py-2.5 bg-primary text-on-primary text-xs font-bold rounded-xl hover:opacity-90 transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">person_add</span>
            Admit Patient
          </button>
        </div>
      </section>

      {/* Search & Filter Bar */}
      <section className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between bg-surface-container-low p-4 rounded-2xl border border-outline-variant shadow-sm">
        <div className="relative w-full md:w-96">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">search</span>
          <input 
            type="text" 
            placeholder="Search by patient name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-surface-container pl-10 pr-4 py-2.5 rounded-xl text-sm text-on-surface border border-outline-variant/50 focus:outline-none focus:border-primary placeholder:text-on-surface-variant/60"
          />
        </div>

        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {['All', 'Telemetry', 'ICU', 'Maternity'].map((ward) => (
            <button 
              key={ward}
              onClick={() => setFilterWard(ward)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                filterWard === ward 
                  ? 'bg-primary text-on-primary shadow-sm' 
                  : 'bg-surface-container text-on-surface-variant hover:text-on-surface border border-outline-variant/50'
              }`}
            >
              {ward} {ward === 'All' ? `(${patients.length})` : ''}
            </button>
          ))}
        </div>
      </section>

      {/* Patients Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredPatients.map((patient) => (
          <div 
            key={patient.id} 
            className="bg-surface-container-low rounded-2xl p-4 sm:p-6 border border-outline-variant shadow-sm hover:border-primary transition-all flex flex-col justify-between space-y-4 sm:space-y-6 relative overflow-hidden group"
          >
            <div className="flex items-start justify-between gap-2.5">
              <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-surface-container-high border-2 border-primary/30 overflow-hidden shrink-0 shadow-md">
                  <img src={patient.avatar} alt={patient.name} className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                    <h3 className="font-bold text-base sm:text-lg text-on-surface group-hover:text-primary transition-colors truncate">{patient.name}</h3>
                    <span className="text-[10px] sm:text-xs font-mono font-bold text-on-surface-variant bg-surface-container px-1.5 py-0.5 rounded shrink-0">{patient.id}</span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-on-surface-variant font-medium mt-0.5 truncate">{patient.age} yrs • {patient.gender} • {patient.ward}</p>
                </div>
              </div>

              <span className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-xl text-[10px] sm:text-xs font-bold border flex items-center gap-1.5 whitespace-nowrap shrink-0 self-start ${
                patient.statusColor === 'error' 
                  ? 'bg-error/10 text-error border-error/30' 
                  : patient.statusColor === 'amber'
                  ? 'bg-amber-500/10 text-amber-500 border-amber-500/30'
                  : 'bg-primary/10 text-primary border-primary/30'
              }`}>
                <span className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${
                  patient.statusColor === 'error' ? 'bg-error animate-pulse' : patient.statusColor === 'amber' ? 'bg-amber-500' : 'bg-primary'
                }`}></span>
                {patient.status}
              </span>
            </div>

            {/* Diagnosis */}
            <div className="bg-surface-container/50 p-3.5 rounded-xl border border-outline-variant/30">
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Primary Clinical Profile</span>
              <p className="text-xs font-bold text-on-surface">{patient.diagnosis || 'Post-op Recovery / Telemetry Logged'}</p>
            </div>

            {/* Vital Telemetry Bento */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-outline-variant/30">
              <div className="bg-surface-container/30 p-2.5 rounded-xl text-center border border-outline-variant/20">
                <span className="text-[10px] font-bold text-on-surface-variant uppercase">Heart Rate</span>
                <div className={`text-base font-black mt-0.5 ${patient.hr > 100 ? 'text-error' : 'text-on-surface'}`}>{patient.hr} <span className="text-[10px] font-normal">bpm</span></div>
              </div>
              <div className="bg-surface-container/30 p-2.5 rounded-xl text-center border border-outline-variant/20">
                <span className="text-[10px] font-bold text-on-surface-variant uppercase">Blood Press.</span>
                <div className="text-base font-black text-on-surface mt-0.5">{patient.bp}</div>
              </div>
              <div className="bg-surface-container/30 p-2.5 rounded-xl text-center border border-outline-variant/20">
                <span className="text-[10px] font-bold text-on-surface-variant uppercase">SpO2</span>
                <div className="text-base font-black text-primary mt-0.5">{patient.spo2}%</div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2.5 pt-2">
              <Link 
                href={`${prefix}/patient/detail?id=${patient.id}`}
                className="flex-1 py-2.5 bg-primary text-on-primary text-center font-bold text-xs rounded-xl hover:opacity-90 transition-opacity shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>View Full Record & Audit</span>
                <span className="material-symbols-outlined text-base">arrow_forward</span>
              </Link>
              <Link 
                href={`${prefix}/patient/advisor?id=${patient.id}`}
                className="px-3.5 py-2.5 bg-surface-container text-on-surface font-bold text-xs rounded-xl hover:bg-surface-container-high transition-colors border border-outline-variant flex items-center justify-center cursor-pointer"
                title="Launch AI Medical Advisor"
              >
                <span className="material-symbols-outlined text-primary text-base">psychology</span>
              </Link>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
