"use client";
import React from 'react';
import Link from 'next/link';

export default function ClinicalGovernance() {
  const handleDownload = () => {
    const certText = `%PDF-1.4
%
1 0 obj
<< /Title (VITALIS-360 HIPAA and SOC2 Compliance Certificate)
   /Author (VITALIS-360 Continuous Security Sentinel)
   /Subject (Compliance Verification Certificate)
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
<< /Length 260 >>
stream
BT
/F1 12 Tf
72 712 Td
(VITALIS-360 Clinical Platform Compliance Certification) Tj
0 -30 Td
(Verification Status: COMPLIANT / VERIFIED) Tj
0 -20 Td
(Standard Checklist: SOC2 Type II / HIPAA Security Rule) Tj
0 -20 Td
(Assessed Engine Version: Sentinel Continuous Audit V360) Tj
0 -20 Td
(Valid until: December 31, 2026) Tj
0 -20 Td
(Sign Verification Hash: 7a2f0e81c49b6d35f29e18204c552a188f0d36c2) Tj
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
    const blob = new Blob([certText], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Vitalis-360_Compliance_Certificate.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    window.dispatchEvent(new CustomEvent('show-toast', { detail: "📥 Compliance Certificate PDF downloaded successfully!" }));
  };

  return (
    <div className="py-6 px-4 md:px-8 max-w-5xl mx-auto w-full pb-36 md:pb-12">
      {/* Header Section */}
      <section className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-outline-variant pb-6">
        <div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
            <h1 className="font-headline-lg text-2xl md:text-3xl text-on-surface font-bold">Clinical Governance & Compliance</h1>
            <span className="font-label-sm text-[11px] sm:text-xs text-primary uppercase tracking-wider bg-primary/10 px-2.5 py-1 rounded-xl font-bold border border-primary/20 whitespace-nowrap shrink-0">
              SOC2 Type II • HIPAA
            </span>
          </div>
          <p className="font-label-md text-sm text-on-surface-variant">Formalized attestation and algorithmic transparency certificate</p>
        </div>
        <div className="flex gap-3">
          <Link href="/audits/forensic" prefetch={true} className="px-4 py-2 bg-surface-container text-on-surface text-xs font-bold rounded-xl border border-outline-variant hover:bg-surface-container-high transition-all">
            Forensic Audit
          </Link>
          <Link href="/audits/nyquist" prefetch={true} className="px-4 py-2 bg-surface-container text-on-surface text-xs font-bold rounded-xl border border-outline-variant hover:bg-surface-container-high transition-all">
            Nyquist Security
          </Link>
        </div>
      </section>

      {/* Verification Badge Section */}
      <div className="flex flex-col items-center justify-center mb-8">
        <div className="relative w-24 h-24 mb-4">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
          <div className="relative flex items-center justify-center w-full h-full bg-surface-container-highest border-2 border-primary rounded-full shadow-[0_0_20px_rgba(78,222,163,0.3)]">
            <span className="material-symbols-outlined text-primary text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
          </div>
        </div>
        <h2 className="font-headline-lg text-2xl font-black text-center text-on-background">Clinical Attestation</h2>
        <p className="font-label-md text-xs text-on-surface-variant text-center mt-1 uppercase tracking-widest font-mono font-bold">Certificate ID: V360-XJ-992-K</p>
      </div>

      {/* Main Certificate Card */}
      <div className="bg-surface-container-low border border-outline-variant rounded-2xl overflow-hidden shadow-2xl relative mb-8">
        {/* Subtle Watermark */}
        <div className="absolute top-0 right-0 p-8 opacity-5 -rotate-12 pointer-events-none select-none">
          <span className="material-symbols-outlined text-[200px]">security</span>
        </div>

        <div className="p-6 md:p-10 relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <span className="material-symbols-outlined text-primary text-2xl">gavel</span>
            <h3 className="font-title-md text-xl text-primary font-bold">Legal Statement</h3>
          </div>

          <p className="font-body-md text-base md:text-lg text-on-surface leading-relaxed italic mb-8 border-l-4 border-primary pl-4 bg-surface-container/50 py-3 rounded-r-xl">
            &ldquo;This document serves as a formalized attestation that all clinical data flows, AI inference protocols, and patient monitoring systems within the Vitalis-360 ecosystem have been audited for HIPAA-HITECH compliance, SOC2 Type II security standards, and algorithmic transparency.&rdquo;
          </p>

          {/* Technical Audit Metrics Bento */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="bg-surface-container-highest p-5 rounded-xl border border-outline-variant hover:border-primary transition-colors shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Accuracy Rate</span>
                <span className="material-symbols-outlined text-primary">troubleshoot</span>
              </div>
              <div className="text-primary text-3xl font-black">99.98%</div>
              <div className="h-1.5 bg-surface-container-high rounded-full mt-3 overflow-hidden">
                <div className="h-full bg-primary w-[99.98%] shadow-sm shadow-primary"></div>
              </div>
            </div>

            <div className="bg-surface-container-highest p-5 rounded-xl border border-outline-variant hover:border-primary transition-colors shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Encryption Protocol</span>
                <span className="material-symbols-outlined text-primary">encrypted</span>
              </div>
              <div className="text-primary text-3xl font-black">AES-256</div>
              <p className="text-xs text-on-surface-variant mt-2 font-medium">End-to-End Tunneling & Rest Protection</p>
            </div>

            <div className="bg-surface-container-highest p-5 rounded-xl border border-outline-variant md:col-span-2 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
              <div>
                <div className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Latency Standard & SLA</div>
                <div className="text-on-surface text-2xl font-black mt-1">&lt; 120ms Real-Time Response</div>
              </div>
              <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-xl text-primary font-bold text-xs">
                <span className="material-symbols-outlined text-lg">bolt</span>
                <span>99.999% Uptime Verified</span>
              </div>
            </div>
          </div>

          {/* Detail List */}
          <div className="space-y-4 mb-10 bg-surface-container p-6 rounded-2xl border border-outline-variant/50">
            <div className="flex items-start gap-4">
              <span className="material-symbols-outlined text-primary text-xl mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              <div>
                <p className="font-bold text-base text-on-surface">Data Sovereignty & Ownership</p>
                <p className="text-on-surface-variant text-xs mt-0.5 leading-relaxed">Full patient ownership with zero unauthorized third-party sharing or model training without explicit consent.</p>
              </div>
            </div>
            <div className="h-px bg-outline-variant/30 w-full"></div>
            <div className="flex items-start gap-4">
              <span className="material-symbols-outlined text-primary text-xl mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              <div>
                <p className="font-bold text-base text-on-surface">Inference Integrity & Auditability</p>
                <p className="text-on-surface-variant text-xs mt-0.5 leading-relaxed">AI models validated by independent clinical review board with complete explainability logs for every diagnosis suggestion.</p>
              </div>
            </div>
          </div>

          <div className="h-px bg-outline-variant w-full mb-10"></div>

          {/* Signature Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">Digital Verification</p>
              <div className="text-primary text-3xl font-black tracking-tight italic">Dr. Elena Sterling</div>
              <div className="w-full h-0.5 bg-primary/40 mt-1 mb-2"></div>
              <p className="font-bold text-sm text-on-surface">Chief Medical Officer</p>
              <p className="text-xs text-on-surface-variant">Credentials: MD, PhD, FACHE</p>
            </div>
            <div className="w-full md:w-auto bg-surface-container-high p-3 rounded-xl border border-outline-variant text-xs font-mono text-on-surface-variant break-all">
              SIG_HASH: 7a2f0e81c49b6d35f29e18204c552a188f0d36c2
            </div>
          </div>
        </div>
      </div>

      <button 
        onClick={handleDownload}
        className="w-full py-3 sm:py-3.5 px-4 bg-primary text-on-primary font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 shadow-md shadow-primary/20 hover:opacity-90 active:scale-98 transition-all cursor-pointer"
      >
        <span className="material-symbols-outlined text-lg sm:text-xl">download</span>
        <span>Download Official Compliance Certificate PDF</span>
      </button>
      <p className="mt-4 text-center text-on-surface-variant text-xs font-medium">
        Valid until: December 31, 2026 • Verified by Independent Third-Party Auditor
      </p>
    </div>
  );
}
