"use client";
import React, { useState } from 'react';

export default function EmergencyLogs() {
  const [filter, setFilter] = useState('ALL');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const handleDownloadLog = (log: any) => {
    const reportText = `======================================================
VITALIS-360 INCIDENT AUDIT & FORENSIC DISPATCH LOG
======================================================
Audit ID: #FL-${log.id * 1849}
Severity: ${log.severity}
Event Type: ${log.type}
Timestamp: ${log.time}
Patient: ${log.patientName} (${log.patientId})

CLINICAL INCIDENT SUMMARY:
Telemetry array detected sudden ${log.type.toLowerCase()} at ${log.time}.
Automated sentinel protocol triggered immediate E911 broadcast alert
and intercom dispatch to Ward nursing station.
Clinical Note: ${log.note}
${log.details ? `Vitals Snapshot: HR: ${log.details.hr} bpm | SpO2: ${log.details.spo2} | BP: ${log.details.bp}` : ''}

FORENSIC ATTESTATION:
- Sentinel Protocol: Nyquist Level 4 Zero-Trust
- Cryptographic Signature: SHA-256-${Math.random().toString(36).substring(2, 10).toUpperCase()}
- Audited By: Autonomous HITL Sentinel Orchestrator
- Compliance: SOC2 Type II / HIPAA Compliant
======================================================`;

    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Vitalis_Emergency_Incident_${log.patientId.replace(/[^a-zA-Z0-9]/g, '')}_Audit.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    window.dispatchEvent(new CustomEvent('show-toast', { detail: `📥 Forensic incident report downloaded for ${log.patientName}!` }));
  };

  const logs = [
    {
      id: 1,
      type: 'Vitals Breach',
      severity: 'CRITICAL',
      patientName: 'Robert Chen',
      patientId: '#8821-XC',
      time: '14:22:05',
      details: { hr: '142', spo2: '88%', bp: '110/70' },
      note: 'High-risk threshold exceeded',
      color: 'border-error text-error bg-error/10'
    },
    {
      id: 2,
      type: 'Arrhythmia Detection',
      severity: 'WARNING',
      patientName: 'Sarah Jenkins',
      patientId: '#1042-JL',
      time: '14:18:42',
      details: null,
      note: 'Normalizing after AI intervention',
      color: 'border-primary text-primary bg-primary/10'
    },
    {
      id: 3,
      type: 'Fall Risk Alert',
      severity: 'INFO',
      patientName: 'Arthur Vance',
      patientId: '#5590-AV',
      time: '14:05:11',
      details: null,
      note: 'Movement pattern suggests unassisted mobilization attempt in Ward 4.',
      color: 'border-on-surface-variant text-on-surface-variant bg-on-surface-variant/10'
    },
    {
      id: 4,
      type: 'Apnea Event',
      severity: 'CRITICAL',
      patientName: 'Maria Garcia',
      patientId: '#2231-MG',
      time: '13:59:44',
      details: null,
      note: 'Respiratory rate: 4 BPM',
      color: 'border-error text-error bg-error/10'
    }
  ];

  const filteredLogs = filter === 'ALL' 
    ? logs 
    : logs.filter(l => l.severity === filter);

  return (
    <div className="py-6 px-4 md:px-8 max-w-6xl mx-auto w-full pb-36 md:pb-12">
      {/* Header Section */}
      <section className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-outline-variant pb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="font-headline-lg text-2xl md:text-3xl text-on-surface font-bold">Incident Logs</h1>
            <span className="font-label-sm text-xs text-primary uppercase tracking-widest bg-primary/10 px-2.5 py-1 rounded-full font-bold border border-primary/20">
              Sentinel Active
            </span>
          </div>
          <p className="font-label-md text-sm text-on-surface-variant">Real-time forensic activation feed and anomaly detection</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 bg-surface-container p-1 rounded-xl border border-outline-variant w-fit">
          {['ALL', 'CRITICAL', 'WARNING', 'INFO'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filter === tab 
                  ? 'bg-primary text-on-primary shadow-sm' 
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </section>

      {/* Stats Bento Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-surface-container-low rounded-2xl p-5 border border-outline-variant flex flex-col justify-between shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Total Breaches</span>
            <span className="material-symbols-outlined text-error">warning</span>
          </div>
          <div className="text-3xl md:text-4xl font-black text-on-surface">12</div>
          <div className="text-xs text-error font-medium mt-1">↑ 2 in last hour</div>
        </div>

        <div className="bg-surface-container-low rounded-2xl p-5 border border-outline-variant flex flex-col justify-between shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">AI Latency</span>
            <span className="material-symbols-outlined text-primary">timer</span>
          </div>
          <div className="text-3xl md:text-4xl font-black text-on-surface">0.4s</div>
          <div className="text-xs text-primary font-medium mt-1">Real-time sync</div>
        </div>

        <div className="bg-surface-container-low rounded-2xl p-5 border border-outline-variant flex flex-col justify-between shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Active Sentinels</span>
            <span className="material-symbols-outlined text-tertiary">sensors</span>
          </div>
          <div className="text-3xl md:text-4xl font-black text-on-surface">104</div>
          <div className="text-xs text-on-surface-variant font-medium mt-1">100% coverage</div>
        </div>

        <div className="bg-surface-container-low rounded-2xl p-5 border border-outline-variant flex flex-col justify-between shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">HITL Overrules</span>
            <span className="material-symbols-outlined text-secondary">verified_user</span>
          </div>
          <div className="text-3xl md:text-4xl font-black text-on-surface">3</div>
          <div className="text-xs text-secondary font-medium mt-1">Physician verified</div>
        </div>
      </div>

      {/* Chronological Feed */}
      <div className="space-y-4">
        {filteredLogs.map((log) => (
          <article 
            key={log.id} 
            className={`bg-surface-container p-5 rounded-2xl border-l-4 border-y border-r border-outline-variant transition-all hover:border-r-primary ${
              log.severity === 'CRITICAL' ? 'border-l-error' : log.severity === 'WARNING' ? 'border-l-primary' : 'border-l-on-surface-variant'
            }`}
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`w-2 h-2 rounded-full ${log.severity === 'CRITICAL' ? 'bg-error animate-pulse' : log.severity === 'WARNING' ? 'bg-primary' : 'bg-on-surface-variant'}`}></span>
                  <span className={`font-label-sm text-xs uppercase font-bold ${log.severity === 'CRITICAL' ? 'text-error' : log.severity === 'WARNING' ? 'text-primary' : 'text-on-surface-variant'}`}>
                    {log.type}
                  </span>
                </div>
                <h3 className="font-title-md text-lg text-on-surface font-bold">{log.patientName}</h3>
                <p className="font-label-sm text-xs text-on-surface-variant">Patient ID: {log.patientId}</p>
              </div>
              <div className="text-right">
                <span className="font-label-sm text-xs font-mono bg-surface-container-high px-2 py-1 rounded text-on-surface-variant">
                  {log.time}
                </span>
              </div>
            </div>

            {log.details && (
              <div className="grid grid-cols-3 gap-3 mb-4 bg-surface-container-low p-3 rounded-xl border border-outline-variant/50">
                <div className="text-center">
                  <div className="text-label-sm text-[10px] uppercase font-bold text-on-surface-variant">HR</div>
                  <div className="text-error font-bold text-lg">{log.details.hr}</div>
                </div>
                <div className="text-center border-x border-outline-variant/50 px-2">
                  <div className="text-label-sm text-[10px] uppercase font-bold text-on-surface-variant">SPO2</div>
                  <div className="text-error font-bold text-lg">{log.details.spo2}</div>
                </div>
                <div className="text-center">
                  <div className="text-label-sm text-[10px] uppercase font-bold text-on-surface-variant">BP</div>
                  <div className="text-on-surface font-bold text-lg">{log.details.bp}</div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-3 border-t border-outline-variant/50">
              <span className="text-label-sm text-xs text-on-surface-variant italic">{log.note}</span>
              <button 
                onClick={() => setExpandedId(expandedId === log.id ? null : log.id)}
                className="flex items-center gap-1 text-primary font-label-md text-xs font-bold hover:bg-primary/10 px-3 py-1.5 rounded-full transition-colors cursor-pointer"
              >
                {expandedId === log.id ? 'Hide Detail' : 'View Detail'}
                <span className="material-symbols-outlined text-[16px]">{expandedId === log.id ? 'expand_less' : 'chevron_right'}</span>
              </button>
            </div>

            {expandedId === log.id && (
              <div className="mt-4 p-4 bg-surface-container-high rounded-xl border border-outline-variant/60 flex flex-col gap-3 animate-slide-down">
                <div className="flex items-center justify-between border-b border-outline-variant/40 pb-2">
                  <span className="text-xs font-bold text-primary uppercase tracking-wider">AI Forensic Telemetry Audit (#FL-{log.id * 1849})</span>
                  <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded font-bold">SHA-256 Verified</span>
                </div>
                <p className="text-xs text-on-surface leading-relaxed">
                  <strong>Incident Summary:</strong> Telemetry array detected sudden {log.type.toLowerCase()} at {log.time}. Automated sentinel protocol triggered immediate E911 broadcast alert and intercom dispatch to Ward 4 nursing station. Patient stabilized within 120 seconds.
                </p>
                <div className="flex justify-end gap-2 pt-1">
                  <button 
                    onClick={() => handleDownloadLog(log)}
                    className="px-3 py-1.5 bg-primary text-on-primary rounded-lg text-xs font-bold shadow hover:opacity-90 transition-all cursor-pointer flex items-center gap-1 active:scale-95"
                  >
                    <span className="material-symbols-outlined text-sm">download</span>
                    <span>Download Report</span>
                  </button>
                </div>
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
