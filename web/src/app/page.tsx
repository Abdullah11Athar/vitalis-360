"use client";
import React from 'react';
import Link from 'next/link';
import { getAssetPath } from '@/lib/config';

export default function LandingPage() {
  return (
    <div className="min-h-screen md:h-screen md:max-h-screen w-full max-w-full bg-background relative overflow-x-hidden overflow-y-auto md:overflow-hidden flex flex-col justify-between items-center py-4 md:py-6 px-4 md:px-6 selection:bg-primary selection:text-on-primary">
      {/* Background glow animations strictly constrained to prevent mobile overflow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-[280px] sm:w-[350px] md:w-[400px] h-[280px] sm:h-[350px] md:h-[400px] bg-primary/10 rounded-full blur-[80px] md:blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/3 w-[280px] sm:w-[350px] md:w-[400px] h-[280px] sm:h-[350px] md:h-[400px] bg-tertiary/10 rounded-full blur-[80px] md:blur-[100px] animate-pulse-soft"></div>
      </div>

      <div className="max-w-4xl w-full text-center relative z-10 flex flex-col items-center my-auto px-1">
        {/* Animated Badge */}
        <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] sm:text-[11px] font-bold uppercase tracking-wider sm:tracking-widest mb-4 shadow-sm shadow-primary/5 max-w-full">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse shrink-0"></span>
          <span className="truncate sm:whitespace-normal">Next-Generation Autonomous EMR Engine</span>
        </div>

        {/* Large Logo & Brand */}
        <div className="flex flex-col items-center mb-3">
          <img 
            src={getAssetPath('/logo.png')} 
            alt="VITALIS-360 Logo" 
            className="h-12 sm:h-14 md:h-16 w-auto object-contain mb-2 drop-shadow-[0_0_20px_rgba(78,222,163,0.35)]" 
          />
          <h1 className="font-headline-lg text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-on-surface tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.05)]">
            VITALIS-<span className="text-primary">360</span>
          </h1>
        </div>

        <p className="text-xs md:text-sm text-on-surface-variant font-medium max-w-xl mb-6 leading-relaxed px-2">
          Integrated clinical telemetry guardian, Gemini AI differential diagnostics, SHA-256 cryptographically audited medical records, and automatic ER emergency triage.
        </p>

        {/* Proceed to Login Button */}
        <Link 
          href="/login" 
          prefetch={true}
          className="px-7 sm:px-8 py-3.5 bg-primary text-on-primary text-xs sm:text-sm font-bold rounded-xl shadow-lg shadow-primary/20 hover:opacity-90 active:scale-98 transition-all hover:shadow-xl hover:shadow-primary/30 flex items-center gap-2 mb-6 cursor-pointer"
        >
          <span>Proceed to Portal Login</span>
          <span className="material-symbols-outlined text-base">arrow_forward</span>
        </Link>

        {/* Dynamic Bento Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 w-full text-left">
          <div className="bg-surface-container-low border border-outline-variant/40 p-4 md:p-5 rounded-2xl shadow-sm hover:border-primary/30 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-xl">auto_awesome</span>
            </div>
            <h3 className="font-bold text-sm text-on-surface mb-1">Gemini AI Advisor</h3>
            <p className="text-[11px] text-on-surface-variant leading-relaxed">
              Multilingual live-voice clinical synthesis & differential mapping (ICD-10/RxNav matching).
            </p>
          </div>

          <div className="bg-surface-container-low border border-outline-variant/40 p-4 md:p-5 rounded-2xl shadow-sm hover:border-tertiary/30 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-tertiary/10 text-tertiary flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-xl">sensors</span>
            </div>
            <h3 className="font-bold text-sm text-on-surface mb-1">Vital Telemetry</h3>
            <p className="text-[11px] text-on-surface-variant leading-relaxed">
              Continuous IoT vitals streaming and deep integration with mobile Health Connect SDK.
            </p>
          </div>

          <div className="bg-surface-container-low border border-outline-variant/40 p-4 md:p-5 rounded-2xl shadow-sm hover:border-error/30 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-error/10 text-error flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-xl">emergency</span>
            </div>
            <h3 className="font-bold text-sm text-on-surface mb-1">SOS Triage Matrix</h3>
            <p className="text-[11px] text-on-surface-variant leading-relaxed">
              Automatic hospital E911 dispatch, distance routing maps, and WhatsApp emergency integration.
            </p>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="text-[10px] text-on-surface-variant/40 uppercase tracking-widest font-bold pt-2 shrink-0 text-center px-4 max-w-full">
        VITALIS-360 Clinical guardian • Cryptographically Secured
      </footer>
    </div>
  );
}
