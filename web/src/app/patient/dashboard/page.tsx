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
    return '9912-KA';
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
    window.dispatchEvent(new CustomEvent('show-toast', { detail: `🩺 Switched to ${target.name} (${target.id}) • ${target.ward}` }));
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
    <div className="min-h-screen w-full bg-[#0a0d0e] text-[#e0e3e5] p-3 sm:p-6 lg:p-8 max-w-[1600px] mx-auto pb-36 md:pb-16 selection:bg-[#4edea3] selection:text-[#003824]">
      
      {/* 1. Custom Active Clinical Census Switcher Strip */}
      <section className="mb-6 bg-[#14181a]/90 backdrop-blur-xl p-3.5 sm:p-4 rounded-2xl border border-[#3c4a42]/50 shadow-xl">
        <div className="flex items-center justify-between gap-3 mb-2.5 px-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#4edea3] animate-pulse"></span>
            <span className="text-[11px] font-black uppercase tracking-wider text-[#bbcabf]">
              Active Clinical Census Switcher
            </span>
          </div>
          <span className="text-[10px] text-[#4edea3] font-mono font-bold">
            Select Any Patient to Switch Profile Instantly
          </span>
        </div>

        <div className="flex items-center gap-2.5 overflow-x-auto pb-1.5 custom-scrollbar">
          {patientsList.map((p) => {
            const isSelected = p.id === patient.id;
            const pTemp = parseFloat(p.temp || '98.6');
            const pFever = pTemp >= 100.4;
            const pHr = p.hr || p.heartRate || 72;
            const pTachy = pHr > 100;

            return (
              <button
                key={p.id}
                onClick={() => switchPatient(p.id)}
                className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer border ${
                  isSelected
                    ? 'bg-[#4edea3] text-[#003824] border-[#4edea3] shadow-lg shadow-[#4edea3]/25 scale-[1.02] font-black'
                    : 'bg-[#191c1e] text-[#bbcabf] hover:text-[#e0e3e5] hover:bg-[#272a2c] border-[#3c4a42]/40'
                }`}
              >
                <div className="w-6 h-6 rounded-full overflow-hidden shrink-0 border border-current">
                  <img src={p.avatar} alt={p.name} className="w-full h-full object-cover" />
                </div>
                <span>{p.name}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                  isSelected ? 'bg-[#003824]/20 text-[#003824]' : 'bg-[#101415] text-[#bbcabf]'
                }`}>
                  {p.id}
                </span>
                {(pFever || pTachy) && (
                  <span className="w-2 h-2 rounded-full bg-[#ffb4ab] animate-ping"></span>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* 2. Hero Clinical Cockpit Header */}
      <section className="mb-8 bg-[#14181a] border border-[#3c4a42]/60 rounded-3xl p-5 sm:p-7 shadow-2xl relative overflow-hidden backdrop-blur-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#4edea3]/6 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4 sm:gap-5 min-w-0">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#191c1e] border-2 border-[#4edea3]/40 overflow-hidden flex items-center justify-center shadow-xl shrink-0">
              <img 
                src={patient.avatar} 
                alt={patient.name} 
                className="w-full h-full object-cover" 
              />
            </div>
            
            <div className="min-w-0">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded bg-[#4edea3]/15 text-[#4edea3] border border-[#4edea3]/30">
                  ACTIVE PATIENT RECORD
                </span>
                <span className="text-xs font-mono font-bold text-[#bbcabf] bg-[#191c1e] px-2.5 py-0.5 rounded-lg border border-[#3c4a42]/40">
                  {patient.id}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#e0e3e5] tracking-tight mt-1 truncate">
                {patient.name}
              </h1>

              <p className="text-xs sm:text-sm text-[#bbcabf] font-medium mt-1">
                {patient.age} yrs • {patient.gender} • <strong className="text-[#4edea3] font-bold">{patient.ward}</strong> • Diagnosis: <span className="text-[#adc6ff]">{patient.diagnosis}</span>
              </p>

              <div className="flex flex-wrap items-center gap-2 mt-3">
                <span className="flex items-center gap-1.5 px-3 py-1 bg-[#4edea3]/10 border border-[#4edea3]/20 text-[#4edea3] font-bold text-[10px] uppercase tracking-wider rounded-full">
                  <span className="w-2 h-2 rounded-full bg-[#4edea3] animate-pulse"></span>
                  Google Fit API: Active
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1 bg-[#adc6ff]/10 border border-[#adc6ff]/20 text-[#adc6ff] font-bold text-[10px] uppercase tracking-wider rounded-full">
                  <span className="w-2 h-2 rounded-full bg-[#adc6ff]"></span>
                  Apple HealthKit: Connected
                </span>
              </div>
            </div>
          </div>

          {/* Quick Portal Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 pt-2 lg:pt-0">
            <Link
              href={`/patient/detail?id=${patient.id}`}
              prefetch={true}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-[#191c1e] hover:bg-[#272a2c] text-[#e0e3e5] border border-[#3c4a42] transition-all flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <span className="material-symbols-outlined text-base text-[#4edea3]">folder_shared</span>
              <span>Full Medical Vault</span>
            </Link>

            <Link
              href={`/patient/lifestyle?id=${patient.id}`}
              prefetch={true}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-[#191c1e] hover:bg-[#272a2c] text-[#e0e3e5] border border-[#3c4a42] transition-all flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <span className="material-symbols-outlined text-base text-[#adc6ff]">health_metrics</span>
              <span>Lifestyle Audit</span>
            </Link>

            <Link
              href={`/patient/sleep?id=${patient.id}`}
              prefetch={true}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-[#191c1e] hover:bg-[#272a2c] text-[#e0e3e5] border border-[#3c4a42] transition-all flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <span className="material-symbols-outlined text-base text-[#4edea3]">bedtime</span>
              <span>Sleep Fidelity</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Custom Biometric Telemetry Cockpit (6 Real-time Cards) */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        
        {/* Card 1: Heart Rate */}
        <div className={`p-5 rounded-2xl bg-[#14181a] border transition-all shadow-md relative overflow-hidden flex flex-col justify-between ${
          isTachy ? 'border-[#ffb4ab]/60 bg-[#ffb4ab]/5' : 'border-[#3c4a42]/50 hover:border-[#4edea3]/40'
        }`}>
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] font-mono uppercase font-bold text-[#bbcabf] tracking-wider block">HEART RATE TELEMETRY</span>
              <span className="text-xs text-[#bbcabf]/70">Lead II Continuous ECG</span>
            </div>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isTachy ? 'bg-[#ffb4ab]/20 text-[#ffb4ab]' : 'bg-[#4edea3]/10 text-[#4edea3]'}`}>
              <span className="material-symbols-outlined text-lg animate-pulse">favorite</span>
            </div>
          </div>

          <div className="my-3 flex items-baseline justify-between gap-2">
            <div className="flex items-baseline gap-1.5">
              <span className={`text-4xl font-black font-mono tracking-tight ${isTachy ? 'text-[#ffb4ab]' : 'text-[#e0e3e5]'}`}>
                {hrVal}
              </span>
              <span className="text-xs font-mono font-bold text-[#bbcabf]">BPM</span>
            </div>

            {/* Micro EKG SVG Wave */}
            <div className="w-28 h-8 overflow-hidden opacity-80">
              <svg className={`w-full h-full ${isTachy ? 'text-[#ffb4ab]' : 'text-[#4edea3]'}`} viewBox="0 0 100 24" preserveAspectRatio="none">
                <path 
                  d="M0,12 L20,12 L24,12 L27,3 L31,21 L35,12 L40,12 L60,12 L64,3 L68,21 L72,12 L100,12" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2.2" 
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          <div className="pt-2 border-t border-[#3c4a42]/30 flex items-center justify-between text-[11px] font-mono">
            <span className={`font-bold flex items-center gap-1.5 ${isTachy ? 'text-[#ffb4ab]' : 'text-[#4edea3]'}`}>
              <span className={`w-2 h-2 rounded-full ${isTachy ? 'bg-[#ffb4ab] animate-ping' : 'bg-[#4edea3]'}`}></span>
              {isTachy ? 'TACHYCARDIA ALERT' : 'NORMAL SINUS RHYTHM'}
            </span>
            <span className="text-[#bbcabf]/60">MAP: {Math.round((2 * 80 + bpSys) / 3)} mmHg</span>
          </div>
        </div>

        {/* Card 2: Blood Pressure */}
        <div className={`p-5 rounded-2xl bg-[#14181a] border transition-all shadow-md flex flex-col justify-between ${
          isHypertensive ? 'border-[#ffb4ab]/60 bg-[#ffb4ab]/5' : 'border-[#3c4a42]/50 hover:border-[#adc6ff]/40'
        }`}>
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] font-mono uppercase font-bold text-[#bbcabf] tracking-wider block">BLOOD PRESSURE</span>
              <span className="text-xs text-[#bbcabf]/70">Arterial Tonometry</span>
            </div>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isHypertensive ? 'bg-[#ffb4ab]/20 text-[#ffb4ab]' : 'bg-[#adc6ff]/10 text-[#adc6ff]'}`}>
              <span className="material-symbols-outlined text-lg">monitor_heart</span>
            </div>
          </div>

          <div className="my-3 flex items-baseline gap-2">
            <span className="text-4xl font-black font-mono tracking-tight text-[#e0e3e5]">
              {patient.bp || '120/80'}
            </span>
            <span className="text-xs font-mono font-bold text-[#bbcabf]">mmHg</span>
          </div>

          <div className="pt-2 border-t border-[#3c4a42]/30 flex items-center justify-between text-[11px] font-mono">
            <span className={`font-bold flex items-center gap-1.5 ${isHypertensive ? 'text-[#ffb4ab]' : 'text-[#4edea3]'}`}>
              <span className={`w-2 h-2 rounded-full ${isHypertensive ? 'bg-[#ffb4ab]' : 'bg-[#4edea3]'}`}></span>
              {isHypertensive ? 'STAGE 2 HYPERTENSIVE' : 'HEMODYNAMICALLY STABLE'}
            </span>
            <span className="text-[#bbcabf]/60">PULSE PRESSURE: 42</span>
          </div>
        </div>

        {/* Card 3: Oxygen SpO2 */}
        <div className={`p-5 rounded-2xl bg-[#14181a] border transition-all shadow-md flex flex-col justify-between ${
          isHypoxia ? 'border-[#ffb4ab]/60 bg-[#ffb4ab]/5' : 'border-[#3c4a42]/50 hover:border-[#4edea3]/40'
        }`}>
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] font-mono uppercase font-bold text-[#bbcabf] tracking-wider block">OXYGEN SATURATION</span>
              <span className="text-xs text-[#bbcabf]/70">Pulse Oximetry Optical</span>
            </div>
            <div className="w-8 h-8 rounded-xl bg-[#4edea3]/10 text-[#4edea3] flex items-center justify-center">
              <span className="material-symbols-outlined text-lg">air</span>
            </div>
          </div>

          <div className="my-3 flex items-baseline gap-2">
            <span className={`text-4xl font-black font-mono tracking-tight ${isHypoxia ? 'text-[#ffb4ab]' : 'text-[#4edea3]'}`}>
              {spo2Val}
            </span>
            <span className="text-xs font-mono font-bold text-[#bbcabf]">% SpO2</span>
          </div>

          <div className="pt-2 border-t border-[#3c4a42]/30 flex items-center justify-between text-[11px] font-mono">
            <span className="text-[#4edea3] font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#4edea3]"></span>
              ADEQUATE PERFUSION
            </span>
            <span className="text-[#bbcabf]/60">TARGET &gt; 95%</span>
          </div>
        </div>

        {/* Card 4: Core Temperature */}
        <div className={`p-5 rounded-2xl bg-[#14181a] border transition-all shadow-md flex flex-col justify-between ${
          isFever ? 'border-[#ffb4ab]/60 bg-[#ffb4ab]/5' : 'border-[#3c4a42]/50 hover:border-[#adc6ff]/40'
        }`}>
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] font-mono uppercase font-bold text-[#bbcabf] tracking-wider block">CORE TEMPERATURE</span>
              <span className="text-xs text-[#bbcabf]/70">Continuous Tympanic</span>
            </div>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isFever ? 'bg-[#ffb4ab]/20 text-[#ffb4ab]' : 'bg-[#adc6ff]/10 text-[#adc6ff]'}`}>
              <span className={`material-symbols-outlined text-lg ${isFever ? 'animate-bounce' : ''}`}>thermostat</span>
            </div>
          </div>

          <div className="my-3 flex items-baseline gap-2">
            <span className={`text-4xl font-black font-mono tracking-tight ${isFever ? 'text-[#ffb4ab] font-black' : 'text-[#e0e3e5]'}`}>
              {patient.temp || '98.6°F'}
            </span>
          </div>

          <div className="pt-2 border-t border-[#3c4a42]/30 flex items-center justify-between text-[11px] font-mono">
            <span className={`font-bold flex items-center gap-1.5 ${isFever ? 'text-[#ffb4ab]' : 'text-[#4edea3]'}`}>
              <span className={`w-2 h-2 rounded-full ${isFever ? 'bg-[#ffb4ab] animate-ping' : 'bg-[#4edea3]'}`}></span>
              {isFever ? 'HIGH FEBRILE PYREXIA' : 'NORMOTHERMIA'}
            </span>
            <span className="text-[#bbcabf]/60">BASELINE: 98.6°F</span>
          </div>
        </div>

        {/* Card 5: Respiratory Rate */}
        <div className="p-5 rounded-2xl bg-[#14181a] border border-[#3c4a42]/50 hover:border-[#4edea3]/40 transition-all shadow-md flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] font-mono uppercase font-bold text-[#bbcabf] tracking-wider block">RESPIRATION RATE</span>
              <span className="text-xs text-[#bbcabf]/70">Acoustic Bio-Sensor</span>
            </div>
            <div className="w-8 h-8 rounded-xl bg-[#4edea3]/10 text-[#4edea3] flex items-center justify-center">
              <span className="material-symbols-outlined text-lg">pulmonology</span>
            </div>
          </div>

          <div className="my-3 flex items-baseline gap-2">
            <span className="text-4xl font-black font-mono tracking-tight text-[#e0e3e5]">
              {isFever ? 22 : 16}
            </span>
            <span className="text-xs font-mono font-bold text-[#bbcabf]">breaths / min</span>
          </div>

          <div className="pt-2 border-t border-[#3c4a42]/30 flex items-center justify-between text-[11px] font-mono">
            <span className="text-[#4edea3] font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#4edea3]"></span>
              {isFever ? 'TACHYPNEA MODERATE' : 'EUPNEA NORMAL'}
            </span>
            <span className="text-[#bbcabf]/60">VENTILATION: OK</span>
          </div>
        </div>

        {/* Card 6: Blood Glucose */}
        <div className="p-5 rounded-2xl bg-[#14181a] border border-[#3c4a42]/50 hover:border-[#adc6ff]/40 transition-all shadow-md flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] font-mono uppercase font-bold text-[#bbcabf] tracking-wider block">BLOOD GLUCOSE</span>
              <span className="text-xs text-[#bbcabf]/70">Continuous CGM Stream</span>
            </div>
            <div className="w-8 h-8 rounded-xl bg-[#adc6ff]/10 text-[#adc6ff] flex items-center justify-center">
              <span className="material-symbols-outlined text-lg">bloodtype</span>
            </div>
          </div>

          <div className="my-3 flex items-baseline gap-2">
            <span className="text-4xl font-black font-mono tracking-tight text-[#e0e3e5]">
              {patient.diagnosis?.toLowerCase().includes('diabet') ? 168 : 104}
            </span>
            <span className="text-xs font-mono font-bold text-[#bbcabf]">mg/dL</span>
          </div>

          <div className="pt-2 border-t border-[#3c4a42]/30 flex items-center justify-between text-[11px] font-mono">
            <span className="text-[#4edea3] font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#4edea3]"></span>
              {patient.diagnosis?.toLowerCase().includes('diabet') ? 'POST-PRANDIAL' : 'EUGLYCEMIC'}
            </span>
            <span className="text-[#bbcabf]/60">HbA1c: 6.1%</span>
          </div>
        </div>

      </section>

      {/* 4. AI Sentinel Intelligence & Clinical Guidance Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        
        {/* Left: Gemini Clinical Reasoning Feed (7 cols) */}
        <div className="lg:col-span-7 bg-[#14181a] border border-[#3c4a42]/60 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#3c4a42]/40 pb-3 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#adc6ff]/15 text-[#adc6ff] flex items-center justify-center">
                  <span className="material-symbols-outlined text-xl">psychology</span>
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-[#e0e3e5] uppercase tracking-wide">
                    Gemini AI Clinical Sentinel &bull; {patient.name}
                  </h3>
                  <span className="text-[10px] text-[#bbcabf]/70 font-mono">Glass.ai Differential Protocol &bull; Zero Hallucination Mode</span>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#4edea3]/10 text-[#4edea3] border border-[#4edea3]/30 font-bold">
                0.38s LATENCY
              </span>
            </div>

            <div className="bg-[#101415] p-4 rounded-2xl border border-[#3c4a42]/40 mb-4">
              <span className="text-[10px] font-bold text-[#adc6ff] uppercase tracking-wider block mb-1">
                Active Differential Diagnostic Assessment:
              </span>
              <p className="text-xs sm:text-sm text-[#e0e3e5] leading-relaxed italic">
                &ldquo;{patient.advisor?.differential || `Continuous multi-modal telemetry confirms stable inpatient trajectory for ${patient.name}. Primary condition '${patient.diagnosis}' managed under standard clinical guideline protocols.`}&rdquo;
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 bg-[#191c1e] rounded-xl border border-[#3c4a42]/30">
                <span className="text-[10px] font-mono text-[#bbcabf] uppercase block">ICD-10 CLINICAL CODE</span>
                <span className="text-xs font-mono font-bold text-[#4edea3] mt-0.5 block">{patient.advisor?.icd10 || 'Z00.00'}</span>
              </div>
              <div className="p-3 bg-[#191c1e] rounded-xl border border-[#3c4a42]/30">
                <span className="text-[10px] font-mono text-[#bbcabf] uppercase block">MODEL CONFIDENCE</span>
                <span className="text-xs font-mono font-bold text-[#adc6ff] mt-0.5 block">{patient.advisor?.confidence ? `${patient.advisor.confidence}%` : '96.4%'} High Fidelity</span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-[#3c4a42]/30 flex flex-wrap gap-3 items-center justify-between">
            <span className="text-xs text-[#bbcabf]">Need interactive clinical questions or voice consultation?</span>
            <Link
              href={`/patient/advisor?id=${patient.id}`}
              prefetch={true}
              className="px-4 py-2 bg-[#4edea3] text-[#003824] font-black text-xs rounded-xl shadow-md shadow-[#4edea3]/20 flex items-center gap-1.5 hover:bg-[#4edea3]/90 transition-all cursor-pointer"
            >
              <span>Launch AI Medical Advisor</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>
        </div>

        {/* Right: Circadian Stability & Health Pillars (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          
          {/* Circadian Gauge Card */}
          <div className="bg-[#14181a] border border-[#3c4a42]/60 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-extrabold uppercase tracking-wide text-[#e0e3e5] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#4edea3] text-lg">timelapse</span>
                <span>Circadian Rhythm Stability</span>
              </span>
              <span className="text-sm font-black font-mono text-[#4edea3]">
                {isFever ? '78%' : '94%'}
              </span>
            </div>

            <p className="text-xs text-[#bbcabf] mb-4">
              Rest-activity synchronization calculated from 24-hour continuous photoplethysmography and nocturnal HRV variability.
            </p>

            <div className="w-full bg-[#101415] h-3 rounded-full overflow-hidden border border-[#3c4a42]/40 p-0.5">
              <div 
                className="bg-gradient-to-r from-[#4edea3] to-[#adc6ff] h-full rounded-full transition-all duration-500" 
                style={{ width: isFever ? '78%' : '94%' }}
              ></div>
            </div>
          </div>

          {/* Telehealth Quick Connect Card */}
          <div 
            onClick={() => setShowTelehealthModal(true)}
            className="bg-[#14181a] border border-[#3c4a42]/60 hover:border-[#4edea3]/50 rounded-3xl p-5 shadow-xl transition-all cursor-pointer group flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[#4edea3]/10 border border-[#4edea3]/30 text-[#4edea3] flex items-center justify-center group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-2xl">video_camera_front</span>
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-[#e0e3e5] group-hover:text-[#4edea3] transition-colors">
                  Dr. Julian Vance &bull; Attending MD
                </h4>
                <p className="text-xs text-[#bbcabf]">Chief Medical Officer &bull; Click to start secure video consult</p>
              </div>
            </div>

            <span className="px-3 py-1.5 bg-[#4edea3]/15 text-[#4edea3] border border-[#4edea3]/30 font-bold text-xs rounded-xl flex items-center gap-1 shrink-0">
              <span className="w-2 h-2 rounded-full bg-[#4edea3] animate-ping"></span>
              <span>Join</span>
            </span>
          </div>

        </div>

      </section>

      {/* 5. Patient Uploaded Medical Reports Vault (SHA-256 Verified) */}
      <section className="bg-[#14181a] border border-[#3c4a42]/60 rounded-3xl p-6 shadow-2xl mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#3c4a42]/40 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#4edea3]/10 text-[#4edea3] flex items-center justify-center border border-[#4edea3]/30">
              <span className="material-symbols-outlined text-2xl">folder_shared</span>
            </div>
            <div>
              <h2 className="text-base font-extrabold text-[#e0e3e5]">Cryptographic Diagnostic Reports Vault</h2>
              <p className="text-xs text-[#bbcabf]">SHA-256 Audited Lab Panels & Clinical Findings for {patient.name}</p>
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
              className="px-4 py-2 bg-[#4edea3] text-[#003824] font-black text-xs rounded-xl shadow-md shadow-[#4edea3]/20 hover:opacity-90 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-base">upload_file</span>
              <span>{uploading ? 'Encrypting...' : 'Upload New Report'}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reports.map((rep) => (
            <div key={rep.id} className="p-4 rounded-2xl bg-[#191c1e] border border-[#3c4a42]/40 hover:border-[#4edea3]/40 transition-all flex flex-col justify-between gap-3 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#101415] text-[#4edea3] flex items-center justify-center border border-[#3c4a42]/30 shrink-0">
                  <span className="material-symbols-outlined text-xl">description</span>
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs sm:text-sm font-bold text-[#e0e3e5] truncate" title={rep.title}>{rep.title}</h4>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <span className="text-[10px] font-mono text-[#4edea3] bg-[#4edea3]/10 px-2 py-0.5 rounded border border-[#4edea3]/20">{rep.uploader}</span>
                    <span className="text-[10px] text-[#bbcabf] font-mono">{rep.date}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-[#3c4a42]/30 flex items-center justify-end gap-2">
                <button
                  onClick={() => setSelectedReportForReview(rep)}
                  className="px-3 py-1.5 bg-[#4edea3]/10 hover:bg-[#4edea3] hover:text-[#003824] text-[#4edea3] font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">psychology</span>
                  <span>AI Review</span>
                </button>
                <button
                  onClick={() => handleDownloadReport(rep)}
                  className="px-3 py-1.5 bg-[#101415] hover:bg-[#272a2c] text-[#e0e3e5] font-bold text-xs rounded-xl transition-all border border-[#3c4a42]/40 cursor-pointer flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">download</span>
                  <span>Download</span>
                </button>
                <button
                  onClick={() => handleDeleteReport(rep.id, rep.title)}
                  className="p-1.5 bg-[#93000a]/20 hover:bg-[#93000a] text-[#ffb4ab] rounded-xl transition-all cursor-pointer flex items-center"
                  title="Delete"
                >
                  <span className="material-symbols-outlined text-sm">delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Personal Emergency Rescue Profile */}
      <section className="bg-[#14181a] border-2 border-[#ffb4ab]/30 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-[#3c4a42]/40">
          <span className="material-symbols-outlined text-[#ffb4ab] text-2xl animate-pulse">crisis_alert</span>
          <div>
            <h3 className="text-sm font-extrabold text-[#e0e3e5] uppercase tracking-wider">
              Emergency Rescue Coordinates & Dispatch Matrix
            </h3>
            <p className="text-xs text-[#bbcabf]">Autonomous Sentinel uses these values during acute telemetry threshold breaches.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="space-y-1">
            <label className="text-[10px] font-mono text-[#bbcabf] uppercase font-bold">Home Rescue Address</label>
            <input 
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full bg-[#101415] border border-[#3c4a42]/60 rounded-xl p-2.5 text-xs text-[#e0e3e5] focus:outline-none focus:border-[#4edea3]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-mono text-[#bbcabf] uppercase font-bold">City / District</label>
            <input 
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full bg-[#101415] border border-[#3c4a42]/60 rounded-xl p-2.5 text-xs text-[#e0e3e5] focus:outline-none focus:border-[#4edea3]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-mono text-[#bbcabf] uppercase font-bold">Preferred Hospital ER</label>
            <input 
              type="text"
              value={preferredHospital}
              onChange={(e) => setPreferredHospital(e.target.value)}
              className="w-full bg-[#101415] border border-[#3c4a42]/60 rounded-xl p-2.5 text-xs text-[#e0e3e5] focus:outline-none focus:border-[#4edea3]"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSaveProfile}
            className="px-5 py-2.5 bg-[#4edea3] text-[#003824] font-black text-xs rounded-xl shadow-md shadow-[#4edea3]/20 hover:opacity-90 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-sm">save</span>
            <span>Update Emergency Coordinates</span>
          </button>
        </div>
      </section>

      {/* Telehealth Video Call Modal */}
      {showTelehealthModal && (
        <div className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-3 sm:p-4 backdrop-blur-md">
          <div className="w-full max-w-xl bg-[#14181a] border-2 border-[#4edea3]/40 rounded-3xl p-5 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-[#3c4a42]/40 mb-4">
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-[#4edea3] animate-pulse"></span>
                <span className="font-extrabold text-sm text-[#e0e3e5]">Encrypted Telehealth Session</span>
              </div>
              <span className="text-xs font-mono font-bold text-[#4edea3] bg-[#4edea3]/10 px-2.5 py-1 rounded-lg">
                {formatTime(callDuration)}
              </span>
            </div>

            <div className="w-full h-64 bg-[#0b0f10] rounded-2xl relative overflow-hidden flex items-center justify-center border border-[#3c4a42]/60 mb-4">
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-[#191c1e] border-2 border-[#4edea3] mx-auto mb-2 overflow-hidden flex items-center justify-center">
                  <img src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&auto=format&fit=crop&q=80" alt="Doctor" className="w-full h-full object-cover" />
                </div>
                <h4 className="font-bold text-sm text-[#e0e3e5]">Dr. Julian Vance, MD</h4>
                <p className="text-xs text-[#bbcabf]">Chief Medical Officer &bull; Active Telemetry Audio</p>
              </div>

              {/* Patient PIP window */}
              <div className="absolute bottom-3 right-3 w-24 h-24 bg-[#191c1e] rounded-xl border border-[#4edea3]/50 overflow-hidden flex items-center justify-center">
                <img src={patient.avatar} alt={patient.name} className="w-full h-full object-cover" />
              </div>
            </div>

            <div className="flex items-center justify-center gap-4">
              <button 
                onClick={() => setIsMuted(!isMuted)} 
                className={`p-3 rounded-full cursor-pointer transition-all ${isMuted ? 'bg-[#ffb4ab] text-[#93000a]' : 'bg-[#191c1e] text-[#e0e3e5] border border-[#3c4a42]'}`}
              >
                <span className="material-symbols-outlined">{isMuted ? 'mic_off' : 'mic'}</span>
              </button>
              <button 
                onClick={() => setIsVideoOff(!isVideoOff)} 
                className={`p-3 rounded-full cursor-pointer transition-all ${isVideoOff ? 'bg-[#ffb4ab] text-[#93000a]' : 'bg-[#191c1e] text-[#e0e3e5] border border-[#3c4a42]'}`}
              >
                <span className="material-symbols-outlined">{isVideoOff ? 'videocam_off' : 'videocam'}</span>
              </button>
              <button 
                onClick={() => setShowTelehealthModal(false)} 
                className="px-5 py-3 rounded-full bg-[#93000a] text-white font-bold text-xs flex items-center gap-2 cursor-pointer hover:opacity-90"
              >
                <span className="material-symbols-outlined text-base">call_end</span>
                <span>End Consultation</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Review Report Modal */}
      {selectedReportForReview && (
        <div className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-3 sm:p-4 backdrop-blur-md">
          <div className="w-full max-w-lg bg-[#14181a] border-2 border-[#4edea3]/40 rounded-3xl p-5 sm:p-6 shadow-2xl relative max-h-[85vh] overflow-y-auto custom-scrollbar">
            <button 
              onClick={() => setSelectedReportForReview(null)}
              className="absolute right-4 top-4 text-[#bbcabf] hover:text-[#e0e3e5] p-1.5 rounded-full cursor-pointer bg-[#191c1e]"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>

            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#3c4a42]/40">
              <div className="w-10 h-10 rounded-xl bg-[#4edea3]/15 text-[#4edea3] flex items-center justify-center border border-[#4edea3]/30 shrink-0">
                <span className="material-symbols-outlined text-2xl">auto_awesome</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-[#4edea3] uppercase tracking-widest block">GEMINI CLINICAL SYNTHESIS</span>
                <h3 className="text-sm sm:text-base font-extrabold text-[#e0e3e5] truncate max-w-xs">{selectedReportForReview.title}</h3>
              </div>
            </div>

            <div className="space-y-3.5 text-xs text-[#e0e3e5] mb-6">
              <div className="bg-[#101415] p-3.5 rounded-xl border border-[#3c4a42]/40">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-[#4edea3] uppercase tracking-wider text-[10px]">Document Hash (SHA-256)</span>
                  <span className="bg-[#4edea3]/15 text-[#4edea3] text-[10px] px-2 py-0.5 rounded font-bold">VERIFIED</span>
                </div>
                <p className="font-mono text-[10px] text-[#bbcabf] break-all">{selectedReportForReview.hash}</p>
              </div>

              <div className="bg-[#101415] p-4 rounded-xl border border-[#3c4a42]/40 space-y-2">
                <span className="font-bold text-[#e0e3e5] block text-sm">Diagnostic Synthesis for {patient.name}:</span>
                <ul className="space-y-1.5 text-[#bbcabf] list-disc pl-4">
                  <li><strong className="text-[#e0e3e5]">Primary Condition:</strong> {patient.diagnosis}</li>
                  <li><strong className="text-[#e0e3e5]">Current Telemetry:</strong> HR {hrVal} bpm, BP {patient.bp || '120/80'}, SpO2 {spo2Val}%, Temp {patient.temp || '98.6°F'}.</li>
                  <li><strong className="text-[#e0e3e5]">Sentinel Evaluation:</strong> {patient.advisor?.differential || 'Stable under continuous clinical observation.'}</li>
                </ul>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => handleDownloadReport(selectedReportForReview)}
                className="flex-1 py-3 bg-[#191c1e] hover:bg-[#272a2c] text-[#e0e3e5] font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 border border-[#3c4a42]/40 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">download</span>
                <span>Download Report</span>
              </button>
              <button
                onClick={() => setSelectedReportForReview(null)}
                className="flex-1 py-3 bg-[#4edea3] text-[#003824] font-black text-xs rounded-xl shadow-md hover:opacity-90 active:scale-95 transition-all cursor-pointer"
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
