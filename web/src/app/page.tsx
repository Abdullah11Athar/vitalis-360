"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getAssetPath } from '@/lib/config';
import { setActivePatientId } from '@/lib/patientData';

interface DemoCase {
  id: string;
  name: string;
  badge: string;
  status: 'Critical' | 'Stable' | 'Observation';
  vitals: {
    hr: number;
    bp: string;
    spo2: number;
    temp: string;
  };
  ddx: string;
  rxAlert: string;
}

const DEMO_CASES: DemoCase[] = [
  {
    id: '9912-KA',
    name: 'Elena Rostova',
    badge: 'CCU Bed 2 • Post-CABG Day 3',
    status: 'Stable',
    vitals: { hr: 72, bp: '118/76', spo2: 98, temp: '98.4°F' },
    ddx: 'Hemodynamics normalized post-bypass graft. Normal sinus rhythm restored. S2-T6 telemetry aligned with zero ischemic displacement.',
    rxAlert: 'Metoprolol Succinate 25mg & Aspirin 81mg cleared via NIH RxNav. Zero adverse interactions detected.'
  },
  {
    id: '8829-XL',
    name: 'Zeeshan Ali',
    badge: 'CCU Bed 1 • Acute Hypertensive',
    status: 'Critical',
    vitals: { hr: 135, bp: '175/110', spo2: 95, temp: '99.1°F' },
    ddx: 'Severe sinus tachycardia with accelerated MAP 131 mmHg. Acute afterload stress. Recommend immediate IV Labetalol 20mg STAT.',
    rxAlert: 'NIH RxNav CONTRAINDICATION: Active Sildenafil therapy detected. Concomitant Nitroglycerin strictly restricted.'
  },
  {
    id: '5512-UF',
    name: 'Umar Farooq',
    badge: 'Observation Bed 4 • Febrile Syndrome',
    status: 'Observation',
    vitals: { hr: 104, bp: '112/70', spo2: 96, temp: '102.4°F' },
    ddx: 'Acute febrile bronchitis with elevated inflammatory markers (CRP 48 mg/L). Recommend STAT PA Chest X-Ray and antipyretic protocol.',
    rxAlert: 'Oral Azithromycin + Acetaminophen dosage validated against pediatric renal clearance nomogram.'
  },
  {
    id: '3389-SK',
    name: 'Sadia Khan',
    badge: 'Surgical Ward Bed 6 • Right Lower Quadrant Pain',
    status: 'Critical',
    vitals: { hr: 96, bp: '124/82', spo2: 99, temp: '100.8°F' },
    ddx: 'Clinical suspicion for Acute Appendicitis with McBurney sign tenderness. Leukocytosis (WBC 16.8k). NPO protocol activated.',
    rxAlert: 'IV Cefazolin 2g prophylactic surgical clearance approved. Zero penicillin allergy flags.'
  }
];

export default function LandingPage() {
  const [selectedCaseIndex, setSelectedCaseIndex] = useState<number>(0);
  const [livePulse, setLivePulse] = useState<number>(72);
  const currentCase = DEMO_CASES[selectedCaseIndex];

  // Dynamic subtle heartbeat simulation based on active patient case
  useEffect(() => {
    const targetHr = currentCase.vitals.hr;
    setLivePulse(targetHr);
    const interval = setInterval(() => {
      setLivePulse(prev => {
        const jitter = Math.floor(Math.random() * 3) - 1;
        return Math.max(targetHr - 2, Math.min(targetHr + 2, prev + jitter));
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [currentCase]);

  return (
    <div className="min-h-screen w-full bg-[#0a0d0e] text-[#e0e3e5] relative selection:bg-[#4edea3] selection:text-[#003824] overflow-x-hidden">
      {/* Background Ambient Glows (Fixed dimensions, no jerk, zero layout shifts) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 left-1/4 w-[600px] h-[600px] bg-[#4edea3]/8 rounded-full blur-[140px] pointer-events-none animate-pulse-soft"></div>
        <div className="absolute top-1/2 -right-40 w-[500px] h-[500px] bg-[#adc6ff]/6 rounded-full blur-[140px] pointer-events-none"></div>
        <div className="absolute -bottom-40 left-1/3 w-[600px] h-[600px] bg-[#4edea3]/5 rounded-full blur-[140px] pointer-events-none"></div>
        {/* Subtle Cyber Grid lines */}
        <div 
          className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #4edea3 1px, transparent 0)`,
            backgroundSize: '32px 32px'
          }}
        ></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Top Header Bar */}
        <header className="w-full border-b border-[#3c4a42]/30 bg-[#101415]/80 backdrop-blur-md sticky top-0 z-50 px-4 md:px-8 py-3.5 transition-colors">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-[#4edea3]/10 border border-[#4edea3]/30 flex items-center justify-center p-1.5 shadow-sm shadow-[#4edea3]/20 group-hover:scale-105 transition-transform">
                <img 
                  src={getAssetPath('/logo.png')} 
                  alt="VITALIS-360" 
                  className="w-full h-full object-contain drop-shadow-[0_0_8px_rgba(78,222,163,0.4)]" 
                />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-lg md:text-xl tracking-tight text-[#e0e3e5]">VITALIS</span>
                  <span className="text-[#4edea3] font-black text-lg md:text-xl tracking-tight">360</span>
                  <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-[#4edea3]/15 text-[#4edea3] border border-[#4edea3]/30 hidden sm:inline-block">v4.0 AI</span>
                </div>
                <span className="text-[10px] text-[#bbcabf]/70 font-mono hidden md:block">AUTONOMOUS EMR CLINICAL SENTINEL</span>
              </div>
            </Link>

            {/* Live Sentinel Heartbeat Pill */}
            <div className="hidden lg:flex items-center gap-3 px-3.5 py-1.5 rounded-full bg-[#191c1e] border border-[#3c4a42]/60 text-xs shadow-inner">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4edea3] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#4edea3]"></span>
              </span>
              <span className="font-mono text-[11px] text-[#bbcabf] font-semibold">
                SENTINEL TELEMETRY ACTIVE
              </span>
              <span className="text-[#3c4a42]">|</span>
              <span className="font-mono text-[11px] text-[#4edea3] font-bold">
                0.38s LATENCY
              </span>
            </div>

            {/* Navigation CTAs */}
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                href="/doctor/rounds"
                prefetch={true}
                className="px-3.5 py-2 rounded-lg bg-[#191c1e] hover:bg-[#272a2c] text-[#e0e3e5] border border-[#3c4a42]/50 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm text-[#4edea3]">stethoscope</span>
                <span className="hidden sm:inline">Doctor Rounds</span>
              </Link>
              <Link
                href="/patient"
                prefetch={true}
                className="px-3.5 py-2 rounded-lg bg-[#191c1e] hover:bg-[#272a2c] text-[#e0e3e5] border border-[#3c4a42]/50 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm text-[#adc6ff]">person</span>
                <span className="hidden sm:inline">Patient Portal</span>
              </Link>
              <Link
                href="/login"
                prefetch={true}
                className="px-4 py-2 rounded-lg bg-[#4edea3] text-[#003824] hover:bg-[#4edea3]/90 text-xs font-extrabold shadow-md shadow-[#4edea3]/20 transition-all flex items-center gap-1 cursor-pointer"
              >
                <span>Login</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content Body */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-8 md:py-12 flex flex-col gap-12 md:gap-16">
          
          {/* Hero Section */}
          <section className="flex flex-col items-center text-center max-w-4xl mx-auto pt-2 sm:pt-4">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#4edea3]/10 border border-[#4edea3]/30 text-[#4edea3] text-xs font-bold uppercase tracking-wider mb-5 shadow-sm shadow-[#4edea3]/10 animate-fade-in">
              <span className="material-symbols-outlined text-sm animate-spin" style={{ animationDuration: '6s' }}>verified</span>
              <span>Next-Gen Autonomous Clinical EMR &bull; Powered by Gemini AI</span>
            </div>

            {/* Hero Title */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-[#e0e3e5] tracking-tight leading-[1.1] mb-5">
              Autonomous Medical Telemetry <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-[#4edea3] via-[#71a1ff] to-[#adc6ff] bg-clip-text text-transparent">
                Engineered for Zero Latency.
              </span>
            </h1>

            {/* Hero Subtitle */}
            <p className="text-sm sm:text-base md:text-lg text-[#bbcabf] font-normal max-w-2xl leading-relaxed mb-8">
              Continuous multi-modal bio-telemetry ingestion, zero-shot Glass.ai differential diagnostics, NIH RxNav contraindication firewall, and SHA-256 cryptographic clinical vaulting.
            </p>

            {/* Hero Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 w-full max-w-md">
              <Link
                href="/doctor/rounds"
                prefetch={true}
                className="flex-1 min-w-[160px] py-3.5 px-6 rounded-xl bg-[#4edea3] text-[#003824] font-black text-sm shadow-lg shadow-[#4edea3]/25 hover:shadow-xl hover:shadow-[#4edea3]/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">emergency_recording</span>
                <span>Enter Doctor Rounds</span>
              </Link>
              <Link
                href="/patient/detail"
                prefetch={true}
                onClick={() => setActivePatientId(currentCase.id)}
                className="flex-1 min-w-[160px] py-3.5 px-6 rounded-xl bg-[#191c1e] hover:bg-[#272a2c] text-[#e0e3e5] border border-[#3c4a42] font-bold text-sm shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-base text-[#adc6ff]">folder_shared</span>
                <span>Live Patient Vault</span>
              </Link>
              <Link
                href="/emergency"
                prefetch={true}
                className="w-full sm:w-auto py-3 px-5 rounded-xl bg-[#93000a]/20 hover:bg-[#93000a]/40 text-[#ffb4ab] border border-[#ffb4ab]/30 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm text-[#ffb4ab] animate-pulse">crisis_alert</span>
                <span>Emergency SOS Triage Matrix</span>
              </Link>
            </div>
          </section>

          {/* Interactive Clinical Command Telemetry HUD Simulator (Hero Visual) */}
          <section className="w-full bg-[#14181a] border border-[#3c4a42]/60 rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden backdrop-blur-xl">
            {/* HUD Header */}
            <div className="px-5 py-4 bg-[#191c1e] border-b border-[#3c4a42]/50 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-[#4edea3] animate-pulse"></div>
                <div>
                  <h3 className="font-extrabold text-sm md:text-base text-[#e0e3e5] tracking-wide flex items-center gap-2">
                    <span>LIVE INPATIENT TELEMETRY HUD</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#4edea3]/10 text-[#4edea3] border border-[#4edea3]/30">REAL-TIME INFERENCE</span>
                  </h3>
                  <p className="text-xs text-[#bbcabf]/70 font-mono">Continuous 12-lead EKG & Sentinel Neural Diagnostic Feed</p>
                </div>
              </div>

              {/* Live Status Indicators */}
              <div className="flex items-center gap-4 text-xs font-mono">
                <div className="flex items-center gap-1.5">
                  <span className="text-[#bbcabf]">STREAM:</span>
                  <span className="text-[#4edea3] font-bold">STABLE 1000Hz</span>
                </div>
                <div className="hidden sm:flex items-center gap-1.5">
                  <span className="text-[#bbcabf]">ICD-10 MAPPING:</span>
                  <span className="text-[#adc6ff] font-bold">AUTONOMOUS</span>
                </div>
              </div>
            </div>

            {/* Interactive Patient Switcher Strip */}
            <div className="px-4 py-3 bg-[#101415] border-b border-[#3c4a42]/40 flex items-center gap-2 overflow-x-auto custom-scrollbar">
              <span className="text-[10px] uppercase font-mono text-[#bbcabf]/60 font-bold px-2 shrink-0">SELECT WARD CASE:</span>
              {DEMO_CASES.map((c, idx) => {
                const isActive = idx === selectedCaseIndex;
                return (
                  <button
                    key={c.id}
                    onClick={() => {
                      setSelectedCaseIndex(idx);
                      setActivePatientId(c.id);
                    }}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-all flex items-center gap-2 cursor-pointer ${
                      isActive 
                        ? 'bg-[#4edea3] text-[#003824] shadow-md shadow-[#4edea3]/20 scale-100 font-extrabold'
                        : 'bg-[#191c1e] text-[#bbcabf] hover:bg-[#272a2c] hover:text-[#e0e3e5] border border-[#3c4a42]/40'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${
                      c.status === 'Critical' ? 'bg-[#ffb4ab] animate-ping' :
                      c.status === 'Stable' ? 'bg-[#4edea3]' : 'bg-[#adc6ff]'
                    }`}></span>
                    <span>{c.name}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${isActive ? 'bg-[#003824]/20 text-[#003824]' : 'bg-[#101415] text-[#bbcabf]'}`}>
                      {c.status}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* HUD Central Display Grid */}
            <div className="p-5 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Left Column: Waveform & Clinical Metrics (7 cols) */}
              <div className="lg:col-span-7 flex flex-col gap-5">
                {/* Active Patient Meta Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#3c4a42]/30 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-lg md:text-xl font-black text-[#e0e3e5]">{currentCase.name}</h4>
                      <span className="font-mono text-xs text-[#4edea3] font-bold">[{currentCase.id}]</span>
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                        currentCase.status === 'Critical' ? 'bg-[#ffb4ab]/15 text-[#ffb4ab] border border-[#ffb4ab]/30' :
                        currentCase.status === 'Stable' ? 'bg-[#4edea3]/15 text-[#4edea3] border border-[#4edea3]/30' :
                        'bg-[#adc6ff]/15 text-[#adc6ff] border border-[#adc6ff]/30'
                      }`}>
                        {currentCase.status}
                      </span>
                    </div>
                    <p className="text-xs text-[#bbcabf] font-mono mt-0.5">{currentCase.badge}</p>
                  </div>

                  <Link
                    href={`/patient/detail?id=${currentCase.id}`}
                    prefetch={true}
                    onClick={() => setActivePatientId(currentCase.id)}
                    className="px-3.5 py-1.5 rounded-lg bg-[#4edea3]/10 hover:bg-[#4edea3]/20 border border-[#4edea3]/30 text-[#4edea3] font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <span>Full Medical Vault</span>
                    <span className="material-symbols-outlined text-sm">open_in_new</span>
                  </Link>
                </div>

                {/* Simulated EKG Waveform Screen */}
                <div className="w-full h-36 bg-[#0b0f10] border border-[#3c4a42]/80 rounded-xl relative overflow-hidden flex flex-col justify-between p-3">
                  {/* Grid background inside scope */}
                  <div 
                    className="absolute inset-0 opacity-20 pointer-events-none"
                    style={{
                      backgroundImage: `linear-gradient(to right, #3c4a42 1px, transparent 1px), linear-gradient(to bottom, #3c4a42 1px, transparent 1px)`,
                      backgroundSize: '16px 16px'
                    }}
                  ></div>

                  {/* Scope Overlay Data */}
                  <div className="relative z-10 flex justify-between items-center text-[10px] font-mono text-[#bbcabf]/80">
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3] animate-pulse"></span>
                      LEAD II &bull; 25mm/s &bull; 10mm/mV
                    </span>
                    <span className="text-[#4edea3] font-bold">HR: {livePulse} BPM</span>
                  </div>

                  {/* Dynamic SVG EKG Line */}
                  <div className="relative w-full h-20 overflow-hidden flex items-center">
                    <svg className="w-full h-full" viewBox="0 0 600 80" preserveAspectRatio="none">
                      <path
                        d="M0,40 L60,40 L70,36 L75,44 L80,40 L100,40 L108,12 L116,68 L124,35 L130,45 L136,40 L155,40 L170,30 L185,40 L240,40 L250,36 L255,44 L260,40 L280,40 L288,10 L296,70 L304,35 L310,45 L316,40 L335,40 L350,30 L365,40 L420,40 L430,36 L435,44 L440,40 L460,40 L468,14 L476,66 L484,35 L490,45 L496,40 L515,40 L530,30 L545,40 L600,40"
                        fill="none"
                        stroke={currentCase.status === 'Critical' ? '#ffb4ab' : '#4edea3'}
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="animate-heartbeat"
                      />
                    </svg>
                    {/* Glowing Scan Bar */}
                    <div className="absolute top-0 bottom-0 right-0 w-24 bg-gradient-to-l from-[#0b0f10] via-transparent to-transparent pointer-events-none"></div>
                  </div>

                  {/* Bottom Scope Telemetry Labels */}
                  <div className="relative z-10 flex justify-between items-center text-[9px] font-mono text-[#bbcabf]/60">
                    <span>QRS DURATION: 88ms</span>
                    <span>QTc: 412ms</span>
                    <span className="text-[#adc6ff]">ST-SEGMENT: 0.02mV</span>
                  </div>
                </div>

                {/* Live Biomarker Vitals Quad */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 bg-[#191c1e] border border-[#3c4a42]/40 rounded-xl flex flex-col">
                    <span className="text-[10px] font-mono text-[#bbcabf] uppercase">HEART RATE</span>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className={`text-2xl font-black font-mono ${currentCase.status === 'Critical' ? 'text-[#ffb4ab]' : 'text-[#4edea3]'}`}>
                        {livePulse}
                      </span>
                      <span className="text-[10px] font-mono text-[#bbcabf]">BPM</span>
                    </div>
                  </div>

                  <div className="p-3 bg-[#191c1e] border border-[#3c4a42]/40 rounded-xl flex flex-col">
                    <span className="text-[10px] font-mono text-[#bbcabf] uppercase">BLOOD PRESSURE</span>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-xl font-black font-mono text-[#e0e3e5]">
                        {currentCase.vitals.bp}
                      </span>
                      <span className="text-[10px] font-mono text-[#bbcabf]">mmHg</span>
                    </div>
                  </div>

                  <div className="p-3 bg-[#191c1e] border border-[#3c4a42]/40 rounded-xl flex flex-col">
                    <span className="text-[10px] font-mono text-[#bbcabf] uppercase">O2 SATURATION</span>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-2xl font-black font-mono text-[#adc6ff]">
                        {currentCase.vitals.spo2}%
                      </span>
                      <span className="text-[10px] font-mono text-[#bbcabf]">SpO2</span>
                    </div>
                  </div>

                  <div className="p-3 bg-[#191c1e] border border-[#3c4a42]/40 rounded-xl flex flex-col">
                    <span className="text-[10px] font-mono text-[#bbcabf] uppercase">CORE TEMP</span>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-xl font-black font-mono text-[#e0e3e5]">
                        {currentCase.vitals.temp}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Glass.ai Clinical Reasoning & RxNav Guard (5 cols) */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                {/* Glass.ai Differential Diagnosis Card */}
                <div className="p-4 bg-[#191c1e] border border-[#3c4a42]/60 rounded-xl flex flex-col gap-2.5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-[#adc6ff]/15 text-[#adc6ff] flex items-center justify-center">
                        <span className="material-symbols-outlined text-base">psychology</span>
                      </div>
                      <span className="font-bold text-xs uppercase tracking-wider text-[#adc6ff]">Glass.ai Clinical DDx</span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#101415] text-[#bbcabf] border border-[#3c4a42]/40">
                      GEMINI PRO CLINICAL
                    </span>
                  </div>
                  <p className="text-xs text-[#e0e3e5] leading-relaxed italic bg-[#101415]/60 p-3 rounded-lg border-l-2 border-[#adc6ff]">
                    &ldquo;{currentCase.ddx}&rdquo;
                  </p>
                </div>

                {/* NIH RxNav Pharmacotherapy Firewall Card */}
                <div className="p-4 bg-[#191c1e] border border-[#3c4a42]/60 rounded-xl flex flex-col gap-2.5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-[#4edea3]/15 text-[#4edea3] flex items-center justify-center">
                        <span className="material-symbols-outlined text-base">verified_user</span>
                      </div>
                      <span className="font-bold text-xs uppercase tracking-wider text-[#4edea3]">NIH RxNav Guard</span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#101415] text-[#4edea3] border border-[#4edea3]/30 font-bold">
                      LIVE NLM API
                    </span>
                  </div>
                  <p className="text-xs text-[#e0e3e5] leading-relaxed bg-[#101415]/60 p-3 rounded-lg border-l-2 border-[#4edea3]">
                    {currentCase.rxAlert}
                  </p>
                </div>

                {/* Direct Action Jump Button */}
                <Link
                  href={`/patient/detail?id=${currentCase.id}`}
                  prefetch={true}
                  onClick={() => setActivePatientId(currentCase.id)}
                  className="w-full py-3 px-4 bg-[#4edea3] hover:bg-[#4edea3]/90 text-[#003824] font-black text-xs rounded-xl shadow-md shadow-[#4edea3]/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">assignment_turned_in</span>
                  <span>Inspect {currentCase.name}&apos;s Clinical History</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link>
              </div>
            </div>
          </section>

          {/* Metric Bar Ticker */}
          <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full">
            <div className="p-5 bg-[#14181a] border border-[#3c4a42]/40 rounded-2xl flex flex-col">
              <span className="text-3xl md:text-4xl font-black font-mono text-[#4edea3]">42</span>
              <span className="text-xs font-bold text-[#e0e3e5] mt-1">Biomarkers Ingested</span>
              <span className="text-[11px] text-[#bbcabf]/70 mt-0.5 leading-snug">Continuous EKG, SpO2, HRV, MAP, and Core Temperature</span>
            </div>

            <div className="p-5 bg-[#14181a] border border-[#3c4a42]/40 rounded-2xl flex flex-col">
              <span className="text-3xl md:text-4xl font-black font-mono text-[#adc6ff]">0.38s</span>
              <span className="text-xs font-bold text-[#e0e3e5] mt-1">AI Diagnostic Latency</span>
              <span className="text-[11px] text-[#bbcabf]/70 mt-0.5 leading-snug">Zero-shot multi-modal inference via Gemini Pro Medical</span>
            </div>

            <div className="p-5 bg-[#14181a] border border-[#3c4a42]/40 rounded-2xl flex flex-col">
              <span className="text-3xl md:text-4xl font-black font-mono text-[#e0e3e5]">100%</span>
              <span className="text-xs font-bold text-[#e0e3e5] mt-1">SHA-256 Tamper Proof</span>
              <span className="text-[11px] text-[#bbcabf]/70 mt-0.5 leading-snug">Cryptographic checksum hashes on all lab reports and EHR edits</span>
            </div>

            <div className="p-5 bg-[#14181a] border border-[#3c4a42]/40 rounded-2xl flex flex-col">
              <span className="text-3xl md:text-4xl font-black font-mono text-[#4edea3]">0</span>
              <span className="text-xs font-bold text-[#e0e3e5] mt-1">Unsupervised Orders</span>
              <span className="text-[11px] text-[#bbcabf]/70 mt-0.5 leading-snug">Rigid Human-In-The-Loop MD cryptographic gate enforced</span>
            </div>
          </section>

          {/* 6 Core Architectural AI Pillars */}
          <section className="flex flex-col gap-6">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-black text-[#e0e3e5] tracking-tight">
                Architected for Modern Clinical Safety
              </h2>
              <p className="text-xs sm:text-sm text-[#bbcabf] mt-2">
                Every subsystem is hardened to eliminate clinical hallucinations, prevent polypharmacy fatalities, and maintain zero-friction provider workflows.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Pillar 1 */}
              <div className="p-5 bg-[#14181a] border border-[#3c4a42]/50 hover:border-[#4edea3]/40 rounded-2xl transition-all group flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#4edea3]/10 text-[#4edea3] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-xl">sensors</span>
                  </div>
                  <h3 className="font-extrabold text-sm text-[#e0e3e5] mb-1.5">Autonomous Telemetry Sentinel</h3>
                  <p className="text-xs text-[#bbcabf] leading-relaxed">
                    Sub-second ingestion of raw wearable & bedside telemetry. Dynamic arrhythmia classification with immediate clinical threshold triggers.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#3c4a42]/30 flex items-center justify-between text-[11px] font-mono text-[#4edea3]">
                  <span>HEALTH CONNECT SDK</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </div>
              </div>

              {/* Pillar 2 */}
              <div className="p-5 bg-[#14181a] border border-[#3c4a42]/50 hover:border-[#adc6ff]/40 rounded-2xl transition-all group flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#adc6ff]/10 text-[#adc6ff] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-xl">psychology</span>
                  </div>
                  <h3 className="font-extrabold text-sm text-[#e0e3e5] mb-1.5">Gemini Clinical DDx Engine</h3>
                  <p className="text-xs text-[#bbcabf] leading-relaxed">
                    Structured differential diagnosis synthesis cross-referenced with ICD-10 clinical ontologies and multi-modal lab imaging analysis.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#3c4a42]/30 flex items-center justify-between text-[11px] font-mono text-[#adc6ff]">
                  <span>ICD-10 / SNOMED CT</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </div>
              </div>

              {/* Pillar 3 */}
              <div className="p-5 bg-[#14181a] border border-[#3c4a42]/50 hover:border-[#4edea3]/40 rounded-2xl transition-all group flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#4edea3]/10 text-[#4edea3] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-xl">medication</span>
                  </div>
                  <h3 className="font-extrabold text-sm text-[#e0e3e5] mb-1.5">NIH RxNav Interaction Firewall</h3>
                  <p className="text-xs text-[#bbcabf] leading-relaxed">
                    Zero-trust polypharmacy screening directly querying the U.S. National Library of Medicine API before any medication order is drafted.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#3c4a42]/30 flex items-center justify-between text-[11px] font-mono text-[#4edea3]">
                  <span>RXNORM PROTOCOL</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </div>
              </div>

              {/* Pillar 4 */}
              <div className="p-5 bg-[#14181a] border border-[#3c4a42]/50 hover:border-[#ffb4ab]/40 rounded-2xl transition-all group flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#ffb4ab]/10 text-[#ffb4ab] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-xl">emergency</span>
                  </div>
                  <h3 className="font-extrabold text-sm text-[#e0e3e5] mb-1.5">Emergency SOS Triage Matrix</h3>
                  <p className="text-xs text-[#bbcabf] leading-relaxed">
                    Automated geocoding, hospital ER bed routing, instant E911 dispatch, and WhatsApp telemetry relays for acute life-threat events.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#3c4a42]/30 flex items-center justify-between text-[11px] font-mono text-[#ffb4ab]">
                  <span>PARAMEDIC DISPATCH</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </div>
              </div>

              {/* Pillar 5 */}
              <div className="p-5 bg-[#14181a] border border-[#3c4a42]/50 hover:border-[#4edea3]/40 rounded-2xl transition-all group flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#4edea3]/10 text-[#4edea3] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-xl">lock</span>
                  </div>
                  <h3 className="font-extrabold text-sm text-[#e0e3e5] mb-1.5">SHA-256 Cryptographic Vault</h3>
                  <p className="text-xs text-[#bbcabf] leading-relaxed">
                    Every uploaded PDF lab result, clinical note, and provider signature receives an immutable cryptographic hash for forensic audit compliance.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#3c4a42]/30 flex items-center justify-between text-[11px] font-mono text-[#4edea3]">
                  <span>ZERO-KNOWLEDGE AUDIT</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </div>
              </div>

              {/* Pillar 6 */}
              <div className="p-5 bg-[#14181a] border border-[#3c4a42]/50 hover:border-[#adc6ff]/40 rounded-2xl transition-all group flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#adc6ff]/10 text-[#adc6ff] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-xl">clinical_notes</span>
                  </div>
                  <h3 className="font-extrabold text-sm text-[#e0e3e5] mb-1.5">Human-in-the-Loop Governance Gate</h3>
                  <p className="text-xs text-[#bbcabf] leading-relaxed">
                    AI produces suggestions; licensed physicians endorse. Two-factor MD verification guarantees zero autonomous pharmaceutical hallucinations.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#3c4a42]/30 flex items-center justify-between text-[11px] font-mono text-[#adc6ff]">
                  <span>MD VERIFIED PROTOCOL</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </div>
              </div>
            </div>
          </section>

          {/* Quick Portal Jump Bento */}
          <section className="w-full bg-gradient-to-r from-[#14181a] via-[#191c1e] to-[#14181a] border border-[#3c4a42]/60 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="max-w-xl">
              <span className="text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded bg-[#4edea3]/15 text-[#4edea3] border border-[#4edea3]/30">
                MULTI-ROLE ACCESS MATRIX
              </span>
              <h3 className="text-xl md:text-2xl font-black text-[#e0e3e5] mt-2">
                Experience the Complete Clinical Ecosystem
              </h3>
              <p className="text-xs md:text-sm text-[#bbcabf] mt-1 leading-relaxed">
                Seamlessly transition between Physician Ward Rounds, the Patient Health Vault, AI Medical Consultations, or Emergency Dispatch.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <Link
                href="/doctor/rounds"
                prefetch={true}
                className="px-5 py-3 rounded-xl bg-[#4edea3] hover:bg-[#4edea3]/90 text-[#003824] font-black text-xs shadow-md shadow-[#4edea3]/20 flex items-center gap-2 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">local_hospital</span>
                <span>Virtual Rounds</span>
              </Link>
              <Link
                href="/patient"
                prefetch={true}
                className="px-5 py-3 rounded-xl bg-[#191c1e] hover:bg-[#272a2c] text-[#e0e3e5] border border-[#3c4a42] font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-base text-[#adc6ff]">shield_person</span>
                <span>Patient Vault</span>
              </Link>
              <Link
                href="/doctor/ai-doctor"
                prefetch={true}
                className="px-5 py-3 rounded-xl bg-[#191c1e] hover:bg-[#272a2c] text-[#e0e3e5] border border-[#3c4a42] font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-base text-[#4edea3]">mic</span>
                <span>AI Voice Consult</span>
              </Link>
            </div>
          </section>

        </main>

        {/* High-Tech Clinical Footer */}
        <footer className="w-full border-t border-[#3c4a42]/30 bg-[#0b0f10] px-4 md:px-8 py-6 mt-12 text-center text-xs text-[#bbcabf]/60 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#4edea3]"></span>
            <span className="font-bold text-[#e0e3e5]">VITALIS-360 Clinical Guardian</span>
            <span>&bull; Cryptographically Secured</span>
          </div>
          <div className="font-mono text-[11px] text-[#bbcabf]/50">
            KAGGLE AI AGENTS CAPSTONE &bull; HIPAA ARCHITECTURAL CONFORMANCE
          </div>
        </footer>
      </div>
    </div>
  );
}
