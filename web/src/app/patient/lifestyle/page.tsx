"use client";
import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { getPatientById, PatientRecord } from '@/lib/patientData';

function LifestyleAuditContent() {
  const searchParams = useSearchParams();
  const patientId = searchParams.get('id') || '8829-XL';
  
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncComplete, setSyncComplete] = useState(false);
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
    setTimeout(() => {
      setIsSyncing(false);
      setSyncComplete(true);
      window.dispatchEvent(new CustomEvent('show-toast', { detail: `✅ Clinical recommendation endorsed into ${patient.name}'s EMR Care Plan!` }));
    }, 1200);
  };

  const ls = patient.lifestyle || {
    wellnessScore: 80,
    summary: 'Biometric telemetry demonstrates steady adaptation to active therapy.',
    sleepHours: 7.2,
    sleepDelta: 'Normal for inpatient',
    dailySteps: 4500,
    stepPercentage: 56,
    stressScore: 40,
    stressLabel: 'Moderate'
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
            <div className="flex items-center gap-2">
              <span className="font-label-sm text-xs text-on-surface-variant uppercase tracking-wider font-bold">Lifestyle Audit</span>
            </div>
            <h1 className="font-headline-lg text-2xl md:text-3xl text-on-surface font-bold">{patient.name}</h1>
            <p className="text-xs text-on-surface-variant font-medium">Primary Condition: {patient.diagnosis}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-primary/10 px-3 py-1.5 rounded-xl border border-primary/20 shadow-sm shrink-0 whitespace-nowrap self-start md:self-auto">
          <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></div>
          <span className="font-bold text-xs text-primary uppercase tracking-wider">Continuous Monitoring Active</span>
        </div>
      </section>

      {/* Dynamic Overview Card */}
      <section className="relative overflow-hidden rounded-2xl bg-surface-container-low p-6 md:p-8 border border-outline-variant mb-8 shadow-sm">
        <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none select-none">
          <span className="material-symbols-outlined text-[140px]">health_metrics</span>
        </div>
        <div className="relative z-10">
          <p className="font-body-md text-base md:text-lg text-on-surface max-w-2xl font-medium leading-relaxed">
            {ls.summary}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            <div className="bg-surface-container p-4 rounded-xl border border-outline-variant/50">
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Overall Wellness</span>
              <p className="text-2xl font-black text-primary mt-1">{ls.wellnessScore} / 100</p>
            </div>
            <div className="bg-surface-container p-4 rounded-xl border border-outline-variant/50">
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Audit Period</span>
              <p className="text-sm font-bold text-on-surface mt-2">Last 24 Hours</p>
            </div>
            <div className="bg-surface-container p-4 rounded-xl border border-outline-variant/50">
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Status Acuity</span>
              <p className={`text-sm font-bold mt-2 ${patient.statusColor === 'error' ? 'text-error' : 'text-primary'}`}>{patient.status}</p>
            </div>
            <div className="bg-surface-container p-4 rounded-xl border border-outline-variant/50">
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Circadian Drift</span>
              <p className="text-sm font-bold text-primary mt-2">&lt; 15 mins</p>
            </div>
          </div>
        </div>
      </section>

      {/* Lifestyle Metrics Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Sleep Quality Metric */}
        <div className="bg-surface-container-low border border-outline-variant rounded-2xl p-5 md:p-6 flex flex-col justify-between space-y-5 shadow-sm hover:border-tertiary transition-all">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2.5 rounded-xl bg-tertiary/10 text-tertiary border border-tertiary/20 shrink-0">
                <span className="material-symbols-outlined text-2xl">bedtime</span>
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-base text-on-surface truncate">Sleep Quality</h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${ls.sleepHours >= 7 ? 'bg-primary' : 'bg-amber-500'}`}></span>
                  <span className="text-[11px] font-bold text-primary truncate">{ls.sleepHours >= 7 ? 'Restorative' : 'Disrupted Recovery'}</span>
                </div>
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-2xl font-black text-on-surface leading-tight">{ls.sleepHours}h</div>
              <span className="text-[10px] font-medium text-on-surface-variant block whitespace-nowrap">{ls.sleepDelta}</span>
            </div>
          </div>

          {/* Mini High Contrast Chart */}
          <div className="h-16 w-full flex items-end justify-between gap-1.5 px-1">
            {[30, 45, 40, 60, 85, 95, 90].map((h, i) => (
              <div 
                key={i} 
                className={`flex-1 rounded-t transition-all ${
                  h >= 85 ? 'bg-tertiary shadow-sm shadow-tertiary' : 'bg-surface-container-highest'
                }`} 
                style={{ height: `${h}%` }}
              ></div>
            ))}
          </div>
          <div className="flex justify-between text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
          </div>
        </div>

        {/* Steps Metric */}
        <div className="bg-surface-container-low border border-outline-variant rounded-2xl p-5 md:p-6 flex flex-col justify-between space-y-5 shadow-sm hover:border-primary transition-all">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
                <span className="material-symbols-outlined text-2xl">directions_walk</span>
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-base text-on-surface truncate">Daily Steps</h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-secondary shrink-0"></span>
                  <span className="text-[11px] font-bold text-secondary truncate">Target: 8,000</span>
                </div>
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-2xl font-black text-on-surface leading-tight">{ls.dailySteps.toLocaleString()}</div>
              <span className="text-[10px] font-medium text-on-surface-variant block whitespace-nowrap">{ls.stepPercentage}% of goal</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="relative w-full h-3 bg-surface-container-highest rounded-full overflow-hidden">
              <div className="absolute top-0 left-0 h-full bg-primary rounded-full shadow-sm shadow-primary transition-all duration-500" style={{ width: `${Math.min(100, ls.stepPercentage)}%` }}></div>
            </div>
            <div className="flex justify-between text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
              <span>Bed Rest</span>
              <span>Active Target</span>
            </div>
          </div>
        </div>

        {/* Stress Resilience Metric */}
        <div className="bg-surface-container-low border border-outline-variant rounded-2xl p-5 md:p-6 flex flex-col justify-between space-y-5 shadow-sm hover:border-error transition-all overflow-hidden">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-3 min-w-0">
              <div className={`p-2.5 rounded-xl border shrink-0 ${ls.stressScore > 70 ? 'bg-error/10 text-error border-error/20' : 'bg-primary/10 text-primary border-primary/20'}`}>
                <span className="material-symbols-outlined text-2xl">psychology_alt</span>
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-base text-on-surface truncate">Stress Resilience</h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${ls.stressScore > 70 ? 'bg-error' : 'bg-primary'}`}></span>
                  <span className={`text-[11px] font-bold truncate ${ls.stressScore > 70 ? 'text-error' : 'text-primary'}`}>{ls.stressLabel}</span>
                </div>
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-xl md:text-2xl font-black text-on-surface leading-tight">{ls.stressScore}%</div>
              <span className="text-[10px] font-medium text-on-surface-variant block whitespace-nowrap">Acuity Index</span>
            </div>
          </div>

          {/* Pulse Visualization */}
          <div className="h-16 w-full relative flex items-center justify-center overflow-hidden rounded-xl bg-surface-container border border-outline-variant/30">
            <svg className="w-full h-full" viewBox="0 0 400 100">
              <path className="animate-heartbeat" d="M0 50 L120 50 L135 20 L150 80 L165 50 L180 50 L200 40 L220 60 L240 50 L400 50" fill="none" stroke={ls.stressScore > 70 ? '#ff5252' : '#4edea3'} strokeWidth="3"></path>
            </svg>
            <div className="absolute inset-0 bg-gradient-to-r from-surface-container via-transparent to-surface-container"></div>
          </div>
        </div>
      </section>

      {/* Clinical Recommendation Bento */}
      <section className="bg-surface-container rounded-2xl p-6 md:p-8 border border-outline-variant shadow-md">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
            <span className="material-symbols-outlined text-xl">lightbulb</span>
          </div>
          <h3 className="font-bold text-base md:text-lg text-on-surface uppercase tracking-wider">Autonomous Clinical Recommendation for {patient.name}</h3>
        </div>
        <p className="font-body-md text-sm md:text-base text-on-surface-variant leading-relaxed mb-6 bg-background/50 p-5 rounded-xl border border-outline-variant/40">
          {patient.name} is undergoing clinical management for {patient.diagnosis}. {ls.summary} Core resting heart rate is {patient.hr || patient.heartRate || 75} bpm with oxygen saturation at {patient.spo2 || patient.spO2 || 98}%. Continue individualized protocol and monitor telemetry trends.
        </p>
        <button 
          onClick={handleCommit}
          disabled={isSyncing || syncComplete}
          className="w-full py-3 sm:py-3.5 px-4 bg-primary text-on-primary font-bold text-xs sm:text-sm rounded-xl hover:opacity-90 active:scale-98 transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSyncing ? (
            <>
              <span className="material-symbols-outlined animate-spin text-base shrink-0">sync</span>
              <span className="text-center">Syncing with Hospital EMR...</span>
            </>
          ) : syncComplete ? (
            <>
              <span className="material-symbols-outlined text-base shrink-0">check</span>
              <span className="text-center">Endorsed into Active Care Plan</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-base sm:text-lg shrink-0">verified</span>
              <span className="text-center">Endorse Clinical Recommendation to {patient.name}&apos;s Profile</span>
            </>
          )}
        </button>
      </section>
    </div>
  );
}

export default function LifestyleAuditPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-on-surface-variant font-medium">Loading lifestyle metrics...</div>}>
      <LifestyleAuditContent />
    </Suspense>
  );
}
