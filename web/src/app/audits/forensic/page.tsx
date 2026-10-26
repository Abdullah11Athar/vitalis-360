"use client";
import React from 'react';
import Link from 'next/link';

export default function ForensicAuditReport() {
  const handleDownload = () => {
    const reportText = `%PDF-1.4
%
1 0 obj
<< /Title (VITALIS-360 Q3 Life-Safety Performance Report)
   /Author (VITALIS-360 Continuous Security Sentinel)
   /Subject (Sentinel Performance Metrics Verification)
   /Creator (VITALIS-360 Sentinel Engine)
>>
endobj
2 0 obj
<< /Type /Catalog /Pages 3 0 R >>
endobj
3 0 obj
<< /Type /Pages /Kids [4 0 R] /Count 1 >>
endobj
4 0 obj
<< /Type /Page /Parent 3 0 R /MediaBox [0 0 612 792] /Contents 5 0 R /Resources << >> >>
endobj
5 0 obj
<< /Length 280 >>
stream
BT
/F1 12 Tf
72 712 Td
(VITALIS-360 Q3 Life-Safety Performance Report) Tj
0 -30 Td
(Verification Standard: Q3 LIFE-SAFETY COMPLIANT) Tj
0 -20 Td
(Critical Interventions: 142 Lives Saved) Tj
0 -20 Td
(Median Response Time: 4.2 minutes) Tj
0 -20 Td
(HITL Endorsement Rate: 98.4% Optimal) Tj
0 -20 Td
(Verification Code: V360-X92-2023) Tj
ET
endstream
endobj
xref
0 6
0000000000 65535 f 
0000000015 00000 n 
0000000180 00000 n 
0000000227 00000 n 
0000000288 00000 n 
0000000392 00000 n 
trailer
<< /Size 6 /Root 2 0 R >>
startxref
562
%%EOF`;
    const blob = new Blob([reportText], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Vitalis-360_Q3_Life_Safety_Report.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    window.dispatchEvent(new CustomEvent('show-toast', { detail: "📥 Q3 Life-Safety Report PDF downloaded successfully!" }));
  };

  return (
    <div className="py-6 px-4 md:px-8 max-w-5xl mx-auto w-full pb-36 md:pb-12">
      {/* Header Section */}
      <section className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-outline-variant pb-6">
        <div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
            <h1 className="font-headline-lg text-2xl md:text-3xl text-on-surface font-bold">Emergency Sentinel Audit Report</h1>
            <span className="font-label-sm text-[11px] sm:text-xs text-primary uppercase tracking-wider bg-primary/10 px-2.5 py-1 rounded-xl font-bold border border-primary/20 whitespace-nowrap shrink-0">
              Q3 Life-Safety
            </span>
          </div>
          <p className="font-label-md text-sm text-on-surface-variant">Export preview and historical performance verification</p>
        </div>
        <div className="flex gap-3">
          <Link href="/audits/governance" prefetch={true} className="px-4 py-2 bg-surface-container text-on-surface text-xs font-bold rounded-xl border border-outline-variant hover:bg-surface-container-high transition-all">
            Governance Cert
          </Link>
          <Link href="/audits/nyquist" prefetch={true} className="px-4 py-2 bg-surface-container text-on-surface text-xs font-bold rounded-xl border border-outline-variant hover:bg-surface-container-high transition-all">
            Nyquist Security
          </Link>
          <button 
            onClick={handleDownload}
            className="bg-primary text-on-primary px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-bold shadow-md hover:opacity-90 active:scale-95 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">download</span>
            Export PDF
          </button>
        </div>
      </section>

      {/* PDF Style Page Mockup */}
      <div className="bg-[#f8fafc] text-slate-900 rounded-2xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.5)] mb-8 relative border border-slate-300">
        {/* Report Header */}
        <div className="p-6 md:p-8 border-b border-slate-200 bg-white flex justify-between items-start">
          <div>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Vitalis-360 Sentinel Audit</span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 leading-tight mt-1">Q3 Life-Safety Performance Report</h2>
            <p className="text-xs text-slate-500 mt-1">Generated: Oct 24, 2023 • ID: V360-X92-2023</p>
          </div>
          <div className="w-14 h-14 bg-emerald-50 rounded-xl flex items-center justify-center border border-emerald-200 shadow-sm">
            <span className="material-symbols-outlined text-3xl text-emerald-600">security</span>
          </div>
        </div>

        {/* Bento Stats Grid */}
        <div className="p-6 md:p-8 space-y-6">
          {/* Lives Saved Card */}
          <div className="bg-emerald-600 p-6 rounded-2xl text-white flex flex-col md:flex-row justify-between items-start md:items-center relative overflow-hidden shadow-lg shadow-emerald-600/20">
            <div className="z-10">
              <span className="text-xs font-bold opacity-80 uppercase tracking-wider">Critical Interventions</span>
              <p className="text-5xl md:text-6xl font-black mt-1">142</p>
            </div>
            <div className="z-10 flex items-center gap-2 mt-4 md:mt-0">
              <span className="text-xs font-bold px-3 py-1 bg-white/20 backdrop-blur rounded-full">LIVES SAVED</span>
              <span className="text-xs font-bold">+12% vs Q2</span>
            </div>
            <span className="material-symbols-outlined absolute -right-6 -bottom-6 text-white/10 text-[160px] pointer-events-none select-none">
              favorite
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Response Time Card */}
            <div className="bg-slate-900 p-6 rounded-2xl text-white flex justify-between items-center border border-slate-800 shadow-md">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Median Response Time</span>
                <p className="text-3xl font-black mt-1">4.2<span className="text-base font-normal text-slate-400 ml-1">min</span></p>
              </div>
              <div className="flex items-center text-emerald-400 gap-1 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20 font-bold text-xs">
                <span className="material-symbols-outlined text-base">trending_down</span>
                <span>-0.8m faster</span>
              </div>
            </div>

            {/* HITL Rate Card */}
            <div className="bg-white p-6 rounded-2xl text-slate-900 flex justify-between items-center border border-slate-200 shadow-sm">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">HITL Endorsement Rate</span>
                <p className="text-3xl font-black mt-1">98.4<span className="text-base font-normal text-slate-500 ml-1">%</span></p>
              </div>
              <div className="flex items-center text-emerald-600 gap-1 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 font-bold text-xs">
                <span className="material-symbols-outlined text-base">verified</span>
                <span>Optimal</span>
              </div>
            </div>
          </div>

          {/* Mini Chart Section */}
          <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl">
            <div className="flex justify-between items-center mb-6">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Trend Analysis (90d Resolution)</span>
              <span className="text-xs text-slate-400 font-medium">Weekly intervention volume</span>
            </div>
            <div className="h-28 flex items-end justify-between gap-2">
              {[40, 55, 45, 70, 60, 85, 95, 75, 80, 65, 90, 100].map((h, i) => (
                <div 
                  key={i} 
                  className={`w-full rounded-t transition-all ${
                    h >= 90 ? 'bg-emerald-500 shadow-sm' : h >= 70 ? 'bg-emerald-400' : 'bg-slate-200'
                  }`}
                  style={{ height: `${h}%` }}
                ></div>
              ))}
            </div>
          </div>

          {/* Signature Block */}
          <div className="pt-6 border-t border-slate-200 flex justify-between items-end">
            <div>
              <p className="text-[10px] text-slate-400 font-bold tracking-wider">CERTIFIED BY CLINICAL BOARD</p>
              <p className="text-base font-bold text-slate-700 font-serif italic mt-1 border-b-2 border-slate-300 pb-1">
                Dr. Eleanor Vance, CMO
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-slate-400 font-bold tracking-wider">SECURE CRYPTOGRAPHIC HASH</p>
              <p className="text-xs font-mono font-bold text-slate-500 mt-1 bg-slate-100 px-2 py-1 rounded">
                88F1-CA02-55E1-99B0
              </p>
            </div>
          </div>
        </div>

        {/* Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none -rotate-12 select-none">
          <span className="text-8xl md:text-9xl font-black text-slate-900">CONFIDENTIAL</span>
        </div>
      </div>

      {/* Summary Notes Section */}
      <section className="space-y-4">
        <h3 className="text-sm font-bold text-on-surface-variant flex items-center gap-2 uppercase tracking-wider">
          <span className="material-symbols-outlined text-lg text-primary">info</span>
          Analysis Summary
        </h3>
        <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant space-y-4 shadow-sm">
          <div className="flex gap-3">
            <div className="w-1.5 h-auto bg-primary rounded-full"></div>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              The Q3 report indicates a <strong className="text-primary">significant improvement</strong> in median emergency response time, largely attributed to the AI-Sentinel predictive deployment algorithm in urban healthcare zones.
            </p>
          </div>
          <div className="flex gap-3">
            <div className="w-1.5 h-auto bg-primary rounded-full"></div>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Human-in-the-Loop (HITL) Endorsement remains near perfect at <strong className="text-on-surface">98.4%</strong>, ensuring that clinical empathy and physician oversight are maintained alongside technological speed.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
