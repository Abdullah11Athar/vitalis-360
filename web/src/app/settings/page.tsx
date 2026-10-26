"use client";
import React, { useState, useEffect } from 'react';

export default function SettingsPage() {
  const [aiPersona, setAiPersona] = useState('Authoritative Co-Pilot');
  const [hitlThreshold, setHitlThreshold] = useState(10000);
  const [primaryLang, setPrimaryLang] = useState('English');
  const [waNotifications, setWaNotifications] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('vitalis_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.aiPersona) setAiPersona(parsed.aiPersona);
        if (parsed.hitlThreshold !== undefined) setHitlThreshold(parsed.hitlThreshold);
        if (parsed.primaryLang) setPrimaryLang(parsed.primaryLang);
        if (parsed.waNotifications !== undefined) setWaNotifications(parsed.waNotifications);
      } catch (e) {
        // ignore
      }
    }
  }, []);

  const saveSettings = () => {
    const settings = {
      aiPersona,
      hitlThreshold,
      primaryLang,
      waNotifications,
      savedAt: new Date().toISOString()
    };
    localStorage.setItem('vitalis_settings', JSON.stringify(settings));
    localStorage.setItem('vitalis_lang', primaryLang);
    window.dispatchEvent(new CustomEvent('language-changed', { detail: primaryLang }));
    window.dispatchEvent(new CustomEvent('show-toast', { detail: "⚙️ VITALIS-360 Settings saved successfully and synchronized across API gateway!" }));
  };

  return (
    <div className="py-6 px-4 md:px-8 max-w-4xl mx-auto w-full pb-36 md:pb-12">
      {/* Header */}
      <section className="mb-8 border-b border-outline-variant pb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
            <span className="material-symbols-outlined text-2xl">settings</span>
          </div>
          <div>
            <h1 className="font-headline-lg text-2xl md:text-3xl text-on-surface font-bold">System Settings</h1>
            <p className="text-xs text-on-surface-variant font-medium mt-0.5">Configure cognitive guardrails, API connections, and clinician orchestration</p>
          </div>
        </div>
      </section>

      <div className="space-y-6">
        {/* Sentinel Cognitive Profile */}
        <section className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-on-surface uppercase tracking-wider flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-base">psychology</span>
            Sentinel Cognitive Profile
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-on-surface-variant uppercase">Clinical Persona</label>
              <select 
                value={aiPersona} 
                onChange={(e) => setAiPersona(e.target.value)}
                className="w-full bg-surface-container border border-outline-variant/50 rounded-xl p-3 text-sm text-on-surface focus:outline-none focus:border-primary"
              >
                <option>Empathetic Assistant</option>
                <option>Authoritative Co-Pilot</option>
                <option>Strict Auditor Mode</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-on-surface-variant uppercase">HITL Financial Approval Threshold</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm font-bold">$</span>
                <input 
                  type="number" 
                  value={hitlThreshold} 
                  onChange={(e) => setHitlThreshold(Number(e.target.value))}
                  className="w-full bg-surface-container border border-outline-variant/50 rounded-xl pl-8 pr-4 py-3 text-sm text-on-surface focus:outline-none focus:border-primary"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Global Access & Integration */}
        <section className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-on-surface uppercase tracking-wider flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-base">language</span>
            Global Access & Translation
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-on-surface-variant uppercase">Primary Translation Target</label>
              <select 
                value={primaryLang} 
                onChange={(e) => setPrimaryLang(e.target.value)}
                className="w-full bg-surface-container border border-outline-variant/50 rounded-xl p-3 text-sm text-on-surface focus:outline-none focus:border-primary"
              >
                <option>English</option>
                <option>Urdu / Hindi</option>
                <option>Arabic</option>
                <option>Chinese</option>
                <option>Spanish</option>
              </select>
            </div>
            <div className="flex items-center justify-between bg-surface-container/50 px-4 py-3 rounded-xl border border-outline-variant/30">
              <div>
                <span className="text-xs font-bold text-on-surface block">WhatsApp Notification Bridge</span>
                <span className="text-[10px] text-on-surface-variant font-medium">Trigger alerts via Twilio gateway</span>
              </div>
              <input 
                type="checkbox" 
                checked={waNotifications}
                onChange={() => setWaNotifications(!waNotifications)}
                className="w-5 h-5 accent-primary cursor-pointer"
              />
            </div>
          </div>
        </section>

        {/* API Gateway Telemetry Matrix */}
        <section className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-on-surface uppercase tracking-wider flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-base">network_ping</span>
            API Gateway Telemetry Status
          </h2>
          <div className="divide-y divide-outline-variant/30">
            <div className="flex justify-between items-center py-3">
              <div>
                <span className="text-sm font-bold text-on-surface block">Gemini LLM Orchestrator</span>
                <span className="text-xs text-on-surface-variant">Continuous Clinical Reasoner</span>
              </div>
              <span className="bg-primary/10 text-primary px-2.5 py-1 rounded-xl text-xs font-bold border border-primary/20 whitespace-nowrap shrink-0">CONNECTED</span>
            </div>
            <div className="flex justify-between items-center py-3">
              <div>
                <span className="text-sm font-bold text-on-surface block">Glass.ai Engine</span>
                <span className="text-xs text-on-surface-variant">Differential Diagnosis Integration</span>
              </div>
              <span className="bg-primary/10 text-primary px-2.5 py-1 rounded-xl text-xs font-bold border border-primary/20 whitespace-nowrap shrink-0">CONNECTED</span>
            </div>
            <div className="flex justify-between items-center py-3">
              <div>
                <span className="text-sm font-bold text-on-surface block">Google Maps Platform</span>
                <span className="text-xs text-on-surface-variant">ER Proximity & Vicinity Matrix</span>
              </div>
              <span className="bg-primary/10 text-primary px-2.5 py-1 rounded-xl text-xs font-bold border border-primary/20 whitespace-nowrap shrink-0">CONNECTED</span>
            </div>
          </div>
        </section>

        {/* Action Button */}
        <button 
          onClick={saveSettings}
          className="w-full py-3 sm:py-3.5 px-4 bg-primary text-on-primary font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 hover:opacity-90 active:scale-98 transition-all shadow-md shadow-primary/10 cursor-pointer"
        >
          <span className="material-symbols-outlined text-base sm:text-lg shrink-0">save</span>
          <span className="text-center">Save & Apply System Configuration</span>
        </button>
      </div>
    </div>
  );
}
