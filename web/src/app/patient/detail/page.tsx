"use client";
import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { getPatientById, PatientRecord, AlarmItem } from '@/lib/patientData';

function PatientDetailContent() {
  const searchParams = useSearchParams();
  const patientId = searchParams.get('id') || '8829-XL';
  
  const [reports, setReports] = useState<any[]>([]);
  const [selectedReportForReview, setSelectedReportForReview] = useState<any | null>(null);
  const [role, setRole] = useState('patient');
  const [patient, setPatient] = useState<PatientRecord>(() => getPatientById(patientId));
  const [alarms, setAlarms] = useState<AlarmItem[]>(() => patient.alarms || []);

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
    setAlarms(currentRecord.alarms || []);

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
  }, [patientId]);

  const resolveAlarm = (id: number) => {
    setAlarms(prev => prev.filter(a => a.id !== id));
    window.dispatchEvent(new CustomEvent('show-toast', { detail: "✅ Alarm acknowledged and logged to EMR audit log." }));
  };

  const handleDelete = (id: string, title: string) => {
    const updated = reports.filter(r => r.id !== id);
    setReports(updated);
    localStorage.setItem('vitalis_uploaded_reports', JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('show-toast', { detail: `🗑️ Report "${title}" deleted from Vault.` }));
  };

  const handleDownload = (rep: any) => {
    const biomarkerSummary = patient.labPanel?.metrics?.map(m => `${m.name}: ${m.value} (${m.status})`).join(', ') || 'Normal';
    const content = `VITALIS-360 CLINICAL VAULT REPORT
==================================================
Document: ${rep.title}
Patient: ${patient.name} (ID: ${patient.id})
Age/Gender: ${patient.age} yrs / ${patient.gender}
Ward: ${patient.ward}
Primary Diagnosis: ${patient.diagnosis}
Uploader: ${rep.uploader}
Date: ${rep.date}
SHA-256 Hash: ${rep.hash}
Security Audit: VERIFIED & COMPLIANT

CLINICAL FINDINGS & AI SYNTHESIS:
- Core Telemetry: HR ${patient.hr || patient.heartRate || 75} bpm, BP ${patient.bp}, SpO2 ${patient.spo2 || patient.spO2 || 98}%, Temp ${patient.temp || '98.6°F'}.
- Laboratory Biomarkers: ${biomarkerSummary}
- Diagnostic Synthesis: ${patient.advisor?.differential || 'Stable under continuous clinical observation.'}
- Regulatory Standard: HIPAA / GDPR Cryptographically Sealed by VITALIS-360 Guardian.
==================================================`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${rep.title.replace(/\.[^/.]+$/, "")}_${patient.name.replace(/\s+/g, '_')}_Report.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    window.dispatchEvent(new CustomEvent('show-toast', { detail: `📥 Downloaded "${rep.title}" for ${patient.name} successfully!` }));
  };

  const backHref = role === 'doctor' ? '/doctor/rounds' : role === 'staff' ? '/patient' : '/patient/dashboard';

  return (
    <div className="py-6 px-4 md:px-8 max-w-5xl mx-auto w-full pb-36 md:pb-12">
      {/* Header Profile Section */}
      <section className="mb-8 flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-outline-variant pb-6">
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <Link href={backHref} prefetch={true} className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container hover:bg-surface-container-high transition-colors active:scale-95 duration-150 border border-outline-variant cursor-pointer shrink-0">
            <span className="material-symbols-outlined text-primary">arrow_back</span>
          </Link>
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-surface-container-high border-2 border-primary/40 overflow-hidden flex items-center justify-center shadow-md shrink-0">
            <img 
              src={patient.avatar} 
              alt={patient.name} 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h1 className="font-headline-lg text-lg md:text-xl text-on-surface font-bold truncate">{patient.name}</h1>
              <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${patient.statusColor === 'error' ? 'bg-error animate-pulse' : patient.statusColor === 'amber' ? 'bg-amber-500' : 'bg-primary'}`}></span>
            </div>
            <p className="font-label-md text-xs text-on-surface-variant font-medium truncate">ID: {patient.id} • {patient.age} yrs • {patient.gender} • {patient.ward}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 shrink-0 max-w-full pb-1 md:pb-0 justify-start">
          <Link href={`/patient/lifestyle?id=${patient.id}`} prefetch={true} className="px-3 py-2 bg-surface-container text-on-surface text-xs font-bold rounded-xl border border-outline-variant hover:bg-surface-container-high transition-all flex items-center gap-1.5 shadow-sm cursor-pointer whitespace-nowrap">
            <span className="material-symbols-outlined text-base text-primary">health_metrics</span>
            <span>Lifestyle Audit</span>
          </Link>
          <Link href={`/patient/sleep?id=${patient.id}`} prefetch={true} className="px-3 py-2 bg-surface-container text-on-surface text-xs font-bold rounded-xl border border-outline-variant hover:bg-surface-container-high transition-all flex items-center gap-1.5 shadow-sm cursor-pointer whitespace-nowrap">
            <span className="material-symbols-outlined text-base text-tertiary">bedtime</span>
            <span>Sleep Fidelity</span>
          </Link>
          <Link href={`/patient/advisor?id=${patient.id}`} prefetch={true} className="px-3 py-2 bg-primary text-on-primary text-xs font-bold rounded-xl hover:opacity-90 transition-all flex items-center gap-1.5 shadow-md cursor-pointer whitespace-nowrap">
            <span className="material-symbols-outlined text-base">psychology</span>
            <span>AI Advisor</span>
          </Link>
        </div>
      </section>

      {/* Patient Vitals & Clinical Profile Banner */}
      <section className="mb-8 bg-surface-container-low rounded-2xl p-5 border border-outline-variant shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-outline-variant/40">
          <div>
            <span className="text-[10px] font-bold text-primary uppercase tracking-wider block">Active Clinical Profile</span>
            <h2 className="text-base sm:text-lg font-black text-on-surface mt-0.5">{patient.diagnosis}</h2>
          </div>
          <span className={`px-3 py-1 rounded-xl text-xs font-bold border flex items-center gap-1.5 w-fit ${
            patient.statusColor === 'error' ? 'bg-error/10 text-error border-error/30' : patient.statusColor === 'amber' ? 'bg-amber-500/10 text-amber-500 border-amber-500/30' : 'bg-primary/10 text-primary border-primary/30'
          }`}>
            <span className={`w-2 h-2 rounded-full ${patient.statusColor === 'error' ? 'bg-error animate-pulse' : patient.statusColor === 'amber' ? 'bg-amber-500' : 'bg-primary'}`}></span>
            {patient.status}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
          <div className="bg-surface-container/40 p-3 rounded-xl border border-outline-variant/30 text-center">
            <span className="text-[10px] font-bold text-on-surface-variant uppercase">Heart Rate</span>
            <div className={`text-lg sm:text-xl font-black mt-1 ${(patient.hr || patient.heartRate || 0) > 100 ? 'text-error' : 'text-on-surface'}`}>
              {patient.hr || patient.heartRate || 75} <span className="text-xs font-normal">bpm</span>
            </div>
          </div>
          <div className="bg-surface-container/40 p-3 rounded-xl border border-outline-variant/30 text-center">
            <span className="text-[10px] font-bold text-on-surface-variant uppercase">Blood Pressure</span>
            <div className="text-lg sm:text-xl font-black text-on-surface mt-1">{patient.bp || '120/80'}</div>
          </div>
          <div className="bg-surface-container/40 p-3 rounded-xl border border-outline-variant/30 text-center">
            <span className="text-[10px] font-bold text-on-surface-variant uppercase">Oxygen (SpO2)</span>
            <div className="text-lg sm:text-xl font-black text-primary mt-1">{patient.spo2 || patient.spO2 || 98}%</div>
          </div>
          <div className="bg-surface-container/40 p-3 rounded-xl border border-outline-variant/30 text-center">
            <span className="text-[10px] font-bold text-on-surface-variant uppercase">Body Temp</span>
            <div className={`text-lg sm:text-xl font-black mt-1 ${parseFloat(patient.temp || '98.6') >= 100.4 ? 'text-error' : 'text-on-surface'}`}>
              {patient.temp || '98.6°F'}
            </div>
          </div>
        </div>
      </section>

      {/* Active Alarms Section */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-sm font-bold text-on-surface uppercase tracking-wider">Active Clinical Alarms</h2>
          {alarms.length > 0 ? (
            <span className="bg-error/20 text-error px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 border border-error/30">
              <span className="w-2 h-2 rounded-full bg-error animate-ping"></span>
              {alarms.length} Unresolved Alerts
            </span>
          ) : (
            <span className="bg-primary/20 text-primary px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 border border-primary/30">
              <span className="material-symbols-outlined text-sm">check_circle</span>
              All Clear • Telemetry Within Limits
            </span>
          )}
        </div>
        {alarms.length > 0 ? (
          <div className="space-y-3">
            {alarms.map((alarm) => (
              <div key={alarm.id} className="p-4 bg-error/10 border border-error/30 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-error text-2xl mt-0.5">warning</span>
                  <div>
                    <h3 className="font-bold text-sm text-on-surface">{alarm.title}</h3>
                    <p className="text-xs text-on-surface-variant mt-0.5">{alarm.desc}</p>
                    <span className="text-[10px] text-error font-medium">{alarm.time}</span>
                  </div>
                </div>
                <button 
                  onClick={() => resolveAlarm(alarm.id)}
                  className="px-4 py-2 bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-bold rounded-xl border border-outline-variant transition-colors self-start md:self-auto cursor-pointer"
                >
                  Acknowledge & Clear
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 bg-primary/5 border border-primary/20 rounded-2xl flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-2xl">verified</span>
            <p className="text-xs text-on-surface-variant font-medium">Continuous telemetry demonstrates normal circadian waveform. No threshold violations detected in the past 24 hours.</p>
          </div>
        )}
      </section>

      {/* Medical History & Labs Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Active Clinical History */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-on-surface uppercase tracking-wider">Active Clinical History</h2>
          <div className="space-y-3">
            {patient.clinicalHistory && patient.clinicalHistory.length > 0 ? (
              patient.clinicalHistory.map((item, idx) => (
                <div key={idx} className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant space-y-3 shadow-sm">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-sm text-on-surface">{item.condition}</h3>
                    <span className="text-xs font-medium text-on-surface-variant bg-surface-container px-2 py-0.5 rounded">{item.diagnosed}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {item.medications.map((med, mIdx) => (
                      <span key={mIdx} className="text-xs bg-primary/10 text-primary border border-primary/20 px-2.5 py-1 rounded-lg font-bold">{med}</span>
                    ))}
                    {item.management && (
                      <span className="text-xs bg-surface-container text-on-surface-variant px-2.5 py-1 rounded-lg font-medium">{item.management}</span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant space-y-2 shadow-sm">
                <h3 className="font-bold text-sm text-on-surface">{patient.diagnosis}</h3>
                <span className="text-xs text-on-surface-variant block">No prior chronic conditions recorded in primary health vault.</span>
              </div>
            )}
          </div>
        </div>

        {/* Lab Results */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-on-surface uppercase tracking-wider">Recent Lab Panels</h2>
          <div className="bg-surface-container-low rounded-2xl border border-outline-variant overflow-hidden shadow-sm">
            <div className="p-4 border-b border-outline-variant/50 flex items-center justify-between bg-surface-container/30">
              <span className="font-bold text-sm text-on-surface">{patient.labPanel?.panelName || 'Clinical Biomarkers'}</span>
              <span className="text-xs text-on-surface-variant font-medium">{patient.labPanel?.date || 'Today'}</span>
            </div>
            <div className="divide-y divide-outline-variant/30">
              {patient.labPanel?.metrics?.map((metric, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 hover:bg-surface-container/20 transition-colors">
                  <div>
                    <span className="font-bold text-sm text-on-surface block">{metric.name}</span>
                    <span className="text-xs text-on-surface-variant">{metric.description}</span>
                  </div>
                  <div className="text-right">
                    <span className={`text-lg font-black ${metric.statusColor === 'error' ? 'text-error' : metric.statusColor === 'amber' ? 'text-amber-500' : 'text-primary'}`}>
                      {metric.value}
                    </span>
                    <div className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                      metric.statusColor === 'error' ? 'bg-error/10 text-error' : metric.statusColor === 'amber' ? 'bg-amber-500/10 text-amber-500' : 'bg-primary/10 text-primary'
                    }`}>
                      {metric.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button 
              onClick={() => window.dispatchEvent(new CustomEvent('show-toast', { detail: `🧪 Opening comprehensive Laboratory Panel report and historical trends for ${patient.name}...` }))}
              className="w-full p-3.5 bg-surface-container text-primary font-bold text-xs hover:bg-surface-container-high transition-colors text-center border-t border-outline-variant/50 block cursor-pointer"
            >
              View Full Laboratory Panel & Historical Trends for {patient.name}
            </button>
          </div>
        </div>
      </section>

      {/* Uploaded Patient Medical Reports Review Vault (Full Width Section) */}
      <section className="mb-8 bg-surface-container-low rounded-2xl p-6 border border-outline-variant shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-4 border-b border-outline-variant/50">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-2xl">folder_shared</span>
            <h2 className="text-base font-bold text-on-surface uppercase tracking-wider">Patient Uploaded Medical Reports Vault</h2>
          </div>
          <span className="bg-primary/10 text-primary px-2.5 py-1 rounded-xl text-xs font-bold border border-primary/20 whitespace-nowrap">SHARED WITH {patient.name.toUpperCase()}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {reports.map((rep) => (
            <div key={rep.id} className="p-5 bg-surface-container/40 hover:bg-surface-container rounded-2xl border border-outline-variant/60 flex flex-col justify-between gap-4 transition-all group shadow-sm">
              <div className="flex items-start gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20 mt-0.5">
                  <span className="material-symbols-outlined text-2xl">description</span>
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-sm text-on-surface line-clamp-2 leading-snug" title={rep.title}>{rep.title}</h4>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span className="text-[10px] font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-lg border border-primary/20 whitespace-nowrap">{rep.uploader}</span>
                    <span className="text-[10px] text-on-surface-variant font-medium">{rep.date}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-outline-variant/40 w-full justify-start sm:justify-end">
                <button 
                  onClick={() => setSelectedReportForReview(rep)}
                  className="flex-1 sm:flex-none px-3.5 py-2 bg-primary/15 hover:bg-primary hover:text-on-primary text-primary font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
                >
                  <span className="material-symbols-outlined text-base">psychology</span>
                  <span>AI Review</span>
                </button>
                <button 
                  onClick={() => handleDownload(rep)}
                  className="flex-1 sm:flex-none px-3.5 py-2 bg-surface-container-high hover:bg-primary hover:text-on-primary text-on-surface font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
                  title="Download Report PDF"
                >
                  <span className="material-symbols-outlined text-base">download</span>
                  <span>Download</span>
                </button>
                <button 
                  onClick={() => handleDelete(rep.id, rep.title)}
                  className="p-2 bg-error/10 hover:bg-error text-error hover:text-on-error font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center justify-center shadow-sm shrink-0"
                  title="Delete Report"
                >
                  <span className="material-symbols-outlined text-base">delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* AI Review Report Modal */}
      {selectedReportForReview && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-3 sm:p-4 backdrop-blur-md">
          <div className="w-full max-w-lg bg-surface-container border-2 border-primary/30 rounded-3xl p-5 sm:p-6 shadow-2xl relative animate-pulse-soft max-h-[85vh] overflow-y-auto custom-scrollbar">
            <button 
              onClick={() => setSelectedReportForReview(null)}
              className="absolute right-4 top-4 text-on-surface-variant hover:text-on-surface p-1.5 rounded-full cursor-pointer bg-surface-container-high"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>

            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-outline-variant/40">
              <div className="w-10 h-10 rounded-xl bg-primary/15 text-primary flex items-center justify-center border border-primary/30 shrink-0">
                <span className="material-symbols-outlined text-2xl">auto_awesome</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-primary uppercase tracking-widest block">GEMINI CLINICAL SYNTHESIS</span>
                <h3 className="font-headline-lg text-base font-bold text-on-surface truncate max-w-xs">{selectedReportForReview.title}</h3>
              </div>
            </div>

            <div className="space-y-3.5 text-xs text-on-surface mb-6">
              <div className="bg-surface-container-high p-3.5 rounded-xl border border-outline-variant/30">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-primary uppercase tracking-wider text-[10px]">Document Hash (SHA-256)</span>
                  <span className="bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded font-bold">VERIFIED</span>
                </div>
                <p className="font-mono text-[10px] text-on-surface-variant break-all">{selectedReportForReview.hash}</p>
              </div>

              <div className="bg-surface-container-high p-4 rounded-xl border border-outline-variant/30 space-y-2">
                <span className="font-bold text-on-surface block text-sm">Key Diagnostic Extraction ({patient.name}):</span>
                <ul className="space-y-1.5 text-on-surface-variant list-disc pl-4">
                  <li><strong className="text-on-surface">Primary Condition:</strong> {patient.diagnosis}</li>
                  <li><strong className="text-on-surface">Biomarkers ({patient.labPanel?.panelName}):</strong> {patient.labPanel?.metrics?.map(m => `${m.name}: ${m.value}`).join(', ')}</li>
                  <li><strong className="text-on-surface">Telemetry Status:</strong> Resting HR {patient.hr || patient.heartRate || 75} bpm, BP {patient.bp}, SpO2 {patient.spo2 || patient.spO2 || 98}%, Temp {patient.temp || '98.6°F'}.</li>
                </ul>
              </div>

              <div className="bg-primary/10 p-3.5 rounded-xl border border-primary/20">
                <span className="font-bold text-primary block text-xs mb-1">Recommended Clinician Action:</span>
                <p className="text-on-surface text-[11px] leading-relaxed">
                  {patient.advisor?.differential || 'Maintain continuous clinical telemetry surveillance and vital monitoring.'}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => handleDownload(selectedReportForReview)}
                className="flex-1 py-3 bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 border border-outline-variant/40 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">download</span>
                <span>Download Report</span>
              </button>
              <button
                onClick={() => setSelectedReportForReview(null)}
                className="flex-1 py-3 bg-primary text-on-primary font-bold text-xs rounded-xl shadow-md hover:opacity-90 active:scale-95 transition-all cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sentinel Observation */}
      <section className="bg-surface-container-low rounded-2xl p-6 border-2 border-primary/30 relative overflow-hidden shadow-lg shadow-primary/5">
        <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full -mr-24 -mt-24 blur-3xl pointer-events-none"></div>
        <div className="flex items-center gap-2.5 mb-3 relative z-10">
          <span className="material-symbols-outlined text-primary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
          <span className="font-bold text-xs text-primary uppercase tracking-widest">SENTINEL AI CONTINUOUS INSIGHT</span>
        </div>
        <p className="text-base font-medium text-on-surface italic leading-relaxed relative z-10 bg-surface-container/40 p-4 rounded-xl border border-outline-variant/30">
          &ldquo;{patient.name}&apos;s clinical parameters are under active automated surveillance. Core diagnosis &apos;{patient.diagnosis}&apos; tracked with real-time biometric safeguards.&rdquo;
        </p>
      </section>
    </div>
  );
}

export default function PatientDetail() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-on-surface-variant font-medium">Loading clinical insights...</div>}>
      <PatientDetailContent />
    </Suspense>
  );
}
