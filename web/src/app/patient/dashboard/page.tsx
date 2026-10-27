"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function PatientDashboard() {
  const [user, setUser] = useState<any>(null);
  const [lastUpdated, setLastUpdated] = useState('Just now');
  const [reports, setReports] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);

  // Telehealth Consultation Modal State
  const [showTelehealthModal, setShowTelehealthModal] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  // Personal Emergency Rescue Profile States
  const [address, setAddress] = useState("Flat 402, 4th Floor, Shaheen Heights, Block 6");
  const [city, setCity] = useState("Karachi");
  const [preferredHospital, setPreferredHospital] = useState("Aga Khan University Hospital ER");
  const [emergencyContactName, setEmergencyContactName] = useState("Faisal Ali (Brother)");
  const [emergencyContactPhone, setEmergencyContactPhone] = useState("+923009876543");

  useEffect(() => {
    const timer = setInterval(() => {
      setLastUpdated('1 minute ago');
    }, 60000);

    const savedUser = localStorage.getItem('vitalis_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {}
    }

    const saved = localStorage.getItem('vitalis_uploaded_reports');
    if (saved) {
      setReports(JSON.parse(saved));
    } else {
      const initial = [
        { id: 'REP-101', title: 'Comprehensive Metabolic Panel (CMP).pdf', date: 'April 4, 2026', uploader: 'Patient Uploaded', hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' },
        { id: 'REP-102', title: 'Cardiology 12-Lead ECG Tracing.png', date: 'April 2, 2026', uploader: 'Staff Verified', hash: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4' }
      ];
      setReports(initial);
      localStorage.setItem('vitalis_uploaded_reports', JSON.stringify(initial));
    }

    const savedProfile = localStorage.getItem('vitalis_emergency_profile');
    if (savedProfile) {
      const parsed = JSON.parse(savedProfile);
      setAddress(parsed.address || "");
      setCity(parsed.city || "");
      setPreferredHospital(parsed.preferredHospital || "");
      setEmergencyContactName(parsed.emergencyContactName || "");
      setEmergencyContactPhone(parsed.emergencyContactPhone || "");
    }

    return () => clearInterval(timer);
  }, []);

  const handleSaveProfile = () => {
    const profile = { address, city, preferredHospital, emergencyContactName, emergencyContactPhone };
    localStorage.setItem('vitalis_emergency_profile', JSON.stringify(profile));
    window.dispatchEvent(new CustomEvent('show-toast', { detail: "💾 Personal Emergency Rescue Profile saved successfully!" }));
  };

  const handleUploadClick = () => {
    document.getElementById('report-file-input')?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setTimeout(() => {
      const newRep = {
        id: 'REP-' + Math.floor(200 + Math.random() * 800),
        title: file.name,
        date: 'Just now',
        uploader: 'Patient Uploaded',
        hash: 'a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e'
      };
      const updated = [newRep, ...reports];
      setReports(updated);
      localStorage.setItem('vitalis_uploaded_reports', JSON.stringify(updated));
      setUploading(false);
      window.dispatchEvent(new CustomEvent('show-toast', { detail: `📤 Report "${file.name}" uploaded & encrypted! Available to Doctors & Staff immediately.` }));
      e.target.value = '';
    }, 1200);
  };

  useEffect(() => {
    let callTimer: NodeJS.Timeout;
    if (showTelehealthModal) {
      callTimer = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(callTimer);
  }, [showTelehealthModal]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const handleDownload = (rep: any) => {
    const content = `VITALIS-360 CLINICAL VAULT REPORT
==================================================
Document: ${rep.title}
Patient: ${user?.username || 'Zeeshan Ali'} (ID: 8829-XL)
Ward: Telemetry Ward 4B
Uploader: ${rep.uploader}
Date: ${rep.date}
SHA-256 Hash: ${rep.hash}
Security Audit: VERIFIED & COMPLIANT

CLINICAL FINDINGS & AI SYNTHESIS:
- Primary Biomarkers: HbA1c 6.1%, LDL 112 mg/dL, Resting HR 74 bpm.
- Diagnostic Status: Stable circadian rhythm with mild post-prandial glycemic excursions.
- Regulatory Standard: HIPAA / GDPR Cryptographically Sealed by VITALIS-360 Guardian.
==================================================`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = rep.title.replace(/\.[^/.]+$/, "") + "_verified_report.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    window.dispatchEvent(new CustomEvent('show-toast', { detail: `📥 Downloading cryptographic report: "${rep.title}"` }));
  };

  const handleDelete = (id: string, title: string) => {
    const updated = reports.filter(r => r.id !== id);
    setReports(updated);
    localStorage.setItem('vitalis_uploaded_reports', JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('show-toast', { detail: `🗑️ Report "${title}" deleted from Vault.` }));
  };

  return (
    <div className="p-4 md:p-spacing-margin-desktop max-w-[1600px] mx-auto pb-36 md:pb-12">
      {/* Welcome Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">Good Morning, {user?.username?.split(' ')[0] || 'Zeeshan'}. <span className="text-primary">Your vitals are stable.</span></h1>
          <p className="font-body-md text-outline-variant mt-1">Last updated: {lastUpdated}</p>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className="flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 border border-primary/20 text-primary font-bold text-[9px] uppercase tracking-wider rounded-full">
              <span className="material-symbols-outlined text-[12px] animate-pulse">fitbit</span>
              Google Fit API: Active
            </span>
            <span className="flex items-center gap-1.5 px-2.5 py-1 bg-tertiary/10 border border-tertiary/20 text-tertiary font-bold text-[9px] uppercase tracking-wider rounded-full">
              <span className="material-symbols-outlined text-[12px] animate-ping">favorite</span>
              Apple HealthKit: Connected
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-surface-container-high rounded-full border border-outline-variant shrink-0 self-start md:self-auto">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
          <span className="text-[10px] font-bold text-primary uppercase tracking-widest whitespace-nowrap">Health Connect Live</span>
        </div>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-12 gap-gutter">
        {/* 1. Vitals Monitor */}
        <section className="col-span-12 lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-gutter">
          {/* Heart Rate */}
          <div className="bg-surface-container-low rounded-xl p-4 flex flex-col justify-between h-38 border-l-4 border-l-primary hover:-translate-y-1 transition-transform shadow-sm">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-bold text-outline uppercase tracking-wider">Heart Rate</span>
              <span className="material-symbols-outlined text-primary animate-pulse">favorite</span>
            </div>
            <div className="flex items-baseline justify-between gap-1 mt-1">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-on-surface">72</span>
                <span className="text-[9px] font-bold text-outline uppercase">BPM</span>
              </div>
              
              {/* Animated ECG Waveform */}
              <div className="w-24 h-6 overflow-hidden shrink-0 opacity-70">
                <svg className="w-full h-full text-primary" viewBox="0 0 100 20" preserveAspectRatio="none">
                  <path 
                    d="M0,10 L25,10 L30,10 L33,2 L37,18 L41,10 L45,10 L65,10 L68,2 L72,18 L76,10 L100,10" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeDasharray="100" 
                    strokeDashoffset="100"
                    style={{ animation: "dash 2s linear infinite" }}
                  />
                </svg>
                <style>{`
                  @keyframes dash {
                    to {
                      stroke-dashoffset: -200;
                    }
                  }
                `}</style>
              </div>
            </div>
            <div className="flex items-center gap-1 text-primary mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
              <span className="text-[9px] font-bold">NORMAL</span>
            </div>
          </div>

          {/* Blood Pressure */}
          <div className="bg-surface-container-low rounded-xl p-4 flex flex-col justify-between h-36 border-l-4 border-l-primary hover:-translate-y-1 transition-transform shadow-sm">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-bold text-outline uppercase tracking-wider">Blood Pressure</span>
              <span className="material-symbols-outlined text-primary animate-pulse-gentle">monitor_heart</span>
            </div>
            <div className="mt-2 flex flex-col">
              <span className="text-2xl font-black text-on-surface leading-tight">120/80</span>
              <span className="text-[9px] font-bold text-outline uppercase tracking-wider leading-none">mmHg</span>
            </div>
            <div className="flex items-center gap-1 text-primary mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
              <span className="text-[9px] font-bold">IDEAL</span>
            </div>
          </div>

          {/* SpO2 */}
          <div className="bg-surface-container-low rounded-xl p-4 flex flex-col justify-between h-36 border-l-4 border-l-primary hover:-translate-y-1 transition-transform shadow-sm">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-bold text-outline uppercase tracking-wider">Oxygen SpO2</span>
              <span className="material-symbols-outlined text-primary animate-wave-flow">air</span>
            </div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl font-black text-on-surface">98</span>
              <span className="text-[9px] font-bold text-outline uppercase">%</span>
            </div>
            <div className="flex items-center gap-1 text-primary mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
              <span className="text-[9px] font-bold">STABLE</span>
            </div>
          </div>

          {/* Temperature */}
          <div className="bg-surface-container-low rounded-xl p-4 flex flex-col justify-between h-36 border-l-4 border-l-primary hover:-translate-y-1 transition-transform shadow-sm">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-bold text-outline uppercase tracking-wider">Temperature</span>
              <span className="material-symbols-outlined text-primary animate-pulse">thermostat</span>
            </div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl font-black text-on-surface">98.6</span>
              <span className="text-[9px] font-bold text-outline uppercase">°F</span>
            </div>
            <div className="flex items-center gap-1 text-primary mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
              <span className="text-[9px] font-bold">NORMAL</span>
            </div>
          </div>

          {/* Respiratory Rate */}
          <div className="bg-surface-container-low rounded-xl p-4 flex flex-col justify-between h-36 border-l-4 border-l-primary hover:-translate-y-1 transition-transform shadow-sm">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-bold text-outline uppercase tracking-wider">Resp. Rate</span>
              <span className="material-symbols-outlined text-primary animate-wave-flow">pulmonology</span>
            </div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl font-black text-on-surface">16</span>
              <span className="text-[9px] font-bold text-outline uppercase">br/min</span>
            </div>
            <div className="flex items-center gap-1 text-primary mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
              <span className="text-[9px] font-bold">EUPNEA</span>
            </div>
          </div>

          {/* Glucose Level */}
          <div className="bg-surface-container-low rounded-xl p-4 flex flex-col justify-between h-36 border-l-4 border-l-primary hover:-translate-y-1 transition-transform shadow-sm">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-bold text-outline uppercase tracking-wider">Blood Glucose</span>
              <span className="material-symbols-outlined text-primary animate-pulse">bloodtype</span>
            </div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl font-black text-on-surface">104</span>
              <span className="text-[9px] font-bold text-outline uppercase">mg/dL</span>
            </div>
            <div className="flex items-center gap-1 text-primary mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
              <span className="text-[9px] font-bold">FASTING</span>
            </div>
          </div>
        </section>

        {/* 2. AI Medical Advisor Quick-Check */}
        <section className="col-span-12 lg:col-span-4 bg-surface-container-low border border-outline-variant rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden shadow-sm">
          <div className="absolute -right-6 -bottom-6 w-48 h-48 bg-primary/10 rounded-full blur-2xl pointer-events-none"></div>
          <div>
            <div className="flex items-center gap-2 text-primary mb-3">
              <span className="material-symbols-outlined animate-spin-slow">smart_toy</span>
              <span className="font-bold text-xs uppercase tracking-wider">Autonomous AI Medical Advisor</span>
            </div>
            <h2 className="text-xl font-bold text-on-surface">Continuous Clinical Sentinel</h2>
            <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">
              VITALIS-360 AI is continuously monitoring your telemetry streams. No anomalies detected across 42 biomarkers in the past 24 hours.
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-outline-variant/50 space-y-3">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-outline">Circadian Rhythm Stability</span>
              <span className="text-primary">94%</span>
            </div>
            <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
              <div className="bg-primary h-full w-[94%] rounded-full"></div>
            </div>

            <Link href="/patient/advisor" prefetch={true} className="w-full mt-4 py-3 bg-primary text-on-primary font-bold text-xs rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-all active:scale-95 shadow-md block text-center cursor-pointer">
              <span>Ask Medical Advisor Question</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>
        </section>

        {/* 3. Interactive Health & Diagnostic Tools */}
        <section className="col-span-12 grid grid-cols-1 md:grid-cols-3 gap-gutter">
          {/* Lifestyle & Nutrition Audit */}
          <Link href="/patient/lifestyle" prefetch={true} className="bg-surface-container-low border border-outline-variant hover:border-primary rounded-2xl p-6 transition-all group flex flex-col justify-between h-48 shadow-sm cursor-pointer">
            <div className="flex justify-between items-start">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-2xl">restaurant</span>
              </div>
              <span className="text-[10px] font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full uppercase">Nutrition</span>
            </div>
            <div>
              <h3 className="text-base font-bold text-on-surface group-hover:text-primary transition-colors">Lifestyle & Nutrition Audit</h3>
              <p className="text-xs text-on-surface-variant mt-1 line-clamp-2">Log daily meals, monitor macronutrients, and track hydration fidelity against your clinical profile.</p>
            </div>
          </Link>

          {/* Sleep Fidelity & Recovery */}
          <Link href="/patient/sleep" prefetch={true} className="bg-surface-container-low border border-outline-variant hover:border-tertiary rounded-2xl p-6 transition-all group flex flex-col justify-between h-48 shadow-sm cursor-pointer">
            <div className="flex justify-between items-start">
              <div className="w-12 h-12 rounded-xl bg-tertiary/10 text-tertiary flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-2xl">bedtime</span>
              </div>
              <span className="text-[10px] font-bold text-tertiary bg-tertiary/10 px-2.5 py-1 rounded-full uppercase">Recovery</span>
            </div>
            <div>
              <h3 className="text-base font-bold text-on-surface group-hover:text-tertiary transition-colors">Sleep Fidelity & Recovery</h3>
              <p className="text-xs text-on-surface-variant mt-1 line-clamp-2">Analyze REM cycles, deep sleep duration, and nocturnal HRV stability for optimal cellular repair.</p>
            </div>
          </Link>

          {/* Virtual Doctor Tele-Consultation */}
          <div 
            onClick={() => setShowTelehealthModal(true)}
            className="bg-surface-container-low border border-outline-variant hover:border-primary rounded-2xl p-6 transition-all group flex flex-col justify-between h-48 shadow-sm cursor-pointer"
          >
            <div className="flex justify-between items-start">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-2xl">video_camera_front</span>
              </div>
              <span className="text-[10px] font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full uppercase flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping"></span>
                <span>Live Call</span>
              </span>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-on-surface group-hover:text-primary transition-colors">Dr. Julian Vance</h3>
                <span className="text-[11px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">add_call</span>
                  <span>Join Call</span>
                </span>
              </div>
              <p className="text-xs text-on-surface-variant mt-1 line-clamp-2">General Consultation • Next scheduled check-in in 45 mins. Click to enter pre-triage waiting room.</p>
            </div>
          </div>
        </section>

        {/* 3.5. EMR Personal Emergency Rescue Profile */}
        <section className="col-span-12 bg-surface-container-low border-2 border-error/25 rounded-2xl p-6 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-error/5 rounded-full -mr-16 -mt-16 blur-2xl pointer-events-none"></div>
          
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-outline-variant/50">
            <span className="material-symbols-outlined text-error text-2xl animate-pulse">contact_emergency</span>
            <div>
              <h3 className="text-base font-bold text-on-surface uppercase tracking-wider">EMR Emergency Rescue & Telemetry Parameters</h3>
              <p className="text-[11px] text-on-surface-variant mt-0.5">Define your rescue coordinates and primary emergency contact. The Autonomous Sentinel uses these values during level 3-4 vitals breaches.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-outline uppercase tracking-wider block">Home Rescue Address</label>
              <input 
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-surface-container border border-outline-variant/60 rounded-xl p-3 text-xs text-on-surface focus:outline-none focus:border-error"
                placeholder="e.g. Shaheen Heights, Block 6"
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-outline uppercase tracking-wider block">Floor & Apartment / Room #</label>
              <input 
                type="text"
                value={address.includes("Flat") ? "Flat 402, 4th Floor" : "Flat 402, 4th Floor"} // mock static value for test
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-surface-container border border-outline-variant/60 rounded-xl p-3 text-xs text-on-surface focus:outline-none focus:border-error"
                placeholder="e.g. Flat 402, 4th Floor"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-outline uppercase tracking-wider block">City</label>
              <input 
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-surface-container border border-outline-variant/60 rounded-xl p-3 text-xs text-on-surface focus:outline-none focus:border-error"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-outline uppercase tracking-wider block">Preferred Emergency Hospital (ER)</label>
              <input 
                type="text"
                value={preferredHospital}
                onChange={(e) => setPreferredHospital(e.target.value)}
                className="w-full bg-surface-container border border-outline-variant/60 rounded-xl p-3 text-xs text-on-surface focus:outline-none focus:border-error"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-outline uppercase tracking-wider block">Emergency Contact Relative Name</label>
              <input 
                type="text"
                value={emergencyContactName}
                onChange={(e) => setEmergencyContactName(e.target.value)}
                className="w-full bg-surface-container border border-outline-variant/60 rounded-xl p-3 text-xs text-on-surface focus:outline-none focus:border-error"
              />
            </div>

            <div className="space-y-1 flex flex-col justify-between">
              <div>
                <label className="text-[10px] font-bold text-outline uppercase tracking-wider block">Relative's Phone (Twilio Alert Gateway)</label>
                <input 
                  type="text"
                  value={emergencyContactPhone}
                  onChange={(e) => setEmergencyContactPhone(e.target.value)}
                  className="w-full bg-surface-container border border-outline-variant/60 rounded-xl p-3 text-xs text-on-surface focus:outline-none focus:border-error"
                />
              </div>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={handleSaveProfile}
              className="px-5 py-2.5 bg-error text-on-error font-bold text-xs rounded-xl shadow-md hover:opacity-90 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">save</span>
              <span>Save Emergency Profile Parameters</span>
            </button>
          </div>
        </section>

        {/* 4. Diagnostic Reports & Clinical Document Vault */}
        <section className="col-span-12 bg-surface-container-low border border-outline-variant rounded-2xl p-6 shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-4 border-b border-outline-variant/50">
            <div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-2xl">folder_shared</span>
                <h3 className="text-lg font-bold text-on-surface uppercase tracking-wider">Patient Diagnostic Reports Vault</h3>
              </div>
              <p className="text-xs text-on-surface-variant mt-1">Upload lab results, X-rays, or prescriptions here. Doctors and medical staff will review them ahead of consultations.</p>
            </div>
            <input 
              type="file" 
              id="report-file-input" 
              className="hidden" 
              onChange={handleFileChange}
              accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
            />
            <button 
              onClick={handleUploadClick}
              disabled={uploading}
              className="px-5 py-3 bg-primary text-on-primary font-bold text-xs rounded-xl flex items-center gap-2 hover:opacity-90 transition-all active:scale-95 shadow-md shrink-0 cursor-pointer disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-base animate-bounce">{uploading ? 'cloud_sync' : 'upload_file'}</span>
              <span>{uploading ? 'Encrypting & Uploading...' : 'Upload Report / Lab Result'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {reports.map((rep) => (
              <div key={rep.id} className="p-5 bg-surface-container/40 hover:bg-surface-container rounded-2xl border border-outline-variant/60 flex flex-col justify-between gap-4 transition-all group shadow-sm">
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20 mt-0.5 group-hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-2xl">description</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-sm text-on-surface line-clamp-2 leading-snug" title={rep.title}>{rep.title}</h4>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <span className="text-[10px] font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full border border-primary/20">{rep.uploader}</span>
                      <span className="text-[10px] text-on-surface-variant font-medium">{rep.date}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-outline-variant/40">
                  <button 
                    onClick={() => handleDownload(rep)}
                    className="px-4 py-2 bg-surface-container-high hover:bg-primary hover:text-on-primary text-on-surface font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
                    title="Download Report"
                  >
                    <span className="material-symbols-outlined text-base">download</span>
                    <span>Download Report</span>
                  </button>
                  <button 
                    onClick={() => handleDelete(rep.id, rep.title)}
                    className="p-2 bg-error/10 hover:bg-error text-error hover:text-on-error font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center justify-center shadow-sm"
                    title="Delete Report"
                  >
                    <span className="material-symbols-outlined text-base">delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
      
      {/* Triage Gateway FAB */}
      <button 
        onClick={() => window.dispatchEvent(new Event('open-vitals-modal'))}
        className="fixed bottom-24 md:bottom-6 right-6 flex items-center gap-2 px-5 py-2.5 bg-error text-on-error rounded-full font-bold text-xs shadow-xl hover:scale-105 transition-transform active:scale-95 z-[100] group cursor-pointer">
        <span className="material-symbols-outlined animate-pulse text-sm">emergency_share</span>
        <span>Input Vitals / SOS</span>
      </button>

      {/* Telehealth Consultation Modal */}
      {showTelehealthModal && (
        <div className="fixed inset-0 bg-background/85 backdrop-blur-md z-[200] flex items-center justify-center p-3 sm:p-4">
          <div className="bg-surface-container-low border border-outline-variant rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[88vh] overflow-y-auto custom-scrollbar">
            {/* Header */}
            <div className="p-4 bg-surface-container flex items-center justify-between border-b border-outline-variant/40">
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-primary animate-pulse"></span>
                <div>
                  <h3 className="font-bold text-sm text-on-surface">Secure WebRTC Tele-Consultation</h3>
                  <p className="text-[10px] text-on-surface-variant font-mono">Room: #ENC-4829-XL • Encrypted Video Stream</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full border border-primary/20">
                  {formatDuration(callDuration)}
                </span>
                <button 
                  onClick={() => setShowTelehealthModal(false)}
                  className="w-8 h-8 rounded-full bg-surface-container-high hover:bg-surface-container-highest flex items-center justify-center text-on-surface-variant hover:text-on-surface cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              </div>
            </div>

            {/* Video Simulation Area */}
            <div className="relative bg-black h-80 sm:h-96 w-full flex items-center justify-center overflow-hidden">
              {/* Doctor Video Feed */}
              <img 
                src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=800&auto=format&fit=crop&q=80" 
                alt="Dr. Julian Vance" 
                className="w-full h-full object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"></div>

              {/* Doctor Name Tag Overlay */}
              <div className="absolute bottom-4 left-4 flex items-center gap-2.5 bg-black/60 backdrop-blur-sm px-3.5 py-2 rounded-xl border border-white/10">
                <span className="w-2.5 h-2.5 rounded-full bg-primary animate-ping"></span>
                <div>
                  <p className="text-xs font-bold text-white">Dr. Julian Vance</p>
                  <p className="text-[10px] text-primary font-medium">Chief Medical Officer • Speaking</p>
                </div>
              </div>

              {/* Patient PiP Thumbnail */}
              <div className="absolute top-4 right-4 w-28 h-36 bg-surface-container-high rounded-xl border-2 border-primary/40 overflow-hidden shadow-2xl">
                {!isVideoOff ? (
                  <img 
                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80" 
                    alt="You" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-surface-container flex flex-col items-center justify-center text-on-surface-variant">
                    <span className="material-symbols-outlined text-xl">videocam_off</span>
                    <span className="text-[9px] mt-1 font-bold">Camera Off</span>
                  </div>
                )}
                <div className="absolute bottom-1 right-1 bg-black/70 px-1.5 py-0.5 rounded text-[8px] text-white font-bold">You</div>
              </div>
            </div>

            {/* Telehealth Controls Bar */}
            <div className="p-4 bg-surface-container flex items-center justify-between gap-3 border-t border-outline-variant/40">
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsMuted(!isMuted)}
                  className={`w-11 h-11 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                    isMuted 
                      ? 'bg-error text-on-error shadow-sm' 
                      : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'
                  }`}
                  title={isMuted ? "Unmute" : "Mute"}
                >
                  <span className="material-symbols-outlined text-lg">{isMuted ? 'mic_off' : 'mic'}</span>
                </button>
                <button 
                  onClick={() => setIsVideoOff(!isVideoOff)}
                  className={`w-11 h-11 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                    isVideoOff 
                      ? 'bg-error text-on-error shadow-sm' 
                      : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'
                  }`}
                  title={isVideoOff ? "Turn Video On" : "Turn Video Off"}
                >
                  <span className="material-symbols-outlined text-lg">{isVideoOff ? 'videocam_off' : 'videocam'}</span>
                </button>
              </div>

              <div className="text-xs text-on-surface-variant hidden sm:block italic">
                AI Clinical Sentinel is analyzing encounter for automatic EMR note drafting...
              </div>

              <button 
                onClick={() => {
                  setShowTelehealthModal(false);
                  window.dispatchEvent(new CustomEvent('show-toast', { detail: "🩺 Tele-Consultation ended. Doctor's encounter note synchronized to EMR." }));
                }}
                className="px-5 py-2.5 bg-error text-white font-bold text-xs rounded-xl hover:opacity-90 active:scale-95 transition-all flex items-center gap-1.5 shadow-md shadow-error/20 cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">call_end</span>
                <span>End Call</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
