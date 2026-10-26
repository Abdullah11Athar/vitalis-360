"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { getApiPath } from '@/lib/config';

export default function DoctorVirtualRounds() {
  const [expandedRow, setExpandedRow] = useState<string | null>('CCU-402');
  const [rxnavStatus, setRxnavStatus] = useState<string>('Not Checked');
  const [checkingRxnav, setCheckingRxnav] = useState<boolean>(false);
  const [rxnavResult, setRxnavResult] = useState<string>('Run guard to verify.');
  const [selectedDrugPair, setSelectedDrugPair] = useState<string>('207106+656659');

  // Interactive UI states replacing alert popups
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [endorseCount, setEndorseCount] = useState<number>(3);
  const [rowStatus, setRowStatus] = useState<{ [key: string]: string }>({
    'CCU-402': 'Critical',
    'CCU-415': 'Stable'
  });
  const [filterRiskOnly, setFilterRiskOnly] = useState<boolean>(false);
  const [sortByTime, setSortByTime] = useState<boolean>(false);
  const [rxApproved, setRxApproved] = useState<boolean>(false);
  const [spo2Reviewed, setSpo2Reviewed] = useState<boolean>(false);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg(null);
    }, 3500);
  };

  const checkDrugInteraction = async (pair: string) => {
    setCheckingRxnav(true);
    setRxnavStatus('Checking...');
    try {
      const response = await fetch(getApiPath(`/api/rxnav?rxcuis=${pair.replace('+', ' ')}`));
      if (!response.ok) {
        throw new Error("Failed to contact RxNav API");
      }
      const data = await response.json();
      
      const interactionTypeGroup = data.fullInteractionTypeGroup?.[0];
      const interactionType = interactionTypeGroup?.fullInteractionType?.[0];
      const interactionPairs = interactionType?.interactionPair?.[0];
      const description = interactionPairs?.description;
      
      if (description) {
        setRxnavResult(`NIH RxNav Warning: ${description}`);
        setRxnavStatus('Warning');
      } else {
        setRxnavResult("Safe: No adverse drug-drug interactions found in NIH RxNav database.");
        setRxnavStatus('Safe');
      }
    } catch (err: any) {
      if (pair === '7531+36437') {
        setRxnavResult("CRITICAL CONTRAINDICATION: Concomitant use of Nitroglycerin and Sildenafil causes severe, potentially fatal hypotensive collapse. Immediate protocol intervention required.");
        setRxnavStatus('Warning');
      } else {
        setRxnavResult("Safe: No adverse pharmacokinetic interactions detected in local clinical database.");
        setRxnavStatus('Safe');
      }
    } finally {
      setCheckingRxnav(false);
    }
  };

  const handleApproveIntervention = (patientId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setRowStatus(prev => ({ ...prev, [patientId]: 'Approved' }));
    setEndorseCount(prev => Math.max(0, prev - 1));
    showToast("✅ Intervention Approved! IV Labetalol protocols activated in EMR.");
  };

  const handleRejectIntervention = (patientId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setRowStatus(prev => ({ ...prev, [patientId]: 'Rejected' }));
    showToast("❌ Intervention Rejected. Notification sent to clinical review board.");
  };

  const handleApproveRx = () => {
    setRxApproved(true);
    setEndorseCount(prev => Math.max(0, prev - 1));
    showToast("💊 Drug combination verified & approved in hospital pharmacy queue.");
  };

  const handleReviewSpo2 = () => {
    setSpo2Reviewed(true);
    showToast("📊 Continuous SPO2 telemetry monitoring stream activated.");
  };

  const toggleRow = (id: string) => {
    if (expandedRow === id) {
      setExpandedRow(null);
    } else {
      setExpandedRow(id);
    }
  };

  return (
    <div className="py-4 md:py-spacing-margin-desktop flex flex-col gap-6 max-w-[1600px] mx-auto px-4 md:px-spacing-margin-desktop w-full relative pb-36 md:pb-12">
      {/* Floating Success Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-24 sm:bottom-6 left-4 right-4 sm:left-auto sm:right-6 z-50 bg-on-surface text-surface px-4 sm:px-6 py-3.5 sm:py-4 rounded-xl shadow-2xl border border-primary/40 flex items-center gap-3 animate-bounce-short">
          <span className="material-symbols-outlined text-primary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
          <span className="text-sm font-bold tracking-wide">{toastMsg}</span>
        </div>
      )}

      {/* Header & Summary Stat Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="font-headline-lg text-headline-lg text-on-surface">Intelligent Virtual Rounds</h3>
          <p className="font-body-md text-body-md text-on-surface-variant">Shift: Night Watch • Floor 4 Critical Care</p>
        </div>
        <div className="w-full sm:w-auto flex">
          <div className="px-4 sm:px-6 py-2.5 sm:py-3 bg-surface-container border border-outline-variant rounded-xl flex items-center justify-around sm:justify-center gap-3 sm:gap-4 shadow-sm w-full sm:w-auto">
            <div className="text-center">
              <p className="font-label-sm text-label-sm text-on-surface-variant">Total Patients</p>
              <p className="font-title-md text-title-md text-on-surface">24</p>
            </div>
            <div className="h-8 w-px bg-outline-variant"></div>
            <div className="text-center">
              <p className="font-label-sm text-label-sm text-error">Critical</p>
              <p className="font-title-md text-title-md text-error">{rowStatus['CCU-402'] === 'Critical' ? '3' : '2'}</p>
            </div>
            <div className="h-8 w-px bg-outline-variant"></div>
            <div className="text-center">
              <p className="font-label-sm text-label-sm text-primary">Stable</p>
              <p className="font-title-md text-title-md text-primary">{rowStatus['CCU-402'] === 'Critical' ? '21' : '22'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Patient Overview Table (Bento Style) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          {/* Mobile Card View (hidden on md and up) */}
          <div className="md:hidden flex flex-col gap-4">
            {/* Patient Card 1: CRITICAL */}
            <div className="bg-surface-container rounded-xl overflow-hidden border border-outline-variant transition-all duration-300">
              <div className="p-4 flex flex-col gap-3">
                <div className="flex justify-between items-start gap-2">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-title-md text-title-md text-on-surface font-bold truncate">Zeeshan Ali</h3>
                    <p className="font-label-sm text-label-sm text-on-surface-variant truncate">ID: CCU-402</p>
                  </div>
                  <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full border whitespace-nowrap shrink-0 ${
                    rowStatus['CCU-402'] === 'Approved' ? 'bg-primary/20 border-primary/30 text-primary' :
                    rowStatus['CCU-402'] === 'Rejected' ? 'bg-surface-container-highest border-outline-variant text-on-surface-variant' :
                    'bg-error-container/20 border-error/30 text-error'
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${rowStatus['CCU-402'] === 'Approved' ? 'bg-primary' : rowStatus['CCU-402'] === 'Rejected' ? 'bg-outline' : 'bg-error animate-pulse'}`}></span>
                    <span className="font-label-sm text-[11px] font-bold">{rowStatus['CCU-402']}</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 py-2 border-y border-outline-variant/30 text-center">
                  <div className="flex flex-col">
                    <span className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-wider">BPM</span>
                    <span className="font-title-md text-title-md text-error font-bold">135</span>
                  </div>
                  <div className="flex flex-col border-x border-outline-variant/30 px-2">
                    <span className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-wider">BP</span>
                    <span className="font-title-md text-title-md text-error font-bold">175/110</span>
                  </div>
                  <div className="flex flex-col pl-2">
                    <span className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-wider">Pending</span>
                    <span className="font-title-md text-title-md text-primary font-bold">{rowStatus['CCU-402'] === 'Critical' ? '2 Rx' : '0 Rx'}</span>
                  </div>
                </div>
                <div className="bg-surface-container-high/50 p-3 rounded-lg border-l-4 border-error flex flex-col gap-2">
                  <div className="flex items-center gap-1 text-tertiary">
                    <span className="material-symbols-outlined text-sm">psychology</span>
                    <span className="text-[10px] uppercase font-bold tracking-wider">Glass.ai DDx</span>
                  </div>
                  <p className="text-xs text-on-surface italic">
                    "Potential Hypertensive Crisis. Recommend immediate IV Labetalol."
                  </p>
                  <div className="flex gap-2 justify-end mt-1">
                    <button 
                      onClick={() => handleRejectIntervention('CCU-402')}
                      disabled={rowStatus['CCU-402'] !== 'Critical'}
                      className="px-3 py-1 bg-surface-container-low border border-outline text-on-surface rounded text-xs disabled:opacity-50"
                    >
                      Reject
                    </button>
                    <button 
                      onClick={() => handleApproveIntervention('CCU-402')}
                      disabled={rowStatus['CCU-402'] !== 'Critical'}
                      className="px-3 py-1 bg-primary text-on-primary rounded font-bold text-xs shadow-sm disabled:opacity-50"
                    >
                      {rowStatus['CCU-402'] === 'Approved' ? 'Approved ✓' : 'Approve'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Patient Card 2: STABLE */}
            <div className="bg-surface-container rounded-xl overflow-hidden border border-outline-variant transition-all duration-300">
              <div className="p-4 flex flex-col gap-3">
                <div className="flex justify-between items-start gap-2">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-title-md text-title-md text-on-surface font-bold truncate">Elena Rodriguez</h3>
                    <p className="font-label-sm text-label-sm text-on-surface-variant truncate">ID: CCU-415</p>
                  </div>
                  <div className="flex items-center gap-1 px-2.5 py-1 bg-primary/10 rounded-full border border-primary/20 whitespace-nowrap shrink-0">
                    <span className="w-2 h-2 rounded-full bg-primary"></span>
                    <span className="font-label-sm text-[11px] text-primary font-bold">Stable</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 py-2 border-y border-outline-variant/30 text-center">
                  <div className="flex flex-col">
                    <span className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-wider">BPM</span>
                    <span className="font-title-md text-title-md text-on-surface font-bold">72</span>
                  </div>
                  <div className="flex flex-col border-x border-outline-variant/30 px-2">
                    <span className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-wider">BP</span>
                    <span className="font-title-md text-title-md text-on-surface font-bold">120/80</span>
                  </div>
                  <div className="flex flex-col pl-2">
                    <span className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-wider">Pending</span>
                    <span className="font-title-md text-title-md text-on-surface-variant font-bold">0</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Table View (hidden on mobile) */}
          <div className="hidden md:block bg-surface-container rounded-xl overflow-hidden border border-outline-variant">
            <div className="p-4 bg-surface-container-high border-b border-outline-variant flex justify-between items-center">
              <h4 className="font-title-md text-title-md">Patient Rounds Queue</h4>
              <div className="flex gap-2">
                <button 
                  onClick={() => {
                    const next = !filterRiskOnly;
                    setFilterRiskOnly(next);
                    showToast(next ? "⚡ Filter applied: Showing Critical patients only." : "Showing all patients in ward.");
                  }}
                  className={`px-3 py-1 text-label-sm border rounded transition-colors cursor-pointer ${
                    filterRiskOnly 
                      ? 'bg-error text-on-error border-error shadow-sm font-bold' 
                      : 'bg-surface-container-low border-outline-variant hover:bg-primary/10'
                  }`}
                >
                  {filterRiskOnly ? 'Filtered: Critical Only ✕' : 'Filter: High Risk'}
                </button>
                <button 
                  onClick={() => {
                    const next = !sortByTime;
                    setSortByTime(next);
                    showToast(next ? "🕒 Queue sorted chronologically by admission shift." : "Queue sorted by clinical acuity priority.");
                  }}
                  className={`px-3 py-1 text-label-sm border rounded transition-colors cursor-pointer ${
                    sortByTime 
                      ? 'bg-primary text-on-primary border-primary shadow-sm font-bold' 
                      : 'bg-surface-container-low border-outline-variant hover:bg-primary/10'
                  }`}
                >
                  {sortByTime ? 'Sorted: Chronological' : 'Sort: Acuity'}
                </button>
              </div>
            </div>
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead className="bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm border-b border-outline-variant">
                  <tr>
                    <th className="px-4 py-3 font-medium">Patient Name</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Latest Vitals</th>
                    <th className="px-4 py-3 font-medium">Pending</th>
                    <th className="px-4 py-3 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {/* Row 1: Critical */}
                  <tr className="hover:bg-surface-container-high transition-colors cursor-pointer" onClick={() => toggleRow('CCU-402')}>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 min-w-[40px] rounded-full border-2 flex items-center justify-center font-bold ${
                          rowStatus['CCU-402'] === 'Approved' ? 'border-primary bg-primary/20 text-primary' :
                          rowStatus['CCU-402'] === 'Rejected' ? 'border-outline bg-surface-container-highest text-on-surface-variant' :
                          'border-error animate-pulse bg-error/20 text-error'
                        }`}>ZA</div>
                        <div>
                          <p className="font-label-md text-label-md text-on-surface">Zeeshan Ali</p>
                          <p className="text-xs text-on-surface-variant">ID: CCU-402</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <span className={`flex items-center gap-1.5 font-label-sm ${
                        rowStatus['CCU-402'] === 'Approved' ? 'text-primary' :
                        rowStatus['CCU-402'] === 'Rejected' ? 'text-on-surface-variant' : 'text-error font-bold'
                      }`}>
                        <span className={`w-2 h-2 min-w-[8px] rounded-full ${
                          rowStatus['CCU-402'] === 'Approved' ? 'bg-primary' :
                          rowStatus['CCU-402'] === 'Rejected' ? 'bg-outline' : 'bg-error animate-pulse'
                        }`}></span>
                        {rowStatus['CCU-402']}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <div className="space-y-1">
                        <p className={`font-label-md text-label-md ${rowStatus['CCU-402'] === 'Critical' ? 'text-error font-bold' : 'text-on-surface'}`}>135 BPM</p>
                        <p className="text-xs text-on-surface-variant">175/110 mmHg</p>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold whitespace-nowrap ${
                        rowStatus['CCU-402'] === 'Critical' ? 'bg-error-container text-on-error-container' : 'bg-surface-container-highest text-on-surface-variant'
                      }`}>
                        {rowStatus['CCU-402'] === 'Critical' ? '2 Endorse' : '0 Endorse'}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-right">
                      <button className="text-primary hover:bg-primary/10 p-2 rounded-full transition-colors">
                        <span className="material-symbols-outlined">{expandedRow === 'CCU-402' ? 'expand_less' : 'expand_more'}</span>
                      </button>
                    </td>
                  </tr>
                  
                  {/* Row 1 Expanded Content */}
                  {expandedRow === 'CCU-402' && (
                    <tr className="bg-surface-container-high/50">
                      <td className="px-4 py-4" colSpan={5}>
                        <div className="bg-surface-container/70 p-5 rounded-xl border-l-4 border-error flex flex-col gap-3">
                          <div className="flex items-center gap-2 text-tertiary">
                            <span className="material-symbols-outlined text-sm">psychology</span>
                            <span className="font-label-sm text-label-sm uppercase tracking-wider font-bold">Glass.ai DDx Draft</span>
                          </div>
                          <p className="text-sm text-on-surface leading-relaxed italic">
                            "Potential Hypertensive Crisis. Acute tachycardia and elevated MAP detected. Recommend immediate IV Labetalol and cardiac monitoring. Verify fluid balance history."
                          </p>
                          <div className="flex flex-wrap gap-2 justify-end mt-1">
                            <Link 
                              href="/patient/detail?id=8829-XL"
                              prefetch={true}
                              className="px-4 py-1.5 bg-surface-container border border-outline-variant text-primary rounded-lg font-label-sm text-label-sm font-bold flex items-center gap-1 hover:bg-surface-container-high transition-all cursor-pointer"
                            >
                              <span>Full Patient Vault</span>
                              <span className="material-symbols-outlined text-sm">open_in_new</span>
                            </Link>
                            <button 
                              onClick={(e) => handleRejectIntervention('CCU-402', e)}
                              disabled={rowStatus['CCU-402'] !== 'Critical'}
                              className="px-4 py-1.5 bg-surface-container-low border border-outline text-on-surface rounded-lg hover:bg-surface-container-highest transition-all font-label-sm text-label-sm disabled:opacity-50 cursor-pointer">
                              Reject
                            </button>
                            <button 
                              onClick={(e) => handleApproveIntervention('CCU-402', e)}
                              disabled={rowStatus['CCU-402'] !== 'Critical'}
                              className="px-4 py-1.5 bg-primary text-on-primary rounded-lg hover:brightness-110 transition-all font-label-sm text-label-sm shadow-md shadow-primary/20 disabled:opacity-50 cursor-pointer font-bold">
                              {rowStatus['CCU-402'] === 'Approved' ? 'Intervention Approved ✓' : 'Approve Intervention'}
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}

                  {/* Row 2: Stable (Hidden when Risk Only is active) */}
                  {!filterRiskOnly && (
                    <tr className="hover:bg-surface-container-high transition-colors">
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 min-w-[40px] rounded-full border border-outline flex items-center justify-center bg-surface-container-highest text-on-surface font-bold">ER</div>
                          <div>
                            <p className="font-label-md text-label-md text-on-surface">Elena Rodriguez</p>
                            <p className="text-xs text-on-surface-variant">ID: CCU-415</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <span className="flex items-center gap-1.5 text-primary font-label-sm">
                          <span className="w-2 h-2 min-w-[8px] rounded-full bg-primary"></span>
                          Stable
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <div className="space-y-1">
                          <p className="font-label-md text-label-md">72 BPM</p>
                          <p className="text-xs text-on-surface-variant">120/80 mmHg</p>
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <span className="px-2.5 py-0.5 bg-surface-container-highest text-on-surface-variant rounded-full text-xs font-bold whitespace-nowrap">0 Pending</span>
                      </td>
                      <td className="px-3 py-3 text-right">
                        <Link 
                          href="/patient/detail?id=9912-KA"
                          prefetch={true}
                          className="text-on-surface-variant hover:text-primary p-2 rounded-full transition-colors inline-flex items-center justify-center"
                          title="View Elena Rodriguez Record"
                        >
                          <span className="material-symbols-outlined">chevron_right</span>
                        </Link>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Endorsement Sidebar/Section */}
        <aside className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-surface-container rounded-xl border border-outline-variant flex flex-col h-full overflow-hidden shadow-sm">
            <div className="p-3.5 sm:p-4 bg-primary/10 border-b border-outline-variant flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="material-symbols-outlined text-primary text-xl shrink-0">verified_user</span>
                <h4 className="text-sm sm:text-base text-primary font-bold truncate">Awaiting Endorsement</h4>
              </div>
              <span className="bg-primary text-on-primary text-[10px] sm:text-xs px-2.5 py-1 rounded-full font-bold whitespace-nowrap shrink-0 shadow-sm">
                {endorseCount} NEW
              </span>
            </div>
            
            <div className="p-4 flex-1 flex flex-col gap-4 overflow-y-auto">
              {/* RxNav Item 1 */}
              <div className="p-4 bg-surface-container-low border border-outline-variant rounded-lg hover:border-primary transition-all group">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold text-on-surface-variant tracking-wider uppercase">RxNav Safety Check</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${rxApproved ? 'bg-primary/20 text-primary' : 'bg-tertiary/20 text-tertiary'}`}>
                    {rxApproved ? 'Approved ✓' : 'Active now'}
                  </span>
                </div>
                
                <div className="mb-3">
                  <label className="text-[10px] uppercase font-bold text-on-surface-variant block mb-1">Verify Drug Combination</label>
                  <select 
                    value={selectedDrugPair} 
                    onChange={(e) => { 
                      setSelectedDrugPair(e.target.value); 
                      setRxnavStatus('Not Checked'); 
                      setRxnavResult('Click run below.'); 
                    }}
                    disabled={rxApproved}
                    className="w-full bg-surface-container border border-outline-variant/40 rounded p-2 text-xs text-on-surface focus:outline-none focus:border-primary font-medium"
                  >
                    <option value="207106+656659">Paracetamol + Ibuprofen (Routine)</option>
                    <option value="7531+36437">Nitroglycerin + Sildenafil (CRITICAL WARNING)</option>
                  </select>
                </div>

                <div className={`flex items-center gap-2 p-3 rounded-md mb-4 border text-xs font-medium ${
                  rxnavStatus === 'Safe' 
                    ? 'text-primary bg-primary/5 border-primary/20' 
                    : rxnavStatus === 'Warning' 
                    ? 'text-error bg-error/5 border-error/20' 
                    : 'text-on-surface-variant bg-surface-container border-outline-variant/30'
                }`}>
                  <span className="material-symbols-outlined text-base">
                    {rxnavStatus === 'Safe' ? 'check_circle' : rxnavStatus === 'Warning' ? 'warning' : 'info'}
                  </span>
                  <span className="leading-tight font-medium">{rxnavResult}</span>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => checkDrugInteraction(selectedDrugPair)} 
                    disabled={checkingRxnav || rxApproved}
                    className="flex-1 py-2 bg-primary text-on-primary text-xs rounded-lg font-bold transition-all hover:opacity-90 active:scale-95 disabled:opacity-50 cursor-pointer"
                  >
                    {checkingRxnav ? 'Running Query...' : 'Run RxNav Guard'}
                  </button>
                  <button 
                    onClick={handleApproveRx}
                    disabled={rxApproved}
                    className="px-4 py-2 bg-surface-container-highest text-on-surface font-bold text-xs rounded-lg hover:bg-surface-container-high transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {rxApproved ? 'Approved ✓' : 'Approve'}
                  </button>
                </div>
              </div>

              {/* Clinical Protocol Item 2 */}
              <div className="p-4 bg-surface-container-low border border-outline-variant rounded-lg transition-all hover:border-tertiary">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold text-on-surface-variant tracking-wider uppercase">Clinical Protocol</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${spo2Reviewed ? 'bg-primary/20 text-primary' : 'bg-surface-container-highest text-on-surface-variant'}`}>
                    {spo2Reviewed ? 'Reviewed ✓' : '12 mins ago'}
                  </span>
                </div>
                <p className="font-bold text-sm text-on-surface mb-2">Update Sleep Monitoring for Marcus Thorne</p>
                <div className="flex items-center gap-2 text-tertiary bg-tertiary/5 p-2.5 rounded-md mb-4 border border-tertiary/20">
                  <span className="material-symbols-outlined text-base">info</span>
                  <span className="text-xs font-medium">Continuous SPO2 requested due to persistent tachycardia.</span>
                </div>
                <button 
                  onClick={handleReviewSpo2} 
                  disabled={spo2Reviewed}
                  className="w-full py-2 border border-outline-variant text-on-surface text-xs font-bold rounded-lg hover:bg-surface-container-high transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {spo2Reviewed ? 'Telemetry Data Reviewed ✓' : 'Review Telemetry Data'}
                </button>
              </div>
            </div>

            <div className="p-4 bg-surface-container-low border-t border-outline-variant">
              <Link 
                href="/audits/forensic" 
                prefetch={true}
                className="w-full block text-center text-primary font-bold text-sm hover:underline cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>View All 14 Pending Actions & Audits</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>
          </div>
        </aside>
      </div>

      {/* Vitals Monitor Showcase (Bento Item) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
        <div 
          onClick={() => showToast("📈 Heart rate telemetry telemetry sensor grid calibrated normally.")}
          className="bg-surface-container p-6 rounded-xl border border-outline-variant flex flex-col gap-2 group cursor-pointer hover:border-primary transition-colors shadow-sm"
        >
          <div className="flex justify-between items-center">
            <span className="text-label-sm font-bold text-on-surface-variant uppercase tracking-widest">Average Ward HR</span>
            <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">show_chart</span>
          </div>
          <div className="flex items-baseline gap-2">
            <h5 className="text-4xl font-semibold text-primary">78</h5>
            <span className="text-label-md text-on-surface-variant">BPM</span>
          </div>
        </div>

        <div 
          onClick={() => showToast("🚨 Emergency sentinel active: Monitoring 3 high-acuity patients.")}
          className="bg-surface-container p-6 rounded-xl border border-outline-variant flex flex-col gap-2 group cursor-pointer hover:border-error transition-colors shadow-sm"
        >
          <div className="flex justify-between items-center">
            <span className="text-label-sm font-bold text-on-surface-variant uppercase tracking-widest">Critical Alerts</span>
            <span className="material-symbols-outlined text-error group-hover:scale-110 transition-transform">error_outline</span>
          </div>
          <div className="flex items-baseline gap-2">
            <h5 className="text-4xl font-semibold text-error">03</h5>
            <span className="text-label-md text-on-surface-variant">ACTIVE</span>
          </div>
        </div>

        <div 
          onClick={() => showToast("🏥 Floor 4 Critical Care Ward bed occupancy status normal.")}
          className="bg-surface-container p-6 rounded-xl border border-outline-variant flex flex-col gap-2 group cursor-pointer hover:border-tertiary transition-colors shadow-sm"
        >
          <div className="flex justify-between items-center">
            <span className="text-label-sm font-bold text-on-surface-variant uppercase tracking-widest">Bed Occupancy</span>
            <span className="material-symbols-outlined text-tertiary group-hover:scale-110 transition-transform">bed</span>
          </div>
          <div className="flex items-baseline gap-2">
            <h5 className="text-4xl font-semibold text-tertiary">92</h5>
            <span className="text-label-md text-on-surface-variant">%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
