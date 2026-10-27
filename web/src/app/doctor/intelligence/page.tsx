"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getApiPath } from '@/lib/config';

interface AIResult {
  summary: string;
  icd10Code: string;
  icd10Desc: string;
  confidence: string;
  proposedOrders: Array<{ name: string; type: string }>;
  billingImpact: number;
}

export default function ClinicalIntelligence() {
  const [inputText, setInputText] = useState(
    "Patient presents with recurring abdominal pain localized in the right lower quadrant, persistent for 48 hours. Intensity reported at 7/10. No rebound tenderness noted on physical examination. Patient denies nausea or vomiting. History of appendectomy ruled out."
  );
  const [isLoading, setIsLoading] = useState(false);
  const [aiResult, setAiResult] = useState<AIResult | null>({
    summary: "Acute right-lower quadrant abdominal pain. Differential diagnosis includes unspecified gastroenteritis vs. localized inflammatory response. Suggest diagnostic imaging.",
    icd10Code: "R10.31",
    icd10Desc: "Right lower quadrant pain",
    confidence: "99%",
    proposedOrders: [
      { name: "CT Abdomen & Pelvis (w/ Contrast)", type: "Stat Request" },
      { name: "CBC w/ Differential", type: "Routine Panel" }
    ],
    billingImpact: 1420
  });
  const [submittedModal, setSubmittedModal] = useState<{
    show: boolean;
    encounterId: string;
    code: string;
    revenue: number;
  } | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('vitalis_clinical_draft');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.inputText) setInputText(parsed.inputText);
        if (parsed.aiResult) setAiResult(parsed.aiResult);
      } catch (e) {
        // ignore
      }
    }
  }, []);

  const handleSaveDraft = () => {
    localStorage.setItem(
      'vitalis_clinical_draft',
      JSON.stringify({
        inputText,
        aiResult,
        savedAt: new Date().toISOString()
      })
    );
    window.dispatchEvent(
      new CustomEvent('show-toast', {
        detail: "💾 Clinical draft saved successfully to local EMR cache!"
      })
    );
  };

  const handleSubmitEncounter = () => {
    if (!aiResult) return;
    const encounterId = `ENC-${Math.floor(100000 + Math.random() * 900000)}`;
    const newEncounter = {
      id: encounterId,
      date: new Date().toLocaleDateString(),
      icd10: aiResult.icd10Code,
      description: aiResult.icd10Desc,
      orders: aiResult.proposedOrders,
      revenueImpact: aiResult.billingImpact,
      status: 'Synchronized'
    };

    const existing = JSON.parse(localStorage.getItem('vitalis_submitted_encounters') || '[]');
    existing.unshift(newEncounter);
    localStorage.setItem('vitalis_submitted_encounters', JSON.stringify(existing));

    setSubmittedModal({
      show: true,
      encounterId,
      code: `${aiResult.icd10Code} (${aiResult.icd10Desc})`,
      revenue: aiResult.billingImpact
    });

    window.dispatchEvent(
      new CustomEvent('show-toast', {
        detail: `✅ Encounter #${encounterId} submitted to EMR & billing ledger!`
      })
    );
  };

  const runAnalysis = async (textToAnalyze: string) => {
    setIsLoading(true);
    try {
      const prompt = `You are an expert AI Clinical Guardian and Medical Orchestrator. 
Analyze the following patient clinical transcript or transcription feed:
"${textToAnalyze}"

Provide a structured clinical analysis in JSON format. The response must be a valid JSON object matching this schema exactly:
{
  "summary": "Concise professional clinical summary of findings and differential diagnoses",
  "icd10Code": "The primary matched ICD-10 code (e.g. R10.31, I10)",
  "icd10Desc": "Short official description of the ICD-10 code",
  "confidence": "Confidence percentage (e.g. 96%)",
  "proposedOrders": [
    { "name": "Name of proposed lab or imaging order", "type": "e.g. Stat Request or Routine Panel" }
  ],
  "billingImpact": 1200
}

Ensure the output contains ONLY valid JSON and no markdown formatting wrappers.`;

      const response = await fetch(getApiPath('/api/gemini'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to call Gemini API');
      }

      // Parse JSON from reply (removing any potential markdown code blocks if present)
      let cleanedReply = data.reply.trim();
      if (cleanedReply.startsWith('```')) {
        cleanedReply = cleanedReply.replace(/^```json\s*/i, '').replace(/```$/, '').trim();
      }

      const parsed: AIResult = JSON.parse(cleanedReply);
      setAiResult(parsed);
    } catch (err: any) {
      window.dispatchEvent(new CustomEvent('show-toast', { detail: "❌ Error analyzing transcript: " + err.message }));
    } finally {
      setIsLoading(false);
    }
  };

  const templates = [
    {
      label: "Febrile Bronchitis (Umar)",
      text: "Patient Umar Farooq presents with persistent productive cough, bilateral bronchial rhonchi, and acute pyrexia with core temperature spiking to 102.4°F. Chest auscultation indicates bronchial inflammation without dense consolidation."
    },
    {
      label: "Acute Appendicitis (Sadia)",
      text: "Patient Sadia Khan presents with severe localized right lower quadrant pain, positive McBurney's sign, localized muscular guarding, and elevated WBC at 16.8k. Suspected acute surgical appendicitis."
    },
    {
      label: "Migraine with Aura (Tani)",
      text: "Patient Tani Tariq reports severe unilateral pulsating hemicranial pain preceded by visual scintillating scotoma (aura), marked photophobia, and nausea. Neurological reflexes intact."
    },
    {
      label: "Acute Chest Pain (STEMI)",
      text: "Patient presents with crushing substernal chest pain radiating to left shoulder and jaw, initiated 30 minutes ago. Diaphoretic, SpO2 is 92% on room air. History of coronary artery disease. EKG shows ST elevation in leads V1-V4."
    },
    {
      label: "Hypertensive Crisis",
      text: "Patient reports severe throbbing headache, visual disturbances, and acute chest tightness. Blood pressure is extremely elevated at 210/120 mmHg. Cardiac telemetry shows sinus tachycardia at 115 bpm. No focal neurological deficits."
    }
  ];

  return (
    <div className="py-6 px-4 md:px-8 max-w-7xl mx-auto w-full pb-36 md:pb-12">
      {/* Header */}
      <section className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-outline-variant pb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
            <span className="material-symbols-outlined text-2xl">auto_awesome</span>
          </div>
          <div>
            <h1 className="font-headline-lg text-2xl md:text-3xl text-on-surface font-bold">AI Clinical Intelligence</h1>
            <p className="text-xs text-on-surface-variant font-medium mt-0.5">Real-time medical transcription analysis & automated ICD-10 coding</p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2.5">
          {templates.map((tpl, i) => (
            <button
              key={i}
              onClick={() => { setInputText(tpl.text); runAnalysis(tpl.text); }}
              className="px-3.5 py-2 bg-surface-container text-on-surface text-xs font-bold rounded-xl border border-outline-variant hover:bg-surface-container-high transition-all active:scale-95 shadow-sm"
            >
              {tpl.label}
            </button>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Live Transcription & Voice Controls */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <section className="bg-surface-container-low rounded-2xl p-4 sm:p-6 border border-outline-variant flex flex-col shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-base text-on-surface uppercase tracking-wider">Clinical Transcript Feed</h2>
              <span className="text-xs text-on-surface-variant bg-surface-container px-2.5 py-1 rounded-md font-mono">Input Editor</span>
            </div>
            
            <textarea
              className="w-full bg-surface-container p-4 rounded-xl text-sm md:text-base leading-relaxed text-on-surface border border-outline-variant/50 focus:outline-none focus:border-primary placeholder:text-on-surface-variant/50 min-h-[220px] resize-y font-medium"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type or paste medical encounter notes here to run AI analysis..."
            />

            <div className="flex gap-3 mt-4">
              <button 
                onClick={() => setInputText("")}
                className="px-4 py-3 bg-surface-container hover:bg-surface-container-high text-on-surface font-bold text-xs rounded-xl border border-outline-variant transition-colors"
              >
                Clear Input
              </button>
              <button 
                onClick={() => runAnalysis(inputText)}
                disabled={isLoading || !inputText.trim()}
                className="flex-1 py-3 bg-primary text-on-primary font-bold text-xs rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-primary/20 animate-pulse-soft"
              >
                <span className="material-symbols-outlined text-base">psychology</span>
                <span>{isLoading ? "Running AI Diagnostic Synthesis..." : "Analyze with Gemini"}</span>
              </button>
            </div>
          </section>
        </div>

        {/* Right Column: AI Analysis & Extraction Results */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <section className="bg-surface-container-low rounded-2xl p-4 sm:p-6 border border-outline-variant flex flex-col shadow-sm relative min-h-[400px]">
            {isLoading && (
              <div className="absolute inset-0 bg-background/70 backdrop-blur-sm z-20 flex flex-col items-center justify-center gap-3 rounded-2xl">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <span className="text-xs font-bold text-primary uppercase tracking-widest animate-pulse">Running AI Clinician Engine...</span>
              </div>
            )}

            <div className="flex items-center gap-3 mb-6 border-b border-outline-variant/50 pb-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                <span className="material-symbols-outlined text-xl">neurology</span>
              </div>
              <h2 className="font-bold text-base text-on-surface uppercase tracking-wider">Gemini Clinical Extraction</h2>
            </div>

            {aiResult ? (
              <div className="space-y-6 flex-1">
                {/* Summary Card */}
                <div className="bg-surface-container p-5 rounded-2xl border border-outline-variant/30 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-tertiary uppercase tracking-wider flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-base">summarize</span>
                      CLINICAL SUMMARY
                    </span>
                    <button 
                      onClick={() => { navigator.clipboard.writeText(aiResult.summary); window.dispatchEvent(new CustomEvent('show-toast', { detail: "📋 Clinical summary copied to clipboard!" })); }}
                      className="text-on-surface-variant hover:text-primary transition-all active:scale-90 cursor-pointer"
                      title="Copy Summary"
                    >
                      <span className="material-symbols-outlined text-base">content_copy</span>
                    </button>
                  </div>
                  <p className="text-sm font-medium text-on-surface leading-relaxed italic">
                    &ldquo;{aiResult.summary}&rdquo;
                  </p>
                </div>

                {/* ICD-10 Coding Bento */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-primary/10 border border-primary/20 rounded-2xl p-5 flex flex-col justify-center hover:bg-primary/20 transition-all cursor-pointer">
                    <span className="text-[10px] uppercase tracking-widest text-primary font-black mb-1">ICD-10 Primary</span>
                    <div className="text-3xl font-black text-on-surface">{aiResult.icd10Code}</div>
                    <div className="text-xs text-on-surface-variant mt-1.5 leading-tight font-bold">{aiResult.icd10Desc}</div>
                  </div>
                  <div className="bg-surface-container border border-outline-variant rounded-2xl p-5 flex flex-col justify-center">
                    <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-black mb-1">AI Confidence</span>
                    <div className="text-3xl font-black text-primary">{aiResult.confidence}</div>
                    <div className="text-xs text-on-surface-variant mt-1.5 leading-tight font-bold">Validated mapping</div>
                  </div>
                </div>

                {/* Proposed Orders */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-secondary uppercase tracking-wider flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-base">assignment</span> PROPOSED ORDERS
                  </h3>
                  <div className="space-y-2">
                    {aiResult.proposedOrders.map((order, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 bg-surface-container rounded-xl border border-outline-variant/30 border-l-4 border-l-primary hover:bg-surface-container-high transition-colors">
                        <div>
                          <p className="text-sm font-bold text-on-surface">{order.name}</p>
                          <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mt-0.5">{order.type}</p>
                        </div>
                        <span className="material-symbols-outlined text-primary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Billing & Revenue Impact */}
                <div className="p-4 sm:p-5 rounded-2xl bg-tertiary/10 border border-tertiary/20 flex flex-col sm:flex-row justify-between sm:items-end gap-3 shadow-sm">
                  <div>
                    <span className="text-[10px] font-bold text-tertiary uppercase tracking-wider block mb-1">Projected Revenue Cycle Impact</span>
                    <p className="text-2xl sm:text-3xl font-black text-on-surface leading-none">${aiResult.billingImpact}</p>
                    <p className="text-[10px] text-on-surface-variant mt-1.5 font-bold uppercase tracking-wider">Estimated Encumbrance</p>
                  </div>
                  <div className="flex sm:flex-col items-start sm:items-end justify-between sm:justify-start gap-1">
                    <span className="text-[11px] sm:text-xs font-bold bg-primary/10 text-primary border border-primary/20 px-2.5 py-1 rounded-lg whitespace-nowrap shrink-0">+12% vs. Baseline</span>
                    <p className="text-[10px] text-on-surface-variant mt-0.5 sm:mt-2 font-bold uppercase tracking-wider">Audit Optimization: Level 4</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 opacity-60">
                <span className="material-symbols-outlined text-5xl text-on-surface-variant mb-3">psychology_alt</span>
                <p className="text-sm font-medium">No active analysis. Click &ldquo;Analyze with Gemini&rdquo; to begin.</p>
              </div>
            )}

            <div className="pt-4 sm:pt-6 mt-4 sm:mt-6 border-t border-outline-variant/50 flex flex-col sm:flex-row gap-2.5 sm:gap-3">
              <button 
                onClick={handleSaveDraft}
                className="w-full sm:flex-1 py-3 sm:py-3.5 px-4 bg-surface-container hover:bg-surface-container-high text-on-surface font-bold text-xs sm:text-sm rounded-xl border border-outline-variant transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-base shrink-0">save</span>
                <span className="whitespace-nowrap">Save Draft</span>
              </button>
              <button 
                onClick={handleSubmitEncounter}
                disabled={!aiResult}
                className="w-full sm:flex-1 py-3 sm:py-3.5 px-4 bg-primary text-on-primary font-bold text-xs sm:text-sm rounded-xl shadow-md hover:opacity-90 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined text-base shrink-0">check_circle</span>
                <span className="whitespace-nowrap">Submit Encounters</span>
              </button>
            </div>
          </section>
        </div>
      </div>

      {/* Submitted Encounter Modal */}
      {submittedModal && submittedModal.show && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-surface-container-high border border-outline-variant rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl space-y-5 animate-scale-up max-h-[85vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-primary/20 text-primary flex items-center justify-center border border-primary/30">
                <span className="material-symbols-outlined text-2xl">verified</span>
              </div>
              <div>
                <h3 className="font-bold text-lg text-on-surface">Encounter Synchronized</h3>
                <p className="text-xs text-on-surface-variant font-mono">Case #{submittedModal.encounterId}</p>
              </div>
            </div>

            <div className="bg-surface-container p-4 rounded-2xl border border-outline-variant/40 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-on-surface-variant font-bold">Primary Diagnosis</span>
                <span className="text-on-surface font-bold">{submittedModal.code}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant font-bold">Revenue Encumbrance</span>
                <span className="text-primary font-bold">+${submittedModal.revenue}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant font-bold">FHIR EMR Ledger</span>
                <span className="text-emerald-400 font-bold">Committed & Verified</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setSubmittedModal(null)}
                className="flex-1 py-3 bg-surface-container text-on-surface font-bold text-xs rounded-xl hover:bg-surface-container-highest transition-colors"
              >
                Done
              </button>
              <Link
                href="/billing/analysis"
                onClick={() => setSubmittedModal(null)}
                className="flex-1 py-3 bg-primary text-on-primary font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 hover:opacity-90 transition-opacity"
              >
                <span>View Ledger</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
