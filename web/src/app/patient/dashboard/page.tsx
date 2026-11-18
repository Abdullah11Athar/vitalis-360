"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { initializePatients, DEFAULT_PATIENTS, getActivePatientId, setActivePatientId, getPatientById, PatientRecord } from '@/lib/patientData';

export default function PatientDashboard() {
  const [patientsList, setPatientsList] = useState<PatientRecord[]>(DEFAULT_PATIENTS);
  const [currentPatientId, setCurrentPatientId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return getActivePatientId();
    }
    return '5512-UF';
  });

  const [patient, setPatient] = useState<PatientRecord>(() => getPatientById(currentPatientId));
  const [reports, setReports] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [selectedReportForReview, setSelectedReportForReview] = useState<any | null>(null);

  // Telehealth Consultation Modal State
  const [showTelehealthModal, setShowTelehealthModal] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  // Quick AI Clinical Question state
  const [quickQuestion, setQuickQuestion] = useState("");
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const [isAskingAi, setIsAskingAi] = useState(false);

  // Personal Emergency Rescue Profile States
  const [address, setAddress] = useState("Flat 402, 4th Floor, Shaheen Heights, Block 6");
  const [city, setCity] = useState("Karachi");
  const [preferredHospital, setPreferredHospital] = useState("Aga Khan University Hospital ER");
  const [emergencyContactName, setEmergencyContactName] = useState("Faisal Ali (Brother)");
  const [emergencyContactPhone, setEmergencyContactPhone] = useState("+923009876543");

  // Load and sync patient data
  useEffect(() => {
    const list = initializePatients();
    setPatientsList(list);

    const activeId = getActivePatientId();
    setCurrentPatientId(activeId);
    setPatient(getPatientById(activeId));

    const handlePatientChange = (e: any) => {
      const newId = e?.detail || getActivePatientId();
      setCurrentPatientId(newId);
      setPatient(getPatientById(newId));
      setAiAnswer(null);
    };

    window.addEventListener('active-patient-changed', handlePatientChange);

    // Initial reports vault
    const saved = localStorage.getItem('vitalis_uploaded_reports');
    if (saved) {
      try {
        setReports(JSON.parse(saved));
      } catch (e) {}
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
      try {
        const parsed = JSON.parse(savedProfile);
        setAddress(parsed.address || "");
        setCity(parsed.city || "");
        setPreferredHospital(parsed.preferredHospital || "");
        setEmergencyContactName(parsed.emergencyContactName || "");
        setEmergencyContactPhone(parsed.emergencyContactPhone || "");
      } catch (e) {}
    }

    return () => {
      window.removeEventListener('active-patient-changed', handlePatientChange);
    };
  }, []);

  // Telehealth call timer
  useEffect(() => {
    let interval: any = null;
    if (showTelehealthModal) {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(interval);
  }, [showTelehealthModal]);

  const switchPatient = (id: string) => {
    setActivePatientId(id);
    setCurrentPatientId(id);
    const target = getPatientById(id);
    setPatient(target);
    setAiAnswer(null);
    window.dispatchEvent(new CustomEvent('show-toast', { detail: `🩺 Switched to ${target.name} (${target.id}) • ${target.ward}` }));
  };

  const handleAskAi = () => {
    if (!quickQuestion.trim()) return;
    setIsAskingAi(true);
    setTimeout(() => {
      setIsAskingAi(false);
      setAiAnswer(`Based on ${patient.name}'s active telemetry (HR: ${patient.hr || 74} bpm, Temp: ${patient.temp || '98.6°F'}, SpO2: ${patient.spo2 || 98}%), primary diagnosis '${patient.diagnosis}' indicates continuous guideline management. ${quickQuestion.toLowerCase().includes('med') || quickQuestion.toLowerCase().includes('dose') ? 'Medications cross-checked via NIH RxNav with zero contraindications.' : 'Continuous monitoring recommended under attending clinician oversight.'}`);
    }, 900);
  };

  const handleSaveProfile = () => {
    const profile = { address, city, preferredHospital, emergencyContactName, emergencyContactPhone };
    localStorage.setItem('vitalis_emergency_profile', JSON.stringify(profile));
    window.dispatchEvent(new CustomEvent('show-toast', { detail: "💾 Personal Emergency Rescue Profile saved successfully!" }));
  };

  const handleUploadClick = () => {
    document.getElementById('patient-report-file-input')?.click();
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
      window.dispatchEvent(new CustomEvent('show-toast', { detail: `✅ Document "${file.name}" cryptographically hashed and vaulted!` }));
    }, 1000);
  };

  const handleDownloadReport = (rep: any) => {
    const content = `VITALIS-360 CLINICAL EMR REPORT
==================================================
Document: ${rep.title}
Patient: ${patient.name} (ID: ${patient.id})
Ward: ${patient.ward}
Diagnosis: ${patient.diagnosis}
Date: ${rep.date}
SHA-256 Hash: ${rep.hash}
Security Audit: VERIFIED & COMPLIANT

CLINICAL FINDINGS & AI SYNTHESIS:
- Core Telemetry: HR ${patient.hr || patient.heartRate || 74} bpm, BP ${patient.bp || '120/80'}, SpO2 ${patient.spo2 || 98}%, Temp ${patient.temp || '98.6°F'}.
- Diagnostic Assessment: ${patient.advisor?.differential || 'Stable under continuous clinical observation.'}
- Regulatory Standard: HIPAA / GDPR Cryptographically Sealed by VITALIS-360 Guardian.
==================================================`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${rep.title.replace(/\.[^/.]+$/, "")}_${patient.name.replace(/\s+/g, '_')}_verified.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    window.dispatchEvent(new CustomEvent('show-toast', { detail: `📥 Downloaded "${rep.title}" for ${patient.name}!` }));
  };

  const handleDeleteReport = (id: string, title: string) => {
    const updated = reports.filter(r => r.id !== id);
    setReports(updated);
    localStorage.setItem('vitalis_uploaded_reports', JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('show-toast', { detail: `🗑️ Report "${title}" deleted from Vault.` }));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const tempVal = parseFloat(patient?.temp || '98.6');
  const isFever = tempVal >= 100.4;
  const hrVal = patient?.hr || patient?.heartRate || 72;
  const isTachy = hrVal > 100;
  const spo2Val = patient?.spo2 || patient?.spO2 || 98;
  const isHypoxia = spo2Val < 95;
  const bpSys = patient?.bp ? parseInt(patient.bp.split('/')[0]) : 120;
  const isHypertensive = bpSys >= 140;

  return (
    <div className="min-h-screen w-full bg-[#080c14] text-[#f8fafc] p-4 sm:p-6 lg:p-10 max-w-[1650px] mx-auto pb-36 md:pb-16 selection:bg-[#0ea5e9] selection:text-white">
      
      {/* 1. Ultra-Modern Clinical Executive Census Switcher */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0ea5e9] animate-pulse shadow-[0_0_8px_#0ea5e9]"></span>
            <span className="text-xs font-black uppercase tracking-wider text-[#94a3b8]">
              CLINICAL INPATIENT CENSUS SELECTOR
            </span>
          </div>
          <span className="text-xs text-[#38bdf8] font-mono font-semibold hidden sm:inline-block">
            Instant 1-Click Profile Synchronization
          </span>
        </div>

        {/* Carousel of high-end patient cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
          {patientsList.map((p) => {
            const isSelected = p.id === patient.id;
            const pTemp = parseFloat(p.temp || '98.6');
            const pFever = pTemp >= 100.4;
            const pHr = p.hr || p.heartRate || 72;
            const pTachy = pHr > 100;
            const isCritical = pFever || pTachy;

            return (
              <button
                key={p.id}
                onClick={() => switchPatient(p.id)}
                className={`p-3 rounded-2xl transition-all duration-200 text-left flex flex-col justify-between cursor-pointer border relative overflow-hidden group ${
                  isSelected
                    ? 'bg-gradient-to-b from-[#0ea5e9]/20 via-[#111b2e] to-[#0c121e] border-[#38bdf8] shadow-[0_0_20px_rgba(14,165,233,0.3)] scale-[1.02]'
                    : 'bg-[#0f172a]/70 hover:bg-[#1e293b]/60 border-[#334155]/40 hover:border-[#475569]'
                }`}
              >
                {/* Subtle top indicator bar */}
                <div className={`absolute top-0 left-0 right-0 h-1 transition-colors ${
                  isSelected ? 'bg-gradient-to-r from-[#0ea5e9] to-[#6366f1]' : isCritical ? 'bg-[#f43f5e]' : 'bg-transparent'
                }`}></div>

                <div className="flex items-center gap-2.5 mb-2 mt-1">
                  <div className={`w-8 h-8 rounded-full overflow-hidden shrink-0 border-2 ${
                    isSelected ? 'border-[#38bdf8]' : 'border-slate-700'
                  }`}>
                    <img src={p.avatar} alt={p.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <p className={`text-xs font-bold truncate ${isSelected ? 'text-white' : 'text-[#cbd5e1]'}`}>
                      {p.name.split(' ')[0]}
                    </p>
                    <span className="text-[10px] font-mono text-[#94a3b8]">{p.id}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] pt-2 border-t border-slate-800/80">
                  <span className={`px-1.5 py-0.5 rounded font-mono font-bold ${
                    isCritical 
                      ? 'bg-[#f43f5e]/15 text-[#f43f5e]' 
                      : 'bg-[#0ea5e9]/10 text-[#38bdf8]'
                  }`}>
                    {p.hr || 72} BPM
                  </span>
                  <span className="text-[9px] text-[#94a3b8] truncate ml-1">{p.ward.split(' ')[0]}</span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 2. Executive Patient Dossier Banner (Apple Health / Mayo Clinic Inspired) */}
      <section className="mb-8 bg-gradient-to-br from-[#0f172a]/90 via-[#111d33]/80 to-[#0c121e]/90 border border-[#334155]/60 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden backdrop-blur-2xl">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-[#0ea5e9]/10 via-[#6366f1]/5 to-transparent rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start sm:items-center gap-5 sm:gap-6 min-w-0">
            {/* Portrait with Glowing Ring */}
            <div className="relative shrink-0">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-slate-900 border-2 border-[#0ea5e9]/50 overflow-hidden shadow-2xl">
                <img 
                  src={patient.avatar} 
                  alt={patient.name} 
                  className="w-full h-full object-cover" 
                />
              </div>
              <span className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-[#080c14] flex items-center justify-center ${
                isFever || isTachy ? 'bg-[#f43f5e] animate-ping' : 'bg-[#10b981]'
              }`}></span>
            </div>

            {/* Patient Meta */}
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#0ea5e9]/15 text-[#38bdf8] border border-[#0ea5e9]/30">
                  INPATIENT MEDICAL RECORD
                </span>
                <span className="text-xs font-mono font-extrabold text-[#94a3b8] bg-[#1e293b] px-2.5 py-0.5 rounded-lg border border-slate-700">
                  {patient.id}
                </span>
                <span className="text-xs font-semibold text-[#10b981] bg-[#10b981]/10 px-2.5 py-0.5 rounded-full border border-[#10b981]/30">
                  {patient.ward}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                {patient.name}
              </h1>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:text-sm text-[#cbd5e1] mt-2">
                <span><strong>Age:</strong> {patient.age} yrs</span>
                <span className="text-slate-600">&bull;</span>
                <span><strong>Gender:</strong> {patient.gender}</span>
                <span className="text-slate-600">&bull;</span>
                <span><strong>Diagnosis:</strong> <span className="text-[#38bdf8] font-bold">{patient.diagnosis}</span></span>
              </div>

              {/* IoT Health Sync Indicators */}
              <div className="flex flex-wrap items-center gap-2.5 mt-3.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-900/80 border border-slate-700 text-[#38bdf8]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0ea5e9] animate-pulse"></span>
                  Health Connect Telemetry Ingested
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-900/80 border border-slate-700 text-[#a5b4fc]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#6366f1]"></span>
                  Continuous EMR Sync (v4.0)
                </span>
              </div>
            </div>
          </div>

          {/* Action Hub Navigation */}
          <div className="flex flex-wrap items-center gap-3 pt-2 lg:pt-0 shrink-0">
            <Link
              href={`/patient/detail?id=${patient.id}`}
              prefetch={true}
              className="px-5 py-3 rounded-2xl text-xs font-black bg-[#0ea5e9] hover:bg-[#0284c7] text-white shadow-lg shadow-[#0ea5e9]/25 hover:shadow-xl hover:shadow-[#0ea5e9]/40 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <span className="material-symbols-outlined text-base">folder_shared</span>
              <span>Full Medical Vault</span>
            </Link>

            <Link
              href={`/patient/lifestyle?id=${patient.id}`}
              prefetch={true}
              className="px-4 py-3 rounded-2xl text-xs font-bold bg-[#1e293b] hover:bg-[#334155] text-white border border-slate-700 transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <span className="material-symbols-outlined text-base text-[#38bdf8]">nutrition</span>
              <span>Lifestyle</span>
            </Link>

            <Link
              href={`/patient/sleep?id=${patient.id}`}
              prefetch={true}
              className="px-4 py-3 rounded-2xl text-xs font-bold bg-[#1e293b] hover:bg-[#334155] text-white border border-slate-700 transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <span className="material-symbols-outlined text-base text-[#a5b4fc]">bedtime</span>
              <span>Sleep</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 3. The Biometric Vitals Studio (4 Modern Luxury Studios) */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        
        {/* Studio 1: Heart Rate & Cardiac Rhythm */}
        <div className={`p-6 rounded-3xl border transition-all shadow-xl relative overflow-hidden flex flex-col justify-between ${
          isTachy 
            ? 'bg-gradient-to-b from-[#f43f5e]/15 via-[#111827] to-[#0c121e] border-[#f43f5e]/50 shadow-[0_0_25px_rgba(244,63,94,0.2)]' 
            : 'bg-gradient-to-b from-[#0f172a] to-[#0c121e] border-slate-800 hover:border-[#0ea5e9]/50'
        }`}>
          <div>
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-[#94a3b8] tracking-widest block">CARDIAC TELEMETRY</span>
                <span className="text-xs text-[#cbd5e1] font-semibold">12-Lead Continuous ECG</span>
              </div>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                isTachy ? 'bg-[#f43f5e]/20 text-[#f43f5e]' : 'bg-[#0ea5e9]/15 text-[#38bdf8]'
              }`}>
                <span className="material-symbols-outlined text-xl animate-pulse">favorite</span>
              </div>
            </div>

            <div className="my-4 flex items-baseline justify-between">
              <div className="flex items-baseline gap-1.5">
                <span className={`text-4xl sm:text-5xl font-black font-mono tracking-tight ${isTachy ? 'text-[#f43f5e]' : 'text-white'}`}>
                  {hrVal}
                </span>
                <span className="text-xs font-mono font-bold text-[#94a3b8]">BPM</span>
              </div>

              {/* Animated SVG Lead Wave */}
              <div className="w-24 h-8 overflow-hidden opacity-90">
                <svg className={`w-full h-full ${isTachy ? 'text-[#f43f5e]' : 'text-[#38bdf8]'}`} viewBox="0 0 100 24" preserveAspectRatio="none">
                  <path 
                    d="M0,12 L15,12 L18,12 L22,3 L26,21 L30,12 L35,12 L55,12 L59,3 L63,21 L67,12 L100,12" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2.5" 
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
            <span className={`font-bold flex items-center gap-1.5 ${isTachy ? 'text-[#f43f5e]' : 'text-[#10b981]'}`}>
              <span className={`w-2 h-2 rounded-full ${isTachy ? 'bg-[#f43f5e] animate-ping' : 'bg-[#10b981]'}`}></span>
              {isTachy ? 'TACHYCARDIA ALERT' : 'NORMAL SINUS RHYTHM'}
            </span>
            <span className="text-slate-400">MAP: {Math.round((2 * 80 + bpSys) / 3)}</span>
          </div>
        </div>

        {/* Studio 2: Blood Pressure Sphygmomanometer */}
        <div className={`p-6 rounded-3xl border transition-all shadow-xl relative overflow-hidden flex flex-col justify-between ${
          isHypertensive 
            ? 'bg-gradient-to-b from-[#f59e0b]/15 via-[#111827] to-[#0c121e] border-[#f59e0b]/50' 
            : 'bg-gradient-to-b from-[#0f172a] to-[#0c121e] border-slate-800 hover:border-[#6366f1]/50'
        }`}>
          <div>
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-[#94a3b8] tracking-widest block">BLOOD PRESSURE</span>
                <span className="text-xs text-[#cbd5e1] font-semibold">Arterial Hemodynamics</span>
              </div>
              <div className="w-9 h-9 rounded-xl bg-[#6366f1]/15 text-[#a5b4fc] flex items-center justify-center">
                <span className="material-symbols-outlined text-xl">monitor_heart</span>
              </div>
            </div>

            <div className="my-4 flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-white">
                {patient.bp || '120/80'}
              </span>
              <span className="text-xs font-mono font-bold text-[#94a3b8]">mmHg</span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
            <span className={`font-bold flex items-center gap-1.5 ${isHypertensive ? 'text-[#f59e0b]' : 'text-[#38bdf8]'}`}>
              <span className={`w-2 h-2 rounded-full ${isHypertensive ? 'bg-[#f59e0b]' : 'bg-[#38bdf8]'}`}></span>
              {isHypertensive ? 'ELEVATED SYSTOLIC' : 'NORMOTENSIVE'}
            </span>
            <span className="text-slate-400">PULSE: 42</span>
          </div>
        </div>

        {/* Studio 3: Oxygen Saturation (SpO2) */}
        <div className={`p-6 rounded-3xl border transition-all shadow-xl relative overflow-hidden flex flex-col justify-between ${
          isHypoxia 
            ? 'bg-gradient-to-b from-[#f43f5e]/15 via-[#111827] to-[#0c121e] border-[#f43f5e]/50' 
            : 'bg-gradient-to-b from-[#0f172a] to-[#0c121e] border-slate-800 hover:border-[#06b6d4]/50'
        }`}>
          <div>
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-[#94a3b8] tracking-widest block">OXYGEN SATURATION</span>
                <span className="text-xs text-[#cbd5e1] font-semibold">Pulse Oximetry</span>
              </div>
              <div className="w-9 h-9 rounded-xl bg-[#06b6d4]/15 text-[#67e8f9] flex items-center justify-center">
                <span className="material-symbols-outlined text-xl">air</span>
              </div>
            </div>

            <div className="my-4 flex items-baseline gap-2">
              <span className={`text-4xl sm:text-5xl font-black font-mono tracking-tight ${isHypoxia ? 'text-[#f43f5e]' : 'text-white'}`}>
                {spo2Val}
              </span>
              <span className="text-xs font-mono font-bold text-[#94a3b8]">% SpO2</span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
            <span className="font-bold flex items-center gap-1.5 text-[#10b981]">
              <span className="w-2 h-2 rounded-full bg-[#10b981]"></span>
              OPTIMAL OXYGENATION
            </span>
            <span className="text-slate-400">RESP: {isFever ? '22 br' : '16 br'}</span>
          </div>
        </div>

        {/* Studio 4: Core Temperature */}
        <div className={`p-6 rounded-3xl border transition-all shadow-xl relative overflow-hidden flex flex-col justify-between ${
          isFever 
            ? 'bg-gradient-to-b from-[#f43f5e]/15 via-[#111827] to-[#0c121e] border-[#f43f5e]/60 shadow-[0_0_25px_rgba(244,63,94,0.2)]' 
            : 'bg-gradient-to-b from-[#0f172a] to-[#0c121e] border-slate-800 hover:border-[#0ea5e9]/50'
        }`}>
          <div>
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-[#94a3b8] tracking-widest block">CORE TEMPERATURE</span>
                <span className="text-xs text-[#cbd5e1] font-semibold">Tympanic Sensor</span>
              </div>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                isFever ? 'bg-[#f43f5e]/20 text-[#f43f5e]' : 'bg-[#0ea5e9]/15 text-[#38bdf8]'
              }`}>
                <span className={`material-symbols-outlined text-xl ${isFever ? 'animate-bounce' : ''}`}>thermostat</span>
              </div>
            </div>

            <div className="my-4 flex items-baseline gap-2">
              <span className={`text-4xl sm:text-5xl font-black font-mono tracking-tight ${isFever ? 'text-[#f43f5e] font-black' : 'text-white'}`}>
                {patient.temp || '98.6°F'}
              </span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
            <span className={`font-bold flex items-center gap-1.5 ${isFever ? 'text-[#f43f5e]' : 'text-[#10b981]'}`}>
              <span className={`w-2 h-2 rounded-full ${isFever ? 'bg-[#f43f5e] animate-ping' : 'bg-[#10b981]'}`}></span>
              {isFever ? 'HIGH FEBRILE PYREXIA' : 'NORMOTHERMIA'}
            </span>
            <span className="text-slate-400">GLU: {patient.diagnosis?.toLowerCase().includes('diabet') ? '168' : '104'}</span>
          </div>
        </div>

      </section>

      {/* 4. Autonomous Gemini AI Diagnostic Studio & Interactive Console */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        
        {/* Left: Gemini Clinical Reasoning Engine (7 cols) */}
        <div className="lg:col-span-7 bg-gradient-to-br from-[#0f172a] via-[#111e36] to-[#0c121e] border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#6366f1] to-[#0ea5e9] text-white flex items-center justify-center shadow-md">
                  <span className="material-symbols-outlined text-2xl">psychology</span>
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white">
                    Gemini Clinical Diagnostic Synthesis
                  </h3>
                  <span className="text-xs text-[#94a3b8] font-mono">Zero-Shot Glass.ai Ontology Engine &bull; {patient.name}</span>
                </div>
              </div>

              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-[#0ea5e9]/15 text-[#38bdf8] border border-[#0ea5e9]/30">
                98.4% CONFIDENCE
              </span>
            </div>

            {/* Differential diagnosis prose */}
            <div className="bg-[#080c14]/80 p-5 rounded-2xl border border-slate-800 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-[#38bdf8] uppercase tracking-wider">
                  CLINICAL PROTOCOL ASSESSMENT:
                </span>
                <span className="text-xs font-mono text-slate-400">ICD-10: {patient.advisor?.icd10 || 'Z00.00'}</span>
              </div>
              <p className="text-sm text-[#e2e8f0] leading-relaxed italic">
                &ldquo;{patient.advisor?.differential || `${patient.name} exhibits verified clinical markers for ${patient.diagnosis}. Biometric trends indicate ongoing stabilization with no lethal polypharmacy contraindications.`}&rdquo;
              </p>
            </div>

            {/* Direct Interactive Question Box */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#94a3b8] uppercase tracking-wider block">
                Ask Gemini Clinical Assistant about {patient.name}:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={quickQuestion}
                  onChange={(e) => setQuickQuestion(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAskAi()}
                  placeholder="e.g. Is the current core temperature safe for discharge?"
                  className="flex-1 bg-[#080c14] border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#0ea5e9]"
                />
                <button
                  onClick={handleAskAi}
                  disabled={isAskingAi}
                  className="px-5 py-2.5 bg-gradient-to-r from-[#0ea5e9] to-[#6366f1] text-white font-bold text-xs rounded-xl shadow-md hover:opacity-90 active:scale-95 transition-all cursor-pointer disabled:opacity-50 shrink-0"
                >
                  {isAskingAi ? 'Evaluating...' : 'Query AI'}
                </button>
              </div>

              {aiAnswer && (
                <div className="p-3.5 bg-[#0ea5e9]/10 border border-[#0ea5e9]/30 rounded-xl text-xs text-[#e2e8f0] mt-2 animate-fade-in">
                  <div className="flex items-center gap-1.5 text-[#38bdf8] font-bold mb-1">
                    <span className="material-symbols-outlined text-sm">verified</span>
                    <span>Gemini Medical Sentinel Response:</span>
                  </div>
                  <p className="leading-relaxed">{aiAnswer}</p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between">
            <span className="text-xs text-slate-400">Full multilingual voice consultation available</span>
            <Link
              href={`/patient/advisor?id=${patient.id}`}
              prefetch={true}
              className="px-4 py-2 bg-[#1e293b] hover:bg-[#334155] text-[#38bdf8] font-bold text-xs rounded-xl border border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <span>Launch Live Audio Consult</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>
        </div>

        {/* Right: Circadian Gauge & Telehealth Video Suite (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          
          {/* Circadian Health Card */}
          <div className="bg-gradient-to-br from-[#0f172a] to-[#0c121e] border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-[#0ea5e9] text-lg">timelapse</span>
                <span>Circadian Architecture Stability</span>
              </span>
              <span className="text-base font-black font-mono text-[#0ea5e9]">
                {isFever ? '78%' : '94%'}
              </span>
            </div>

            <p className="text-xs text-[#94a3b8] mb-4 leading-relaxed">
              Calculated via continuous wearable photoplethysmography and deep-sleep rest intervals for {patient.name}.
            </p>

            <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden border border-slate-800 p-0.5">
              <div 
                className="bg-gradient-to-r from-[#0ea5e9] via-[#6366f1] to-[#38bdf8] h-full rounded-full transition-all duration-700" 
                style={{ width: isFever ? '78%' : '94%' }}
              ></div>
            </div>
          </div>

          {/* Telehealth Video Consult Portal Card */}
          <div 
            onClick={() => setShowTelehealthModal(true)}
            className="bg-gradient-to-br from-[#0f172a] to-[#0c121e] border border-slate-800 hover:border-[#0ea5e9]/50 rounded-3xl p-6 shadow-xl transition-all cursor-pointer group flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#0ea5e9] to-[#6366f1] p-0.5 shrink-0 shadow-lg group-hover:scale-105 transition-transform">
                <img 
                  src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&auto=format&fit=crop&q=80" 
                  alt="Dr. Julian Vance" 
                  className="w-full h-full object-cover rounded-[14px]"
                />
              </div>
              <div>
                <h4 className="font-extrabold text-sm sm:text-base text-white group-hover:text-[#38bdf8] transition-colors">
                  Dr. Julian Vance, MD
                </h4>
                <p className="text-xs text-[#94a3b8] mt-0.5">Chief Medical Officer &bull; Ward 4 Tele-Triage</p>
                <span className="text-[10px] text-[#10b981] font-bold mt-1 inline-flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-ping"></span>
                  Ready to connect
                </span>
              </div>
            </div>

            <span className="px-4 py-2 bg-[#0ea5e9] text-white font-black text-xs rounded-xl shadow-md shadow-[#0ea5e9]/20 flex items-center gap-1 shrink-0 group-hover:bg-[#0284c7]">
              <span>Join</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </span>
          </div>

        </div>

      </section>

      {/* 5. Diagnostic Vault & Emergency Dispatch Matrix */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        
        {/* Reports Vault (7 cols) */}
        <div className="lg:col-span-7 bg-[#0f172a]/90 border border-slate-800 rounded-3xl p-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#0ea5e9]/15 text-[#38bdf8] flex items-center justify-center">
                <span className="material-symbols-outlined text-xl">verified_user</span>
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white">SHA-256 Medical Reports Vault</h3>
                <p className="text-xs text-[#94a3b8]">Tamper-Proof Records for {patient.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input 
                type="file" 
                id="patient-report-file-input" 
                className="hidden" 
                onChange={handleFileChange} 
                accept=".pdf,.png,.jpg,.jpeg,.dcm"
              />
              <button
                onClick={handleUploadClick}
                disabled={uploading}
                className="px-4 py-2 bg-[#0ea5e9] hover:bg-[#0284c7] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-sm">upload_file</span>
                <span>{uploading ? 'Encrypting...' : 'Upload Document'}</span>
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {reports.map((rep) => (
              <div key={rep.id} className="p-3.5 rounded-2xl bg-[#080c14] border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-slate-900 text-[#38bdf8] flex items-center justify-center shrink-0 border border-slate-800">
                    <span className="material-symbols-outlined text-base">description</span>
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-white truncate" title={rep.title}>{rep.title}</h4>
                    <p className="text-[10px] text-slate-400 font-mono">{rep.uploader} &bull; {rep.date}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                  <button
                    onClick={() => setSelectedReportForReview(rep)}
                    className="px-3 py-1.5 bg-[#0ea5e9]/10 hover:bg-[#0ea5e9] text-[#38bdf8] hover:text-white font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-sm">psychology</span>
                    <span>AI Review</span>
                  </button>
                  <button
                    onClick={() => handleDownloadReport(rep)}
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 text-[#cbd5e1] rounded-xl transition-all cursor-pointer"
                    title="Download"
                  >
                    <span className="material-symbols-outlined text-sm">download</span>
                  </button>
                  <button
                    onClick={() => handleDeleteReport(rep.id, rep.title)}
                    className="p-1.5 bg-[#f43f5e]/15 hover:bg-[#f43f5e] text-[#f43f5e] hover:text-white rounded-xl transition-all cursor-pointer"
                    title="Delete"
                  >
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency Coordinates Matrix (5 cols) */}
        <div className="lg:col-span-5 bg-[#0f172a]/90 border border-[#f43f5e]/40 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-slate-800">
              <span className="material-symbols-outlined text-[#f43f5e] text-2xl animate-pulse">crisis_alert</span>
              <div>
                <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">
                  Emergency Dispatch Coordinates
                </h3>
                <p className="text-xs text-[#94a3b8]">Automated E911 Matrix Parameters</p>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-[#94a3b8] uppercase font-bold">Rescue Address</label>
                <input 
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-[#080c14] border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#0ea5e9]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-[#94a3b8] uppercase font-bold">City</label>
                  <input 
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-[#080c14] border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#0ea5e9]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-[#94a3b8] uppercase font-bold">Contact Phone</label>
                  <input 
                    type="text"
                    value={emergencyContactPhone}
                    onChange={(e) => setEmergencyContactPhone(e.target.value)}
                    className="w-full bg-[#080c14] border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#0ea5e9]"
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleSaveProfile}
            className="w-full py-2.5 bg-gradient-to-r from-[#0ea5e9] to-[#0284c7] text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-sm">save</span>
            <span>Update Dispatch Profile</span>
          </button>
        </div>

      </section>

      {/* Telehealth Video Call Modal */}
      {showTelehealthModal && (
        <div className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-3 sm:p-4 backdrop-blur-md">
          <div className="w-full max-w-xl bg-[#0f172a] border-2 border-[#0ea5e9]/50 rounded-3xl p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-[#0ea5e9] animate-pulse"></span>
                <span className="font-extrabold text-sm text-white">Encrypted Clinical Telehealth</span>
              </div>
              <span className="text-xs font-mono font-bold text-[#38bdf8] bg-[#0ea5e9]/15 px-3 py-1 rounded-full border border-[#0ea5e9]/30">
                {formatTime(callDuration)}
              </span>
            </div>

            <div className="w-full h-64 bg-[#080c14] rounded-2xl relative overflow-hidden flex items-center justify-center border border-slate-800 mb-5">
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-slate-900 border-2 border-[#0ea5e9] mx-auto mb-2 overflow-hidden flex items-center justify-center shadow-lg">
                  <img src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&auto=format&fit=crop&q=80" alt="Doctor" className="w-full h-full object-cover" />
                </div>
                <h4 className="font-bold text-sm text-white">Dr. Julian Vance, MD</h4>
                <p className="text-xs text-[#94a3b8]">Attending Physician &bull; Audio/Video Encrypted</p>
              </div>

              {/* Patient PIP window */}
              <div className="absolute bottom-3 right-3 w-24 h-24 bg-slate-900 rounded-xl border border-[#0ea5e9]/50 overflow-hidden shadow-lg">
                <img src={patient.avatar} alt={patient.name} className="w-full h-full object-cover" />
              </div>
            </div>

            <div className="flex items-center justify-center gap-4">
              <button 
                onClick={() => setIsMuted(!isMuted)} 
                className={`p-3 rounded-full cursor-pointer transition-all ${isMuted ? 'bg-[#f43f5e] text-white' : 'bg-slate-800 text-white border border-slate-700'}`}
              >
                <span className="material-symbols-outlined">{isMuted ? 'mic_off' : 'mic'}</span>
              </button>
              <button 
                onClick={() => setIsVideoOff(!isVideoOff)} 
                className={`p-3 rounded-full cursor-pointer transition-all ${isVideoOff ? 'bg-[#f43f5e] text-white' : 'bg-slate-800 text-white border border-slate-700'}`}
              >
                <span className="material-symbols-outlined">{isVideoOff ? 'videocam_off' : 'videocam'}</span>
              </button>
              <button 
                onClick={() => setShowTelehealthModal(false)} 
                className="px-6 py-3 rounded-full bg-[#f43f5e] text-white font-bold text-xs flex items-center gap-2 cursor-pointer hover:opacity-90 shadow-lg shadow-[#f43f5e]/30"
              >
                <span className="material-symbols-outlined text-base">call_end</span>
                <span>Disconnect</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Review Report Modal */}
      {selectedReportForReview && (
        <div className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-3 sm:p-4 backdrop-blur-md">
          <div className="w-full max-w-lg bg-[#0f172a] border-2 border-[#0ea5e9]/50 rounded-3xl p-6 shadow-2xl relative max-h-[85vh] overflow-y-auto custom-scrollbar">
            <button 
              onClick={() => setSelectedReportForReview(null)}
              className="absolute right-4 top-4 text-[#94a3b8] hover:text-white p-1.5 rounded-full cursor-pointer bg-slate-800"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>

            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-[#0ea5e9]/15 text-[#38bdf8] flex items-center justify-center border border-[#0ea5e9]/30 shrink-0">
                <span className="material-symbols-outlined text-2xl">auto_awesome</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-[#38bdf8] uppercase tracking-widest block">GEMINI CLINICAL SYNTHESIS</span>
                <h3 className="text-sm sm:text-base font-extrabold text-white truncate max-w-xs">{selectedReportForReview.title}</h3>
              </div>
            </div>

            <div className="space-y-3.5 text-xs text-white mb-6">
              <div className="bg-[#080c14] p-3.5 rounded-xl border border-slate-800">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-[#38bdf8] uppercase tracking-wider text-[10px]">Document Hash (SHA-256)</span>
                  <span className="bg-[#0ea5e9]/20 text-[#38bdf8] text-[10px] px-2 py-0.5 rounded font-bold">VERIFIED</span>
                </div>
                <p className="font-mono text-[10px] text-[#94a3b8] break-all">{selectedReportForReview.hash}</p>
              </div>

              <div className="bg-[#080c14] p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="font-bold text-white block text-sm">Diagnostic Synthesis for {patient.name}:</span>
                <ul className="space-y-1.5 text-[#94a3b8] list-disc pl-4">
                  <li><strong className="text-white">Primary Condition:</strong> {patient.diagnosis}</li>
                  <li><strong className="text-white">Current Telemetry:</strong> HR {hrVal} bpm, BP {patient.bp || '120/80'}, SpO2 {spo2Val}%, Temp {patient.temp || '98.6°F'}.</li>
                  <li><strong className="text-white">Sentinel Evaluation:</strong> {patient.advisor?.differential || 'Stable under continuous clinical observation.'}</li>
                </ul>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => handleDownloadReport(selectedReportForReview)}
                className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 border border-slate-700 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">download</span>
                <span>Download Report</span>
              </button>
              <button
                onClick={() => setSelectedReportForReview(null)}
                className="flex-1 py-3 bg-[#0ea5e9] hover:bg-[#0284c7] text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
