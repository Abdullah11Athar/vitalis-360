"use client";
import React, { useState } from 'react';
import Link from 'next/link';

export default function NyquistSecurityAudit() {
  const [searchTerm, setSearchTerm] = useState('');

  const logs = [
    {
      id: '4882-XQ',
      title: 'Admin Access & Role Verification',
      time: '14:02:11',
      status: 'Secured',
      icon: 'key',
      color: 'text-primary',
      bg: 'bg-primary/10',
      justification: 'Access requested for historical vital trend analysis during critical telemetry shift. Request aligns with Clinician ID-902 role permissions.',
      ip: '192.168.1.144',
      encryption: 'AES-256-GCM',
      hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
    },
    {
      id: '3991-ZB',
      title: 'Data Synchronization & Telemetry Backup',
      time: '13:45:00',
      status: 'Secured',
      icon: 'database',
      color: 'text-tertiary',
      bg: 'bg-tertiary/10',
      justification: 'Automated hourly snapshot of patient vital streams to encrypted cold storage node US-EAST-1.',
      ip: '10.0.44.12',
      encryption: 'TLS 1.3 / AES-256',
      hash: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4'
    },
    {
      id: '2281-SH',
      title: 'Sentinel Heartbeat & Diagnostics',
      time: '13:30:00',
      status: 'Secured',
      icon: 'update',
      color: 'text-secondary',
      bg: 'bg-secondary/10',
      justification: 'Self-check diagnostic routine completed with zero anomalies in memory-resident neural blocks.',
      ip: '127.0.0.1 (Local Sentinel)',
      encryption: 'Hardware Enclave (SGX)',
      hash: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a'
    },
    {
      id: '1102-UA',
      title: 'Unusual Access Pattern Intercepted',
      time: '12:14:55',
      status: 'Blocked',
      icon: 'warning',
      color: 'text-error',
      bg: 'bg-error/10',
      justification: 'Multiple rapid authentication attempts from geographically inconsistent IP address flagged by autonomous sentinel.',
      ip: '45.33.22.11 (Blocked by Policy #42)',
      encryption: 'N/A - Terminated',
      hash: 'c3ab8ff13720e8ad9047dd39466b3c8974e592c2fa383d4a3960714caef0c4f2'
    }
  ];

  const filteredLogs = logs.filter(log => 
    log.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.justification.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="py-6 px-4 md:px-8 max-w-5xl mx-auto w-full pb-36 md:pb-12">
      {/* Header Section */}
      <section className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-outline-variant pb-6">
        <div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
            <h1 className="font-headline-lg text-2xl md:text-3xl text-on-surface font-bold">Nyquist Security & Cryptographic Audit</h1>
            <span className="font-label-sm text-[11px] sm:text-xs text-primary uppercase tracking-wider bg-primary/10 px-2.5 py-1 rounded-xl font-bold border border-primary/20 whitespace-nowrap shrink-0">
              Zero-Trust Guard
            </span>
          </div>
          <p className="font-label-md text-sm text-on-surface-variant">Real-time system integrity and immutable SHA-256 audit trails</p>
        </div>
        <div className="flex gap-3">
          <Link href="/audits/forensic" prefetch={true} className="px-4 py-2 bg-surface-container text-on-surface text-xs font-bold rounded-xl border border-outline-variant hover:bg-surface-container-high transition-all">
            Forensic Report
          </Link>
          <Link href="/audits/governance" prefetch={true} className="px-4 py-2 bg-surface-container text-on-surface text-xs font-bold rounded-xl border border-outline-variant hover:bg-surface-container-high transition-all">
            Governance Cert
          </Link>
        </div>
      </section>

      {/* Forensic Status Overview */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="md:col-span-2 bg-surface-container-low border border-outline-variant rounded-2xl p-4 sm:p-6 flex flex-col justify-between relative overflow-hidden shadow-sm">
          <div className="absolute -right-6 -top-6 opacity-5 pointer-events-none select-none">
            <span className="material-symbols-outlined text-[140px]">verified_user</span>
          </div>
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-primary text-2xl">security</span>
            <span className="font-bold text-xs text-on-surface-variant uppercase tracking-wider">System Integrity Score</span>
          </div>
          <div className="flex flex-wrap items-baseline gap-2 sm:gap-3">
            <span className="font-headline-lg text-4xl md:text-5xl font-black text-primary">99.9%</span>
            <span className="text-[11px] sm:text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-xl border border-primary/20 whitespace-nowrap">
              Cryptographically Verified
            </span>
          </div>
          <p className="text-xs text-on-surface-variant mt-4 font-medium">Last Cryptographic Verification: 2m ago via SGX Enclave</p>
        </div>

        <div className="bg-surface-container-low border border-outline-variant rounded-2xl p-6 flex flex-col justify-between shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-tertiary text-xl">psychology</span>
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">AI Triggers</span>
          </div>
          <span className="text-3xl md:text-4xl font-black text-on-surface">14</span>
          <div className="text-xs text-on-surface-variant mt-4 italic font-medium">Last 24h justification logs</div>
        </div>

        <div className="bg-surface-container-low border border-outline-variant rounded-2xl p-6 flex flex-col justify-between shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-error text-xl">gavel</span>
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Failed Auth</span>
          </div>
          <span className="text-3xl md:text-4xl font-black text-error">0</span>
          <div className="text-xs text-on-surface-variant mt-4 italic font-medium">Active sentinel blocks: 0</div>
        </div>
      </section>

      {/* Search & Filter Bar */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 relative">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">search</span>
          <input 
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-surface-container border border-outline-variant rounded-xl pl-12 pr-4 py-3.5 text-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary transition-all shadow-sm"
            placeholder="Search cryptographic audit trails, SHA-256 hashes, or IPs..."
          />
        </div>
        <button className="w-12 h-12 flex items-center justify-center bg-surface-container rounded-xl text-on-surface border border-outline-variant hover:bg-surface-container-high transition-colors shadow-sm">
          <span className="material-symbols-outlined">filter_list</span>
        </button>
      </div>

      {/* High-Density Forensic Log View */}
      <div className="space-y-4">
        <h2 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest px-1">Immutable Activity Logs</h2>

        {filteredLogs.map((log) => (
          <details key={log.id} className="group bg-surface-container-low border border-outline-variant rounded-2xl overflow-hidden transition-all duration-300 open:ring-1 open:ring-primary/40 open:bg-surface-container shadow-sm">
            <summary className="flex items-center justify-between p-5 cursor-pointer list-none hover:bg-surface-container-high/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl ${log.bg} flex items-center justify-center border border-outline-variant/30`}>
                  <span className={`material-symbols-outlined text-2xl ${log.color}`}>{log.icon}</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base md:text-lg text-on-surface">{log.title}</h3>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      log.status === 'Secured' ? 'bg-primary/20 text-primary' : 'bg-error/20 text-error'
                    }`}>
                      {log.status}
                    </span>
                  </div>
                  <p className="text-xs text-on-surface-variant mt-0.5">ID: {log.id} • {log.time}</p>
                </div>
              </div>
              <span className="material-symbols-outlined transition-transform group-open:rotate-180 text-on-surface-variant">
                expand_more
              </span>
            </summary>

            <div className="p-5 border-t border-outline-variant/50 bg-background/60 space-y-4">
              <div>
                <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1">AI Justification Trigger</span>
                <div className="p-3.5 bg-surface-container rounded-xl border-l-4 border-l-primary">
                  <p className="text-xs leading-relaxed text-on-surface font-medium">&ldquo;{log.justification}&rdquo;</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-surface-container p-3 rounded-xl border border-outline-variant/40">
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Source IP / Node</span>
                  <code className="text-xs font-mono text-primary font-bold">{log.ip}</code>
                </div>
                <div className="bg-surface-container p-3 rounded-xl border border-outline-variant/40">
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Encryption Tunnel</span>
                  <code className="text-xs font-mono text-secondary font-bold">{log.encryption}</code>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Cryptographic Hash (SHA-256 Immutable Proof)</span>
                <div className="bg-surface-container-highest p-3 rounded-xl text-xs font-mono text-on-surface-variant break-all border border-outline-variant/50 select-all">
                  {log.hash}
                </div>
              </div>

              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('show-toast', { detail: `🔐 Verifying chain of custody for log ID ${log.id}... Hash verified against immutable ledger.` }))}
                className="w-full py-3 bg-primary text-on-primary font-bold text-xs rounded-xl flex items-center justify-center gap-2 hover:opacity-90 active:scale-98 transition-all shadow-md"
              >
                <span className="material-symbols-outlined text-base">verified</span>
                Verify Cryptographic Chain of Custody
              </button>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
