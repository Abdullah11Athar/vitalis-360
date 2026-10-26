"use client";
import React, { useState } from 'react';
import Link from 'next/link';

export default function BillingClaims() {
  const [filter, setFilter] = useState('Pending');
  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});
  const [claimsList, setClaimsList] = useState([
    {
      id: 'CLM-99281-X',
      patient: 'Sarah J. | Orthopedics',
      amount: '$12,450.00',
      risk: 98,
      riskLabel: '98% Risk',
      anomaly: 'Double Billing',
      latency: '2.4h since entry',
      color: 'border-l-error text-error bg-error/10',
      btnBg: 'bg-error-container text-on-error-container',
      icon: 'warning',
      status: 'Pending'
    },
    {
      id: 'CLM-88342-A',
      patient: 'Michael K. | Oncology',
      amount: '$4,200.00',
      risk: 42,
      riskLabel: '42% Risk',
      anomaly: 'Upcoding Suspected',
      latency: '1.1h since entry',
      color: 'border-l-secondary text-secondary bg-secondary/10',
      btnBg: 'bg-secondary-container text-on-secondary-container',
      icon: 'pending_actions',
      status: 'Pending'
    },
    {
      id: 'CLM-77621-C',
      patient: 'Robert L. | Cardiology',
      amount: '$890.50',
      risk: 2,
      riskLabel: '2% Risk',
      anomaly: 'None Detected',
      latency: '15m since entry',
      color: 'border-l-primary text-primary bg-primary/10',
      btnBg: 'bg-surface-container-high text-on-surface border border-outline-variant',
      icon: 'check_circle',
      status: 'Processed'
    }
  ]);

  const handleAction = (claimId: string, isForensic: boolean) => {
    setLoadingMap(prev => ({ ...prev, [claimId]: true }));
    setTimeout(() => {
      setClaimsList(prev => prev.map(c => {
        if (c.id === claimId) {
          if (isForensic) {
            return {
              ...c,
              status: 'Flagged',
              risk: 100,
              riskLabel: '100% Risk - Flagged',
              color: 'border-l-error text-error bg-error/15',
              anomaly: 'Forensic Audit Active',
              btnBg: 'bg-error text-on-error'
            };
          } else {
            return {
              ...c,
              status: 'Processed',
              risk: 0,
              riskLabel: '0% Risk - Clean',
              color: 'border-l-primary text-primary bg-primary/10',
              anomaly: 'Audit Passed Clean',
              btnBg: 'bg-surface-container-high text-on-surface border border-outline-variant',
              icon: 'check_circle'
            };
          }
        }
        return c;
      }));
      setLoadingMap(prev => ({ ...prev, [claimId]: false }));
    }, 1000);
  };

  const filteredClaims = claimsList.filter(c => {
    if (filter === 'Pending') return c.status === 'Pending';
    if (filter === 'Processed') return c.status === 'Processed';
    if (filter === 'Flagged') return c.status === 'Flagged' || c.risk > 30;
    if (filter === 'Archived') return c.status === 'Archived';
    return true;
  });

  const getPendingCount = () => claimsList.filter(c => c.status === 'Pending').length;
  const getFlaggedCount = () => claimsList.filter(c => c.status === 'Flagged' || c.risk > 30).length;

  return (
    <div className="py-6 px-4 md:px-8 max-w-6xl mx-auto w-full pb-36 md:pb-12">
      {/* Header Section */}
      <section className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-outline-variant pb-6">
        <div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
            <h1 className="font-headline-lg text-2xl md:text-3xl text-on-surface font-bold">Claims Tracking & Forensic Dashboard</h1>
            <span className="font-label-sm text-[11px] sm:text-xs text-primary uppercase tracking-wider bg-primary/10 px-2.5 py-1 rounded-xl font-bold border border-primary/20 whitespace-nowrap shrink-0">
              Audit Cycle: #442-A
            </span>
          </div>
          <p className="font-label-md text-sm text-on-surface-variant">Real-time claims monitoring and automated AI fraud interception</p>
        </div>
        <div className="flex gap-3">
          <Link href="/billing/ledger" className="px-4 py-2 bg-surface-container text-on-surface text-xs font-bold rounded-xl border border-outline-variant hover:bg-surface-container-high transition-all">
            Back to Ledger
          </Link>
          <Link href="/billing/analysis" className="px-4 py-2 bg-primary text-on-primary text-xs font-bold rounded-xl shadow-md hover:opacity-90 transition-all">
            Forensic Analysis
          </Link>
        </div>
      </section>

      {/* Forensic Overview Card */}
      <div className="bg-surface-container-low rounded-2xl p-6 border border-outline-variant mb-8 flex flex-col md:flex-row justify-between items-center gap-6 shadow-sm">
        <div className="flex items-center gap-6">
          <div className="text-center md:text-left">
            <span className="block text-3xl md:text-4xl font-black text-primary">842</span>
            <span className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mt-1">Total Scanned</span>
          </div>
          <div className="h-12 w-px bg-outline-variant"></div>
          <div className="text-center md:text-left">
            <span className="block text-3xl md:text-4xl font-black text-error">12</span>
            <span className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mt-1">Critical Intercepts</span>
          </div>
          <div className="h-12 w-px bg-outline-variant hidden md:block"></div>
          <div className="text-center md:text-left hidden md:block">
            <span className="block text-3xl md:text-4xl font-black text-tertiary">$1.2M</span>
            <span className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mt-1">Recovered / Mo</span>
          </div>
        </div>
        
        <div className="px-3.5 py-1.5 bg-primary/10 border border-primary/30 rounded-xl flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse shrink-0"></span>
          <span className="text-primary font-bold text-xs whitespace-nowrap">Autonomous System Guard Active</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {[
          { key: 'Pending', label: `Pending (${getPendingCount()})` },
          { key: 'Processed', label: 'Processed' },
          { key: 'Flagged', label: `Flagged (${getFlaggedCount()})` },
          { key: 'Archived', label: 'Archived' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              filter === tab.key
                ? 'bg-primary text-on-primary shadow-sm' 
                : 'bg-surface-container text-on-surface-variant hover:text-on-surface border border-outline-variant'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Claims List */}
      <section className="space-y-4 mb-8">
        <h2 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest px-1">High Priority Intercepts</h2>
        
        {filteredClaims.length === 0 ? (
          <div className="bg-surface-container rounded-2xl p-8 border border-outline-variant text-center text-on-surface-variant text-sm font-medium">
            No claims in this category.
          </div>
        ) : (
          filteredClaims.map((claim) => {
            const isLoading = loadingMap[claim.id];
            return (
              <div key={claim.id} className={`bg-surface-container rounded-2xl p-5 border border-outline-variant border-l-4 ${claim.color.split(' ')[0]} space-y-4 hover:shadow-md transition-all relative overflow-hidden`}>
                {isLoading && (
                  <div className="absolute inset-0 bg-background/70 backdrop-blur-[1px] flex items-center justify-center z-10 gap-2.5">
                    <span className="material-symbols-outlined text-primary text-2xl animate-spin">sync</span>
                    <span className="text-xs font-bold text-on-surface">Auditing Block Transaction...</span>
                  </div>
                )}
                
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-surface-container-high flex items-center justify-center border border-outline-variant shrink-0">
                      <span className={`material-symbols-outlined text-xl sm:text-2xl ${claim.color.split(' ')[1]}`}>
                        {claim.icon}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-title-md text-base sm:text-lg text-on-surface font-bold truncate">{claim.id}</h3>
                      <p className="font-label-sm text-xs text-on-surface-variant truncate">{claim.patient}</p>
                    </div>
                  </div>
                  <div className="flex items-center sm:flex-col justify-between sm:items-end gap-1 border-t sm:border-t-0 pt-2 sm:pt-0 border-outline-variant/30">
                    <p className="font-title-md text-lg sm:text-xl font-black text-on-surface">{claim.amount}</p>
                    <span className={`inline-block px-2.5 py-0.5 rounded-lg text-[10px] sm:text-[11px] font-bold border whitespace-nowrap ${claim.color}`}>
                      {claim.riskLabel}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 py-2 bg-surface-container-low p-3 rounded-xl border border-outline-variant/50">
                  <div>
                    <span className="block text-[10px] uppercase text-on-surface-variant font-bold">Anomaly Type</span>
                    <span className="block font-bold text-sm text-on-surface mt-0.5">{claim.anomaly}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase text-on-surface-variant font-bold">Latency</span>
                    <span className="block font-bold text-sm text-on-surface mt-0.5">{claim.latency}</span>
                  </div>
                </div>

                <div className="flex gap-3 pt-1">
                  <button 
                    onClick={() => handleAction(claim.id, claim.risk > 50)}
                    className={`flex-1 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${claim.btnBg} hover:opacity-90 active:scale-95 cursor-pointer`}
                  >
                    <span className="material-symbols-outlined text-base">policy</span>
                    {claim.risk > 50 ? 'Forensic Action' : 'Mark as Clean'}
                  </button>
                  <button className="w-12 h-12 bg-surface-container-high rounded-xl flex items-center justify-center border border-outline-variant hover:bg-surface-bright transition-colors cursor-pointer">
                    <span className="material-symbols-outlined text-on-surface-variant">more_vert</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </section>

      {/* Stats Micro-bento */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-surface-container-low rounded-2xl p-5 border border-outline-variant flex flex-col justify-between h-32 shadow-sm">
          <span className="material-symbols-outlined text-primary">savings</span>
          <div>
            <p className="text-2xl font-black text-on-surface">$1.2M</p>
            <p className="text-xs text-on-surface-variant font-medium">Recovered / Mo</p>
          </div>
        </div>
        <div className="bg-surface-container-low rounded-2xl p-5 border border-outline-variant flex flex-col justify-between h-32 shadow-sm">
          <span className="material-symbols-outlined text-tertiary">bolt</span>
          <div>
            <p className="text-2xl font-black text-on-surface">0.8s</p>
            <p className="text-xs text-on-surface-variant font-medium">Audit Latency</p>
          </div>
        </div>
        <div className="bg-surface-container-low rounded-2xl p-5 border border-outline-variant flex flex-col justify-between h-32 shadow-sm">
          <span className="material-symbols-outlined text-secondary">verified</span>
          <div>
            <p className="text-2xl font-black text-on-surface">99.4%</p>
            <p className="text-xs text-on-surface-variant font-medium">Accuracy Rate</p>
          </div>
        </div>
        <div className="bg-surface-container-low rounded-2xl p-5 border border-outline-variant flex flex-col justify-between h-32 shadow-sm">
          <span className="material-symbols-outlined text-error">gavel</span>
          <div>
            <p className="text-2xl font-black text-on-surface">0</p>
            <p className="text-xs text-on-surface-variant font-medium">Legal Escalations</p>
          </div>
        </div>
      </section>
    </div>
  );
}
