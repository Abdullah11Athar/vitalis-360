"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ForensicAnalysis() {
  const [role, setRole] = useState('doctor');
  const [approved, setApproved] = useState(false);
  const [filter, setFilter] = useState<'All' | 'Anomalies' | 'Verified' | 'Pending'>('All');
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);

  // Modals
  const [showDocRequestModal, setShowDocRequestModal] = useState(false);
  const [showFlagModal, setShowFlagModal] = useState(false);

  // Doc Request Form State
  const [docDoctor, setDocDoctor] = useState('Dr. Julian Vance (Cardiology)');
  const [docType, setDocType] = useState('Operative Note & Fluoroscopy Log');
  const [docUrgency, setDocUrgency] = useState('Stat Urgent (2h)');
  const [docNotes, setDocNotes] = useState('Please provide fluoroscopy timestamps to justify Level 4 complexity under CMS NCCI guidelines.');
  const [requestedDocInfo, setRequestedDocInfo] = useState<{ doctor: string; type: string; date: string } | null>(null);

  // Flag Modal Form State
  const [flagReason, setFlagReason] = useState('Severe Upcoding (Level 4 to Level 2)');
  const [flagCommittee, setFlagCommittee] = useState('Hospital Integrity & Compliance Board');
  const [flagNotes, setFlagNotes] = useState('Telemetry shows patient was hemodynamically stable within 18 minutes. Second stent was not deployed.');
  const [flaggedInfo, setFlaggedInfo] = useState<{ reason: string; committee: string; caseId: string } | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('vitalis_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        if (parsed.role) setRole(parsed.role.toLowerCase());
      } catch (e) {}
    }

    const savedState = localStorage.getItem('vitalis_forensic_claim_state');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        if (parsed.approved !== undefined) setApproved(parsed.approved);
        if (parsed.requestedDocInfo) setRequestedDocInfo(parsed.requestedDocInfo);
        if (parsed.flaggedInfo) setFlaggedInfo(parsed.flaggedInfo);
      } catch (e) {}
    }
  }, []);

  const saveClaimState = (updates: any) => {
    const current = {
      approved,
      requestedDocInfo,
      flaggedInfo,
      ...updates
    };
    localStorage.setItem('vitalis_forensic_claim_state', JSON.stringify(current));
  };

  const handleApprove = () => {
    setApproved(true);
    saveClaimState({ approved: true });
    window.dispatchEvent(new CustomEvent('show-toast', { detail: "✅ $3,850.00 in AI forensic adjustments committed to hospital revenue ledger!" }));
  };

  const submitDocRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const info = {
      doctor: docDoctor,
      type: docType,
      date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setRequestedDocInfo(info);
    saveClaimState({ requestedDocInfo: info });
    setShowDocRequestModal(false);
    window.dispatchEvent(new CustomEvent('show-toast', { detail: `📄 Documentation request for "${docType}" dispatched to ${docDoctor}!` }));
  };

  const submitFlag = (e: React.FormEvent) => {
    e.preventDefault();
    const caseId = 'HITL-' + Math.floor(1000 + Math.random() * 9000);
    const info = {
      reason: flagReason,
      committee: flagCommittee,
      caseId
    };
    setFlaggedInfo(info);
    saveClaimState({ flaggedInfo: info });
    setShowFlagModal(false);
    window.dispatchEvent(new CustomEvent('show-toast', { detail: `🚩 Claim escalated to ${flagCommittee} (Case #${caseId})!` }));
  };

  const prefix = role === 'doctor' ? '/portal/doctor' : role === 'staff' ? '/portal/staff' : '/portal/patient';

  const ledgerItems = [
    {
      id: 1,
      name: 'Medication: Heparin 5000U IV',
      desc: 'Code: J1644 • Timestamp: 14:22:10 • Qty: 2',
      amount: '$142.00',
      status: 'Verified Clean',
      type: 'Verified',
      statusColor: 'primary'
    },
    {
      id: 2,
      name: approved ? 'Imaging: Contrast Enhanced CT (AI Adjusted)' : 'Imaging: Contrast Enhanced CT',
      desc: approved 
        ? 'Code: 75600 • Reconciled under bundled rate • Dept: Radiology'
        : 'Code: 75600 • Missing Auth • Dept: Radiology',
      amount: approved ? '$850.00' : '$1,890.00',
      status: approved ? 'Reconciled & Cleared' : 'Flagged Anomaly',
      type: 'Anomalies',
      statusColor: approved ? 'primary' : 'error'
    },
    {
      id: 3,
      name: 'Standard Facility Fee (OR Suite 4)',
      desc: 'Code: G0378 • Auto-Matched with OR Log',
      amount: '$2,200.00',
      status: approved ? 'Adjudicated' : 'Pending Adjudication',
      type: 'Pending',
      statusColor: 'on-surface-variant'
    }
  ];

  const filteredItems = ledgerItems.filter(item => {
    if (filter === 'All') return true;
    if (filter === 'Anomalies') return item.type === 'Anomalies';
    if (filter === 'Verified') return item.type === 'Verified';
    if (filter === 'Pending') return item.type === 'Pending';
    return true;
  });

  return (
    <div className="py-6 px-4 md:px-8 max-w-5xl mx-auto w-full pb-60 md:pb-36">
      {/* Header Section */}
      <section className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-outline-variant pb-6">
        <div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
            <h1 className="font-headline-lg text-2xl md:text-3xl text-on-surface font-bold">Forensic Billing Analysis</h1>
            <span className={`font-label-sm text-[11px] sm:text-xs uppercase tracking-wider px-2.5 py-1 rounded-xl font-bold border whitespace-nowrap shrink-0 ${
              flaggedInfo 
                ? 'bg-error/15 text-error border-error/30 animate-pulse'
                : approved 
                  ? 'bg-primary/20 text-primary border-primary/30'
                  : 'bg-primary/10 text-primary border-primary/20'
            }`}>
              {flaggedInfo ? 'Senior Review Pending' : approved ? 'Reconciled & Locked' : 'Forensic Audit Active'}
            </span>
          </div>
          <p className="font-label-md text-sm text-on-surface-variant">Real-time AI reasoning engine and clinical-financial reconciliation</p>
        </div>
        <div className="flex gap-3">
          <Link href={`${prefix}/billing/ledger`} prefetch={true} className="px-4 py-2 bg-surface-container text-on-surface text-xs font-bold rounded-xl border border-outline-variant hover:bg-surface-container-high transition-all cursor-pointer">
            Ledger
          </Link>
          <Link href={`${prefix}/billing/claims`} prefetch={true} className="px-4 py-2 bg-surface-container text-on-surface text-xs font-bold rounded-xl border border-outline-variant hover:bg-surface-container-high transition-all cursor-pointer">
            Claims
          </Link>
        </div>
      </section>

      {/* Flag Alert Banner if Escalate was Triggered */}
      {flaggedInfo && (
        <section className="bg-error/10 border-2 border-error/40 rounded-2xl p-5 mb-6 shadow-md flex items-start justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-error/20 text-error flex items-center justify-center shrink-0 mt-0.5">
              <span className="material-symbols-outlined text-2xl">gavel</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-error uppercase tracking-wider">Formal Escalation Logged</span>
                <span className="text-[10px] bg-error text-white font-mono px-2 py-0.5 rounded-full font-bold">#{flaggedInfo.caseId}</span>
              </div>
              <h3 className="text-base font-bold text-on-surface mt-0.5">Escalated to {flaggedInfo.committee}</h3>
              <p className="text-xs text-on-surface-variant mt-1">Reason: <strong className="text-error">{flaggedInfo.reason}</strong> • Dispatched for manual senior human-in-the-loop review.</p>
            </div>
          </div>
          <button 
            onClick={() => { setFlaggedInfo(null); saveClaimState({ flaggedInfo: null }); }}
            className="text-xs text-on-surface-variant hover:text-on-surface font-bold px-3 py-1 bg-surface-container rounded-lg border border-outline-variant shrink-0 cursor-pointer"
          >
            Dismiss Alert
          </button>
        </section>
      )}

      {/* Doc Request Banner if Requested */}
      {requestedDocInfo && (
        <section className="bg-secondary-container/20 border-2 border-secondary/40 rounded-2xl p-5 mb-6 shadow-md flex items-start justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0 mt-0.5">
              <span className="material-symbols-outlined text-2xl">description</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-secondary uppercase tracking-wider">Clinical Documentation Pending</span>
                <span className="text-[10px] text-on-surface-variant font-medium">Sent at {requestedDocInfo.date}</span>
              </div>
              <h3 className="text-base font-bold text-on-surface mt-0.5">{requestedDocInfo.type}</h3>
              <p className="text-xs text-on-surface-variant mt-1">Request dispatched to <strong>{requestedDocInfo.doctor}</strong>. Claim holds pending physician verification.</p>
            </div>
          </div>
          <button 
            onClick={() => { setRequestedDocInfo(null); saveClaimState({ requestedDocInfo: null }); }}
            className="text-xs text-on-surface-variant hover:text-on-surface font-bold px-3 py-1 bg-surface-container rounded-lg border border-outline-variant shrink-0 cursor-pointer"
          >
            Clear Status
          </button>
        </section>
      )}

      {/* Claim Identification Header */}
      <section className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant mb-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-xs text-primary font-bold uppercase tracking-wider">Claim #VST-1182-90X</span>
          <h2 className="text-2xl font-black text-on-surface mt-1">Cardiovascular Intervention</h2>
          <p className="text-sm text-on-surface-variant mt-0.5">ICD-10-CM I21.3 • Patient: Robert Chen (#8821-XC)</p>
        </div>
        <div className="text-right flex flex-col items-end gap-1.5">
          <span className="text-xs text-on-surface-variant font-mono bg-surface-container px-3 py-1.5 rounded-lg border border-outline-variant/50">
            2h 14m elapsed in audit
          </span>
          {approved && (
            <span className="text-[11px] font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-lg border border-primary/25 whitespace-nowrap">
              ✓ Payer EDI 837 Transmission Sealed
            </span>
          )}
        </div>
      </section>

      {/* Bento Grid Analysis Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {/* Adjudication Probability Ring */}
        <div className="bg-surface-container-low rounded-2xl p-6 flex flex-col items-center justify-center gap-3 border border-outline-variant shadow-sm">
          <div className="relative w-28 h-28 rounded-full border-8 border-primary/20 flex items-center justify-center shadow-inner">
            <div className={`absolute inset-0 rounded-full border-8 ${approved ? 'border-primary' : 'border-primary border-t-transparent border-l-transparent -rotate-45 animate-pulse'}`}></div>
            <span className="font-headline-lg text-3xl font-black text-primary">{approved ? '99%' : '84%'}</span>
          </div>
          <div className="text-center mt-2">
            <span className="text-xs font-bold block text-on-surface-variant uppercase tracking-wider">Adjudication Probability</span>
            <span className="text-sm text-primary font-black">{approved ? '100% Validated Clean' : 'High Precision Match'}</span>
          </div>
        </div>

        {/* Financial Impact Summary */}
        <div className="bg-surface-container-low rounded-2xl p-6 flex flex-col justify-between border border-outline-variant shadow-sm">
          <div>
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Total Discrepancy</span>
            <div className={`text-3xl font-black mt-1 ${approved ? 'text-primary' : 'text-error'}`}>
              {approved ? '$0.00' : '-$4,210.00'}
            </div>
            {approved && <span className="text-[10px] text-primary font-bold uppercase">All Discrepancies Reconciled</span>}
          </div>
          <div className="mt-6 pt-4 border-t border-outline-variant/50">
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Recoverable via AI Intercept</span>
            <div className="text-2xl font-black text-primary mt-1">$3,850.00</div>
          </div>
        </div>

        {/* AI Reasoning Engine Highlights */}
        <div className="bg-surface-container-low rounded-2xl p-6 flex flex-col justify-between border border-outline-variant shadow-sm space-y-4">
          <div>
            <span className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
              <span className="material-symbols-outlined text-base">psychology</span> AI Reasoning Engine
            </span>
            <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">
              {approved 
                ? 'Clinical audit adjustments successfully applied. EMR vitals telemetry and ICD-10 cross-check verified.' 
                : 'Analyzed 1,420 EMR vitals telemetry data points against billed CPT codes. 2 discrepancies identified.'}
            </p>
          </div>
          <div className="bg-primary/10 border border-primary/20 rounded-xl p-3 text-xs text-primary font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">verified_user</span>
            {approved ? 'Adjustments Locked & Audited' : 'Automated Overrule Recommended'}
          </div>
        </div>
      </div>

      {/* Clinical-Financial Reconciliation Logic Cards */}
      <section className="space-y-4 mb-8">
        <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest px-1">Forensic Discrepancy Breakdown</h3>
        
        <div className="bg-surface-container rounded-2xl p-5 flex gap-4 items-start border border-outline-variant border-l-4 border-l-primary shadow-sm">
          <div className="bg-primary/20 p-2.5 rounded-xl text-primary">
            <span className="material-symbols-outlined text-xl">check_circle</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-4">
              <h4 className="font-bold text-sm sm:text-base text-on-surface">Upcoding Detection (CPT 92928)</h4>
              <span className="self-start sm:self-auto text-[11px] sm:text-xs font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-lg border border-primary/20 whitespace-nowrap shrink-0">+$2,100.00 Save</span>
            </div>
            <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed">
              Procedure 92928 mapped to severity level 4; AI suggests level 2 based on EMR vitals telemetry during intervention. Patient stabilized within 18 minutes without second stent deployment.
            </p>
          </div>
        </div>

        <div className={`bg-surface-container rounded-2xl p-5 flex gap-4 items-start border border-outline-variant border-l-4 shadow-sm ${approved ? 'border-l-primary' : 'border-l-error'}`}>
          <div className={`p-2.5 rounded-xl ${approved ? 'bg-primary/20 text-primary' : 'bg-error/20 text-error'}`}>
            <span className="material-symbols-outlined text-xl">{approved ? 'task_alt' : 'warning'}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-4">
              <h4 className="font-bold text-sm sm:text-base text-on-surface">Bundling Conflict (CPT 99233 + J1644)</h4>
              <span className={`self-start sm:self-auto text-[11px] sm:text-xs font-bold px-2.5 py-0.5 rounded-lg border whitespace-nowrap shrink-0 ${approved ? 'text-primary bg-primary/10 border-primary/20' : 'text-error bg-error/10 border-error/20'}`}>
                {approved ? '✓ Resolved via Bundled Rate' : '+$1,750.00 Save'}
              </span>
            </div>
            <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed">
              {approved 
                ? 'Routine heparin IV and oxygen administration bundled into primary DRG code. Double-dipping anomaly resolved.' 
                : 'Oxygen administration and routine heparin IV billed separately from primary surgical code. Potential double-dipping detected under Medicare bundling guidelines (NCCI Edits).'}
            </p>
          </div>
        </div>
      </section>

      {/* Forensic Audit Ledger */}
      <section className="space-y-3 mb-8">
        <div className="flex items-center justify-between px-1 relative">
          <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
            Itemized Audit Ledger ({filteredItems.length} items)
          </h3>
          <div className="flex items-center gap-2">
            {(['All', 'Anomalies', 'Verified', 'Pending'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  filter === tab 
                    ? 'bg-primary text-on-primary shadow-sm' 
                    : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          {filteredItems.map(item => (
            <div key={item.id} className="bg-surface-container-low rounded-xl p-4 border border-outline-variant flex items-center justify-between">
              <div>
                <p className="font-bold text-sm text-on-surface">{item.name}</p>
                <p className="text-xs text-on-surface-variant mt-0.5">{item.desc}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-sm text-on-surface">{item.amount}</p>
                <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase mt-0.5 ${
                  item.statusColor === 'primary' ? 'text-primary' : item.statusColor === 'error' ? 'text-error' : 'text-on-surface-variant'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${item.statusColor === 'primary' ? 'bg-primary' : item.statusColor === 'error' ? 'bg-error' : 'bg-outline'}`}></span>
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Floating Action Tray */}
      <div className="fixed bottom-[76px] sm:bottom-6 left-0 w-full px-3 sm:px-4 z-40 pointer-events-none flex justify-center">
        <div className="bg-surface-container-highest/95 backdrop-blur-md rounded-2xl p-2 sm:p-2.5 shadow-2xl flex items-center gap-1.5 sm:gap-3 border border-outline max-w-xl w-full pointer-events-auto">
          <button 
            onClick={handleApprove}
            disabled={approved}
            className={`flex-1 py-2.5 sm:py-3 px-2 sm:px-4 rounded-xl font-bold text-[11px] sm:text-xs flex items-center justify-center gap-1.5 sm:gap-2 transition-all shadow-md cursor-pointer ${
              approved ? 'bg-primary text-on-primary opacity-80' : 'bg-primary text-on-primary hover:opacity-90 active:scale-95'
            }`}
          >
            <span className="material-symbols-outlined text-base sm:text-lg shrink-0">{approved ? 'check_circle' : 'task_alt'}</span>
            <span className="truncate">{approved ? 'Submitted ✓' : 'Approve AI'}</span>
            <span className="hidden sm:inline">{approved ? '' : 'Adjustments'}</span>
          </button>
          
          <button 
            onClick={() => setShowDocRequestModal(true)}
            className="flex-1 bg-secondary-container text-on-secondary-container py-2.5 sm:py-3 px-2 sm:px-4 rounded-xl font-bold text-[11px] sm:text-xs flex items-center justify-center gap-1.5 sm:gap-2 hover:bg-surface-bright active:scale-95 transition-all cursor-pointer shadow-sm"
          >
            <span className="material-symbols-outlined text-base sm:text-lg shrink-0">description</span>
            <span className="truncate">Request Doc</span>
            <span className="hidden sm:inline">Clinical</span>
          </button>

          <button 
            onClick={() => setShowFlagModal(true)}
            title="Escalate to Senior Review Board"
            className="w-9 h-9 sm:w-11 sm:h-11 bg-error-container text-on-error-container rounded-xl flex items-center justify-center hover:opacity-90 active:scale-90 transition-all cursor-pointer shadow-sm shrink-0"
          >
            <span className="material-symbols-outlined text-base sm:text-lg">flag</span>
          </button>
        </div>
      </div>

      {/* Modal 1: Request Clinical Documentation */}
      {showDocRequestModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[200] flex items-center justify-center p-3 sm:p-4">
          <div className="bg-surface-container-low border border-outline-variant rounded-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto custom-scrollbar p-4 sm:p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-outline-variant/40">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-secondary-container text-on-secondary-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-xl">description</span>
                </div>
                <div>
                  <h3 className="font-bold text-base text-on-surface">Request Clinical Documentation</h3>
                  <p className="text-xs text-on-surface-variant">Dispatch direct requisition to treating physician</p>
                </div>
              </div>
              <button 
                onClick={() => setShowDocRequestModal(false)}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>

            <form onSubmit={submitDocRequest} className="space-y-4 mt-4">
              <div>
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1.5">Treating Clinician</label>
                <select 
                  value={docDoctor} 
                  onChange={(e) => setDocDoctor(e.target.value)}
                  className="w-full bg-surface-container text-on-surface text-sm p-3 rounded-xl border border-outline-variant focus:border-primary outline-none"
                >
                  <option value="Dr. Julian Vance (Cardiology)">Dr. Julian Vance (Cardiology Lead)</option>
                  <option value="Dr. Marcus Reed (Cardiovascular Surgery)">Dr. Marcus Reed (Cardiovascular Surgery)</option>
                  <option value="Nurse Station 4B (Telemetry Unit)">Nurse Station 4B (Telemetry Unit)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1.5">Required Clinical Artifact</label>
                <select 
                  value={docType} 
                  onChange={(e) => setDocType(e.target.value)}
                  className="w-full bg-surface-container text-on-surface text-sm p-3 rounded-xl border border-outline-variant focus:border-primary outline-none"
                >
                  <option value="Operative Note & Fluoroscopy Log">Operative Note & Fluoroscopy Log (CPT 92928)</option>
                  <option value="Pre-Authorization Form (Code 75600)">Pre-Authorization Form (Code 75600 - Contrast CT)</option>
                  <option value="Pharmacy IV Infusion Dispense Record">Pharmacy IV Infusion Dispense Record (Heparin J1644)</option>
                  <option value="Pathology & Catheterization Report">Pathology & Catheterization Report</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1.5">Requisition Urgency</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Standard (24h)', 'Stat Urgent (2h)'].map((u) => (
                    <button
                      key={u}
                      type="button"
                      onClick={() => setDocUrgency(u)}
                      className={`py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                        docUrgency === u 
                          ? 'border-primary bg-primary/10 text-primary' 
                          : 'border-outline-variant bg-surface-container text-on-surface-variant'
                      }`}
                    >
                      {u}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1.5">Auditor Clinical Notes</label>
                <textarea 
                  value={docNotes} 
                  onChange={(e) => setDocNotes(e.target.value)}
                  rows={3}
                  className="w-full bg-surface-container text-on-surface text-xs p-3 rounded-xl border border-outline-variant focus:border-primary outline-none resize-none"
                  placeholder="Explain why documentation is required..."
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  type="button"
                  onClick={() => setShowDocRequestModal(false)}
                  className="flex-1 py-3 bg-surface-container text-on-surface text-xs font-bold rounded-xl border border-outline-variant hover:bg-surface-container-high cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 bg-secondary-container text-on-secondary-container text-xs font-bold rounded-xl hover:opacity-90 shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">send</span>
                  <span>Dispatch Request</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Flag Claim for Senior Review */}
      {showFlagModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[200] flex items-center justify-center p-3 sm:p-4">
          <div className="bg-surface-container-low border border-error/40 rounded-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto custom-scrollbar p-4 sm:p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-outline-variant/40">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-error/20 text-error flex items-center justify-center">
                  <span className="material-symbols-outlined text-xl">flag</span>
                </div>
                <div>
                  <h3 className="font-bold text-base text-on-surface">Escalate to Senior HITL Board</h3>
                  <p className="text-xs text-error font-medium">Flag claim for human-in-the-loop compliance review</p>
                </div>
              </div>
              <button 
                onClick={() => setShowFlagModal(false)}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>

            <form onSubmit={submitFlag} className="space-y-4 mt-4">
              <div>
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1.5">Compliance Anomaly Reason</label>
                <select 
                  value={flagReason} 
                  onChange={(e) => setFlagReason(e.target.value)}
                  className="w-full bg-surface-container text-on-surface text-sm p-3 rounded-xl border border-outline-variant focus:border-error outline-none"
                >
                  <option value="Severe Upcoding (Level 4 to Level 2)">Severe Upcoding (Level 4 to Level 2 without medical basis)</option>
                  <option value="Unbundling & NCCI Edit Violation">Unbundling & NCCI Edit Violation (CPT 99233 + J1644)</option>
                  <option value="Missing Medical Necessity Authorization">Missing Medical Necessity Authorization (CT 75600)</option>
                  <option value="Suspected Fraudulent Billing Pattern">Suspected Fraudulent Billing Pattern</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1.5">Target Committee</label>
                <select 
                  value={flagCommittee} 
                  onChange={(e) => setFlagCommittee(e.target.value)}
                  className="w-full bg-surface-container text-on-surface text-sm p-3 rounded-xl border border-outline-variant focus:border-error outline-none"
                >
                  <option value="Hospital Integrity & Compliance Board">Hospital Integrity & Compliance Board</option>
                  <option value="Chief Medical Officer (CMO) Review">Chief Medical Officer (CMO) Review</option>
                  <option value="External Third-Party Payer Ombudsman">External Third-Party Payer Ombudsman</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1.5">Auditor Justification Memo</label>
                <textarea 
                  value={flagNotes} 
                  onChange={(e) => setFlagNotes(e.target.value)}
                  rows={3}
                  className="w-full bg-surface-container text-on-surface text-xs p-3 rounded-xl border border-outline-variant focus:border-error outline-none resize-none"
                  placeholder="Enter detailed audit justification..."
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  type="button"
                  onClick={() => setShowFlagModal(false)}
                  className="flex-1 py-3 bg-surface-container text-on-surface text-xs font-bold rounded-xl border border-outline-variant hover:bg-surface-container-high cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 bg-error text-white text-xs font-bold rounded-xl hover:opacity-90 shadow-md flex items-center justify-center gap-1.5 cursor-pointer shadow-error/20"
                >
                  <span className="material-symbols-outlined text-base">report</span>
                  <span>Confirm Escalation</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
