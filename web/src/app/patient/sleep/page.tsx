"use client";
import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { getPatientById, PatientRecord } from '@/lib/patientData';

function SleepAuditContent() {
  const searchParams = useSearchParams();
  const patientId = searchParams.get('id') || '8829-XL';
  
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncComplete, setSyncComplete] = useState(false);
  const [txnId, setTxnId] = useState('');
  const [role, setRole] = useState('patient');
  const [patient, setPatient] = useState<PatientRecord>(() => getPatientById(patientId));

  useEffect(() => {
    const savedUser = localStorage.getItem('vitalis_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        if (parsed.role) setRole(parsed.role.toLowerCase());
      } catch (e) {}
    }

    const currentRecord = getPatientById(patientId);
    setPatient(currentRecord);
  }, [patientId]);

  const handleCommit = () => {
    setIsSyncing(true);
    const hash = '7a' + Array.from({length:38}, () => Math.floor(Math.random()*16).toString(16)).join('');
    setTxnId(hash);
    setTimeout(() => {
      setIsSyncing(false);
      setSyncComplete(true);
      window.dispatchEvent(new CustomEvent('show-toast', { detail: `✅ Sleep Fidelity Audit for ${patient.name} cryptographically logged to EMR!` }));
    }, 1200);
  };

  const sl = patient.sleep || {
    sleepScore: 82,
    sleepHours: 7.4,
    remPercentage: 20,
    deepSleep: '1.5h',
    circadianStability: '85%',
    respiratoryRate: 16,
    sleepEfficiency: '82%'
  };

  return (
    <div className="py-6 px-4 md:px-8 max-w-5xl mx-auto w-full pb-36 md:pb-12">
      {/* Header Profile Section */}
      <section className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-outline-variant pb-6">
        <div className="flex items-center gap-4">
          <Link href={`/patient/detail?id=${patient.id}`} prefetch={true} className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container hover:bg-surface-container-high transition-colors active:scale-95 duration-150 border border-outline-variant cursor-pointer">
            <span className="material-symbols-outlined text-primary">arrow_back</span>
          </Link>
          <div className="w-14 h-14 rounded-full bg-surface-container-high border-2 border-primary/40 overflow-hidden flex items-center justify-center shadow-md shrink-0">
            <img 
              src={patient.avatar} 
              alt={patient.name} 
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <span className="font-label-sm text-xs text-primary uppercase tracking-widest font-bold">Clinical Audit</span>
            <h1 className="font-headline-lg text-2xl md:text-3xl text-on-surface font-bold">{patient.name}</h1>
            <p className="text-xs text-on-surface-variant font-medium">Fidelity metrics & circadian analysis for #{patient.id} ({patient.diagnosis})</p>
          </div>
        </div>

        <div className="flex gap-3">
          <Link href={`/patient/lifestyle?id=${patient.id}`} prefetch={true} className="px-4 py-2 bg-surface-container text-on-surface text-xs font-bold rounded-xl border border-outline-variant hover:bg-surface-container-high transition-all flex items-center gap-1.5 shadow-sm">
            <span className="material-symbols-outlined text-base text-primary">health_metrics</span>
            Lifestyle Audit
          </Link>
          <Link href={`/patient/advisor?id=${patient.id}`} prefetch={true} className="px-4 py-2 bg-primary text-on-primary text-xs font-bold rounded-xl hover:opacity-90 transition-all flex items-center gap-1.5 shadow-md">
            <span className="material-symbols-outlined text-base">psychology</span>
            AI Advisor
          </Link>
        </div>
      </section>

      {/* Fidelity Hero Bento */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="md:col-span-2 bg-surface-container-low border border-outline-variant rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden shadow-sm hover:border-primary transition-all">
          <div className="absolute -right-6 -top-6 opacity-5 pointer-events-none select-none">
            <span className="material-symbols-outlined text-[150px]">bedtime</span>
          </div>
          <div className="relative z-10">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
              <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Architecture Fidelity Score</span>
              <span className={`px-2.5 py-1 rounded-xl text-xs font-bold uppercase border whitespace-nowrap ${
                sl.sleepScore >= 75 ? 'bg-primary/20 text-primary border-primary/30' : 'bg-amber-500/20 text-amber-500 border-amber-500/30'
              }`}>
                {sl.sleepScore >= 75 ? 'Optimal Tier' : 'Impaired Sleep Tier'}
              </span>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-6xl font-black text-primary">{sl.sleepScore}</span>
              <span className="text-2xl font-bold text-on-surface-variant">/ 100</span>
            </div>
            <div className="mt-6 flex items-center gap-2 text-primary font-bold text-sm bg-primary/10 px-3.5 py-2 rounded-xl border border-primary/20 w-fit">
              <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              <span>{sl.sleepHours} hours recorded telemetry</span>
            </div>
          </div>
        </div>

        <div className="bg-surface-container-low border border-outline-variant rounded-2xl p-6 flex flex-col justify-between shadow-sm hover:border-tertiary transition-all">
          <div>
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-2">REM Efficiency</span>
            <div className="text-4xl font-black text-tertiary">{sl.remPercentage}%</div>
            <p className="text-xs text-on-surface-variant mt-1 font-medium">Target: 20-25% of total sleep</p>
          </div>
          <div className="w-full bg-surface-container h-2 rounded-full mt-4 overflow-hidden">
            <div className="bg-tertiary h-full rounded-full shadow-sm shadow-tertiary transition-all duration-500" style={{ width: `${Math.min(100, sl.remPercentage * 4)}%` }}></div>
          </div>
        </div>

        <div className="bg-surface-container-low border border-outline-variant rounded-2xl p-6 flex flex-col justify-between shadow-sm hover:border-primary transition-all">
          <div>
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-2">Deep Slow-Wave Sleep</span>
            <div className="text-4xl font-black text-primary">{sl.deepSleep}</div>
            <p className="text-xs text-on-surface-variant mt-1 font-medium">Circadian: {sl.circadianStability}</p>
          </div>
          <div className="w-full bg-surface-container h-2 rounded-full mt-4 overflow-hidden">
            <div className="bg-primary h-full rounded-full shadow-sm shadow-primary w-[76%]"></div>
          </div>
        </div>
      </div>

      {/* Phase Distribution Chart */}
      <section className="bg-surface-container-low border border-outline-variant rounded-2xl overflow-hidden mb-8 shadow-sm">
        <div className="p-4 sm:p-6 border-b border-outline-variant/50 flex flex-wrap justify-between items-center gap-2 bg-surface-container/30">
          <h3 className="font-bold text-base sm:text-lg text-on-surface flex items-center gap-2.5">
            <span className="material-symbols-outlined text-primary text-xl sm:text-2xl">analytics</span>
            Hypnogram Phase Distribution ({patient.name})
          </h3>
          <span className="text-[11px] sm:text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-xl border border-primary/20 whitespace-nowrap">
            {sl.sleepHours}h total duration
          </span>
        </div>

        <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8 items-center justify-between">
          {/* Chart Container */}
          <div className="w-full md:w-3/4 flex gap-4 h-64 items-end justify-between border-b border-l border-outline-variant/40 pb-2 pl-2">
            {[
              { rem: 15, light: 40, deep: 45 },
              { rem: 20, light: 50, deep: 30 },
              { rem: 30, light: 50, deep: 20 },
              { rem: 40, light: 45, deep: 15 },
              { rem: 10, light: 50, deep: 40 },
              { rem: 25, light: 45, deep: 30 },
              { rem: 35, light: 50, deep: 15 },
              { rem: 45, light: 45, deep: 10 },
              { rem: 50, light: 40, deep: 10 },
            ].map((col, i) => (
              <div key={i} className="flex-1 flex flex-col justify-end gap-0.5 h-full">
                <div className="bg-tertiary rounded-t-sm w-full transition-all shadow-sm" style={{ height: `${col.rem}%` }} title="REM Sleep"></div>
                <div className="bg-secondary/60 w-full transition-all" style={{ height: `${col.light}%` }} title="Light Sleep"></div>
                <div className="bg-primary w-full transition-all shadow-sm" style={{ height: `${col.deep}%` }} title="Deep Sleep"></div>
              </div>
            ))}
          </div>

          {/* Legend and Summary */}
          <div className="w-full md:w-1/4 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <span className="w-3.5 h-3.5 rounded bg-tertiary shadow-sm shadow-tertiary shrink-0"></span>
              <div className="min-w-0">
                <div className="text-xs font-bold text-on-surface">REM Phase</div>
                <div className="text-[10px] text-on-surface-variant font-medium">{sl.remPercentage}% of Total Window</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-3.5 h-3.5 rounded bg-secondary/60 shrink-0"></span>
              <div className="min-w-0">
                <div className="text-xs font-bold text-on-surface">Light Stage</div>
                <div className="text-[10px] text-on-surface-variant font-medium">55% of Total Window</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-3.5 h-3.5 rounded bg-primary shadow-sm shadow-primary shrink-0"></span>
              <div className="min-w-0">
                <div className="text-xs font-bold text-on-surface">Deep Slow-Wave</div>
                <div className="text-[10px] text-on-surface-variant font-medium">{sl.deepSleep} Duration</div>
              </div>
            </div>
            <div className="pt-2 border-t border-outline-variant/40 mt-2">
              <span className="text-[10px] uppercase font-bold text-on-surface-variant block">Nocturnal Respiration</span>
              <span className="text-sm font-black text-on-surface">{sl.respiratoryRate} breaths / min</span>
            </div>
          </div>
        </div>
      </section>

      {/* Observation Section */}
      <section className="bg-surface-container rounded-2xl p-6 md:p-8 border border-outline-variant shadow-md">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-tertiary/10 flex items-center justify-center text-tertiary border border-tertiary/20">
            <span className="material-symbols-outlined text-xl">bedtime</span>
          </div>
          <h3 className="font-bold text-base md:text-lg text-on-surface uppercase tracking-wider">AI Sleep Architecture Observation ({patient.name})</h3>
        </div>
        <p className="font-body-md text-base text-on-surface leading-relaxed mb-6 bg-background/50 p-5 rounded-xl border border-outline-variant/40">
          {patient.name} ({patient.diagnosis}) shows {sl.sleepScore >= 75 ? 'well-preserved' : 'altered'} sleep architecture with {sl.deepSleep} in restorative slow-wave state. Circadian stability index is logged at {sl.circadianStability}. Respiratory parameters during sleep remained steady at {sl.respiratoryRate} breaths per minute.
        </p>
        <button 
          onClick={handleCommit}
          className="w-full py-3 sm:py-3.5 px-4 bg-primary text-on-primary font-bold text-xs sm:text-sm rounded-xl transition-all active:scale-98 hover:opacity-90 shadow-md flex items-center justify-center gap-2 cursor-pointer"
        >
          <span className="material-symbols-outlined text-base sm:text-lg shrink-0">verified</span>
          <span className="text-center">Log & Verify Sleep Architecture Fidelity for {patient.name}</span>
        </button>
      </section>

      {/* Ledger Sync Modal */}
      {(isSyncing || syncComplete) && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-[200] p-4">
          <div className="bg-surface-container-low border border-outline-variant rounded-2xl max-w-md w-full max-h-[85vh] overflow-y-auto custom-scrollbar p-5 sm:p-6 shadow-2xl relative">
            {isSyncing ? (
              <div className="flex flex-col items-center py-6 text-center">
                <span className="material-symbols-outlined text-primary text-5xl animate-spin mb-4">sync</span>
                <h4 className="text-lg font-bold text-on-surface">Synchronizing with Clinical Ledger</h4>
                <p className="text-xs text-on-surface-variant mt-2 max-w-xs">Mining transaction block and validating SHA-256 cryptographic signatures against hospital EMR node...</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex flex-col items-center text-center pb-2 border-b border-outline-variant/30">
                  <span className="material-symbols-outlined text-primary text-5xl mb-3">verified</span>
                  <h4 className="text-lg font-bold text-on-surface">EMR Sync Successful</h4>
                  <p className="text-xs text-primary font-bold bg-primary/10 px-2.5 py-0.5 rounded-full border border-primary/20 mt-1.5">LEDGER TRANSMISSION COMMITTED</p>
                </div>
                <div className="space-y-2.5 text-xs text-on-surface">
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant font-medium">Record Type</span>
                    <span className="text-on-surface font-bold">Sleep Architecture Fidelity Audit</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant font-medium">Block Height</span>
                    <span className="text-on-surface font-mono font-bold">#492,802</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant font-medium">Patient Signature</span>
                    <span className="text-on-surface font-bold">{patient.name}</span>
                  </div>
                  <div className="flex flex-col gap-1 pt-1.5 border-t border-outline-variant/30">
                    <span className="text-on-surface-variant font-medium text-left">Ledger Transaction Hash</span>
                    <span className="text-[10px] font-mono text-primary break-all bg-background p-2 rounded-lg border border-outline-variant/30 text-left">{txnId}</span>
                  </div>
                </div>
                <button 
                  onClick={() => setSyncComplete(false)}
                  className="w-full mt-4 py-2.5 bg-primary text-on-primary font-bold text-xs rounded-xl hover:opacity-90 active:scale-95 transition-all shadow-md cursor-pointer text-center"
                >
                  Close & Acknowledge
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function SleepAudit() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-on-surface-variant font-medium">Loading clinical insights...</div>}>
      <SleepAuditContent />
    </Suspense>
  );
}
