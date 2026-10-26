"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getApiPath } from '@/lib/config';

export default function BillingLedger() {
  const [role, setRole] = useState('Doctor');
  const [outstanding, setOutstanding] = useState(142.50);
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [processing, setProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [declineCode, setDeclineCode] = useState<string | null>(null);
  const [stripeReceipt, setStripeReceipt] = useState<{
    paymentIntentId: string;
    chargeId: string;
    amount: number;
    status: string;
    date: string;
  } | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("vitalis_user");
    if (saved) {
      const u = JSON.parse(saved);
      setRole(u.role);
    }
  }, []);

  const handleFillTestCard = () => {
    setCardNumber('4242 4242 4242 4242');
    setExpiry('12/28');
    setCvv('123');
    setPaymentError(null);
    setDeclineCode(null);
    window.dispatchEvent(new CustomEvent('show-toast', { detail: "💳 Prefilled valid Stripe test card (Visa 4242)" }));
  };

  const handleFillLowBalanceCard = () => {
    setCardNumber('4000 0000 0000 9995');
    setExpiry('12/28');
    setCvv('123');
    setPaymentError(null);
    setDeclineCode(null);
    window.dispatchEvent(new CustomEvent('show-toast', { detail: "⚠️ Prefilled Stripe Low Balance test card (4000...9995)" }));
  };

  const handleFillDeclinedCard = () => {
    setCardNumber('4000 0000 0000 0002');
    setExpiry('12/28');
    setCvv('123');
    setPaymentError(null);
    setDeclineCode(null);
    window.dispatchEvent(new CustomEvent('show-toast', { detail: "🚫 Prefilled Stripe Generic Declined test card (4000...0002)" }));
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    setPaymentError(null);
    setDeclineCode(null);

    try {
      // Real Stripe PaymentIntent via secure server endpoint passing user card details
      const response = await fetch(getApiPath('/api/stripe/payment'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: outstanding,
          patientName: 'Zeeshan Ali',
          patientId: '8829-XL',
          cardNumber,
          expiry,
          cvv
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        const errorMsg = data.error || 'Stripe payment authorization failed';
        setPaymentError(errorMsg);
        setDeclineCode(data.decline_code || null);
        throw new Error(errorMsg);
      }

      setStripeReceipt({
        paymentIntentId: data.paymentIntentId,
        chargeId: data.chargeId || data.paymentIntentId,
        amount: data.amount,
        status: data.status,
        date: new Date().toLocaleString()
      });

      // Dispatch WhatsApp confirmation
      const msg = `🚨 [VITALIS-360] Stripe Payment Confirmed! Received $${data.amount.toFixed(2)} from Zeeshan Ali. Stripe Ref: ${data.paymentIntentId}. Account balance is clear.`;
      
      fetch(getApiPath('/api/whatsapp'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: '+923000000000', message: msg })
      }).catch(() => {});

      setOutstanding(0);
      window.dispatchEvent(new CustomEvent('show-toast', { detail: `💳 Stripe Payment Authorized! Ref: ${data.paymentIntentId}` }));
    } catch (err: any) {
      window.dispatchEvent(new CustomEvent('show-toast', { detail: "❌ " + err.message }));
    } finally {
      setProcessing(false);
    }
  };

  const handleDownloadReceipt = () => {
    if (!stripeReceipt) return;
    const content = `======================================================
VITALIS-360 STRIPE PAYMENT RECEIPT
======================================================
Stripe Payment Intent: ${stripeReceipt.paymentIntentId}
Stripe Charge ID: ${stripeReceipt.chargeId}
Timestamp: ${stripeReceipt.date}
Status: ${stripeReceipt.status.toUpperCase()}
Amount Paid: $${stripeReceipt.amount.toFixed(2)} USD
Patient: Zeeshan Ali (#8829-XL)
Ward: Telemetry Ward 4B

PAYMENT GATEWAY SPECIFICATIONS:
- Gateway Provider: Stripe Inc. (Production/Test)
- Cryptographic Tokenization: 256-bit TLS / PCI DSS Level 1
- Settlement Status: Reconciled with Hospital EMR Ledger
======================================================`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Stripe_Receipt_${stripeReceipt.paymentIntentId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    window.dispatchEvent(new CustomEvent('show-toast', { detail: "📥 Stripe receipt downloaded!" }));
  };

  const claims = [
    { id: 1, provider: 'Blue Cross Shield', amount: '$1,420.00', score: 98, status: 'Success', initials: 'JD', bg: 'bg-secondary-container text-on-secondary-container', bar: 'bg-primary' },
    { id: 2, provider: 'Aetna Private', amount: '$850.50', score: 82, status: 'Pending', initials: 'MS', bg: 'bg-tertiary-container text-on-tertiary-container', bar: 'bg-tertiary' },
    { id: 3, provider: 'Medicare Part B', amount: '$2,105.00', score: 45, status: 'High Risk', initials: 'RK', bg: 'bg-secondary-container text-on-secondary-container', bar: 'bg-error' },
    { id: 4, provider: 'UnitedHealth Group', amount: '$630.00', score: 94, status: 'Success', initials: 'BL', bg: 'bg-tertiary-container text-on-tertiary-container', bar: 'bg-primary' }
  ];

  if (role === 'Patient') {
    return (
      <div className="py-6 px-4 md:px-8 max-w-2xl mx-auto w-full pb-36 md:pb-12">
        <section className="mb-8 border-b border-outline-variant pb-6">
          <p className="font-label-md text-xs text-primary uppercase tracking-wider font-bold">Patient Billing Portal</p>
          <h1 className="font-headline-lg text-2xl md:text-3xl text-on-surface font-black">My Billing Ledger</h1>
        </section>

        {outstanding > 0 ? (
          <div className="space-y-6 animate-pulse-soft">
            <div className="bg-surface-container-low border border-outline-variant p-6 rounded-2xl flex justify-between items-center shadow-sm">
              <div>
                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Patient Balance Due</p>
                <p className="text-3xl font-black text-primary mt-1">${outstanding.toFixed(2)}</p>
                <p className="text-[10px] text-on-surface-variant mt-0.5">Copay for clinical rounds on July 5, 2026</p>
              </div>
              <span className="material-symbols-outlined text-primary text-4xl">payments</span>
            </div>

            <div className="bg-surface-container-low border border-outline-variant p-6 rounded-2xl shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-4 border-b border-outline-variant/40 pb-3">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-on-surface">Secure Copay Payment</h3>
                  <p className="text-[10px] text-emerald-400 font-bold flex items-center gap-1 mt-0.5">
                    <span className="material-symbols-outlined text-xs">lock</span>
                    PCI-DSS Level 1 Encrypted via Stripe API
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <button
                    type="button"
                    onClick={handleFillTestCard}
                    className="px-2.5 py-1 bg-surface-container hover:bg-surface-container-highest text-primary font-bold text-[10px] rounded-lg border border-primary/30 transition-colors"
                  >
                    ⚡ Success (4242)
                  </button>
                  <button
                    type="button"
                    onClick={handleFillLowBalanceCard}
                    className="px-2.5 py-1 bg-surface-container hover:bg-surface-container-highest text-amber-400 font-bold text-[10px] rounded-lg border border-amber-400/30 transition-colors"
                  >
                    ⚠️ Low Balance (9995)
                  </button>
                  <button
                    type="button"
                    onClick={handleFillDeclinedCard}
                    className="px-2.5 py-1 bg-surface-container hover:bg-surface-container-highest text-error font-bold text-[10px] rounded-lg border border-error/30 transition-colors"
                  >
                    🚫 Issuer Decline (0002)
                  </button>
                </div>
              </div>

              {/* Real-time Stripe Error Banner */}
              {paymentError && (
                <div className="mb-4 p-4 bg-error-container/20 border border-error/50 rounded-xl text-error text-xs flex items-start gap-3 animate-pulse">
                  <span className="material-symbols-outlined text-xl shrink-0 mt-0.5">error</span>
                  <div className="flex-1">
                    <p className="font-bold text-sm">Payment Declined</p>
                    <p className="mt-0.5 text-on-surface font-medium">{paymentError}</p>
                    {declineCode && (
                      <span className="inline-block mt-1.5 font-mono text-[10px] bg-error/20 text-error px-2 py-0.5 rounded border border-error/30 font-bold">
                        Stripe Reason Code: {declineCode}
                      </span>
                    )}
                  </div>
                </div>
              )}

              <form onSubmit={handlePayment} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">Card Number</label>
                  <input 
                    type="text" 
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full bg-surface-container border border-outline-variant/40 rounded-xl p-3 text-xs text-on-surface focus:outline-none focus:border-primary placeholder:text-on-surface-variant/40 font-mono"
                    placeholder="4242 4242 4242 4242"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">Expiry Date</label>
                    <input 
                      type="text" 
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      className="w-full bg-surface-container border border-outline-variant/40 rounded-xl p-3 text-xs text-on-surface focus:outline-none focus:border-primary placeholder:text-on-surface-variant/40 font-mono"
                      placeholder="MM/YY"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">CVV</label>
                    <input 
                      type="password" 
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      className="w-full bg-surface-container border border-outline-variant/40 rounded-xl p-3 text-xs text-on-surface focus:outline-none focus:border-primary placeholder:text-on-surface-variant/40 font-mono"
                      placeholder="123"
                      maxLength={4}
                      required
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={processing}
                  className="w-full py-3 sm:py-3.5 px-4 bg-primary text-on-primary font-bold text-xs sm:text-sm rounded-xl shadow-md cursor-pointer transition-all disabled:opacity-50 mt-4 hover:opacity-90 active:scale-98 flex items-center justify-center gap-2"
                >
                  {processing ? (
                    <>
                      <span className="material-symbols-outlined text-sm animate-spin">sync</span>
                      <span>Processing Stripe Payment...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-sm">credit_card</span>
                      <span>Authorize Payment of ${outstanding.toFixed(2)} via Stripe</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="bg-surface-container p-8 rounded-3xl border border-outline-variant/50 text-center space-y-4">
            <span className="material-symbols-outlined text-primary text-5xl">check_circle</span>
            <div>
              <h3 className="font-bold text-lg text-on-surface">Your Account is Clear</h3>
              <p className="text-xs text-on-surface-variant mt-1">Outstanding copay balance is $0.00. Thank you for your payment!</p>
            </div>
            {stripeReceipt && (
              <div className="bg-surface-container-high p-4 rounded-2xl border border-outline-variant/60 max-w-sm mx-auto text-left space-y-2 text-xs">
                <div className="flex justify-between border-b border-outline-variant/30 pb-2">
                  <span className="text-on-surface-variant font-bold">Stripe Payment ID</span>
                  <span className="font-mono text-primary font-bold">{stripeReceipt.paymentIntentId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant font-bold">Amount Settled</span>
                  <span className="text-on-surface font-bold">${stripeReceipt.amount.toFixed(2)} USD</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant font-bold">EMR Status</span>
                  <span className="text-emerald-400 font-bold">Reconciled</span>
                </div>
                <button
                  onClick={handleDownloadReceipt}
                  className="w-full mt-3 py-2.5 bg-primary/20 hover:bg-primary/30 text-primary border border-primary/40 font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">download</span>
                  <span>Download Official Stripe Receipt</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="py-6 px-4 md:px-8 max-w-6xl mx-auto w-full pb-36 md:pb-12">
      {/* Header Section */}
      <section className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-outline-variant pb-6">
        <div>
          <p className="font-label-md text-xs text-primary uppercase tracking-wider font-bold">Revenue Cycle Health</p>
          <h1 className="font-headline-lg text-2xl md:text-3xl text-on-surface font-black">Clinical Billing Ledger</h1>
        </div>
        <div className="flex gap-3">
          <Link href="/billing/claims" prefetch={true} className="px-4 py-2 bg-surface-container text-on-surface text-xs font-bold rounded-xl border border-outline-variant hover:bg-surface-container-high transition-all cursor-pointer">
            Claims Tracking
          </Link>
          <Link href="/billing/analysis" prefetch={true} className="px-4 py-2 bg-surface-container text-on-surface text-xs font-bold rounded-xl border border-outline-variant hover:bg-surface-container-high transition-all cursor-pointer">
            Forensic Analysis
          </Link>
        </div>
      </section>

      {/* Bento Grid Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="md:col-span-1 bg-surface-container-low p-6 rounded-2xl border border-outline-variant flex flex-col justify-between shadow-sm">
          <div>
            <p className="font-label-sm text-xs text-on-surface-variant uppercase font-bold mb-1">Total Outstanding Revenue</p>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <span className="font-headline-lg text-2xl md:text-3xl font-black text-primary">$142,850.20</span>
              <span className="text-[10px] text-primary font-bold bg-primary/10 px-2 py-0.5 rounded-lg border border-primary/25 shrink-0 whitespace-nowrap">+4.2%</span>
            </div>
          </div>
          <div className="mt-6 h-14 w-full flex items-end gap-1.5">
            <div className="bg-primary/20 w-full h-[40%] rounded-t"></div>
            <div className="bg-primary/20 w-full h-[60%] rounded-t"></div>
            <div className="bg-primary/40 w-full h-[30%] rounded-t"></div>
            <div className="bg-primary/60 w-full h-[80%] rounded-t"></div>
            <div className="bg-primary w-full h-[100%] rounded-t shadow-sm shadow-primary/30 animate-pulse"></div>
          </div>
        </div>

        <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant flex flex-col justify-between shadow-sm">
          <div>
            <p className="font-label-sm text-xs text-on-surface-variant uppercase font-bold mb-1">Avg Lifecycle</p>
            <p className="font-title-md text-3xl font-black text-on-surface">18.4 Days</p>
          </div>
          <p className="text-xs text-on-surface-variant mt-4 flex items-center gap-1 font-medium bg-surface-container px-3 py-2 rounded-lg w-fit">
            <span className="material-symbols-outlined text-sm text-primary">arrow_downward</span> 2 days faster than last mo.
          </p>
        </div>

        <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant flex flex-col justify-between shadow-sm">
          <div>
            <p className="font-label-sm text-xs text-on-surface-variant uppercase font-bold mb-1">Denial Rate</p>
            <p className="font-title-md text-3xl font-black text-error">3.12%</p>
          </div>
          <p className="text-xs text-on-surface-variant mt-4 flex items-center gap-1 font-medium bg-surface-container px-3 py-2 rounded-lg w-fit">
            <span className="material-symbols-outlined text-sm text-primary">check_circle</span> Within safe AI threshold
          </p>
        </div>
      </div>

      {/* Recent Claims Activity */}
      <section className="mb-8 bg-surface-container-low p-6 rounded-2xl border border-outline-variant shadow-sm">
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-outline-variant/50">
          <h2 className="font-title-md text-xl text-on-surface font-bold">Recent Claims Activity</h2>
          <Link href="/billing/claims" className="text-primary font-bold text-xs hover:underline flex items-center gap-1 cursor-pointer">
            View All Claims <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {claims.map((claim) => (
            <div key={claim.id} className="flex items-center gap-4 p-4 bg-surface-container rounded-xl border border-outline-variant/40 hover:border-primary/50 transition-all">
              <div className={`w-12 h-12 rounded-full ${claim.bg} flex items-center justify-center font-black text-sm shadow-sm`}>
                {claim.initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <p className="font-bold text-sm text-on-surface truncate">{claim.provider}</p>
                  <p className="font-black text-sm text-on-surface">{claim.amount}</p>
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-on-surface-variant">
                    <span className="font-medium">Sentinel AI Score</span>
                    <span className={`font-bold ${claim.status === 'Success' ? 'text-primary' : claim.status === 'High Risk' ? 'text-error' : 'text-secondary'}`}>
                      {claim.score}% ({claim.status})
                    </span>
                  </div>
                  <div className="h-1.5 bg-background rounded-full overflow-hidden w-full">
                    <div className={`h-full ${claim.bar} rounded-full transition-all duration-500`} style={{ width: `${claim.score}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="flex justify-end w-full">
        <button 
          onClick={() => window.dispatchEvent(new CustomEvent('show-toast', { detail: "📊 Generating comprehensive clinical financial ledger audit report..." }))}
          className="w-full sm:w-auto px-6 py-3 bg-primary text-on-primary font-bold rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all cursor-pointer text-xs"
        >
          <span className="material-symbols-outlined text-base shrink-0">description</span>
          <span>Generate Financial Health Report</span>
        </button>
      </div>
    </div>
  );
}
