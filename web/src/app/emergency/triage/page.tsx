"use client";
import React, { useState } from 'react';

export default function TriageGateway() {
  const [symptomText, setSymptomText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Results State
  const [urgency, setUrgency] = useState(0);
  const [statusText, setStatusText] = useState('Waiting for Input');
  const [colorClass, setColorClass] = useState('text-error');
  const [barColor, setBarColor] = useState('bg-surface-variant');
  const [chips, setChips] = useState<string[]>([]);
  const [action, setAction] = useState('Please describe your symptoms to generate a clinical pathway.');

  const handleSubmit = () => {
    if (symptomText.length < 5) {
      window.dispatchEvent(new CustomEvent('show-toast', { detail: "⚠️ Please provide more detail (at least 5 characters) for a valid assessment." }));
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      let newUrgency = 0;
      let newStatus = "Low Concern";
      let newColor = "text-primary";
      let newBarColor = "bg-primary";
      let newChips: string[] = [];
      let newAction = "Continue monitoring symptoms. Log any changes over the next 24 hours.";

      const val = symptomText.toLowerCase();

      // Mock logic for specific triggers
      if (val.includes('dard') || val.includes('pain') || val.includes('seene')) {
        newUrgency = 85;
        newStatus = "CRITICAL / URGENT";
        newColor = "text-error";
        newBarColor = "bg-error";
        newChips = ['Chest Pain', 'Cardiac Marker', 'Hypoxia Risk'];
        newAction = "Immediate ER consultation recommended. Vital signals suggest cardiovascular stress. Notify your guardian contacts.";
      } else if (val.includes('bukhar') || val.includes('fever') || val.includes('cold')) {
        newUrgency = 35;
        newStatus = "MODERATE";
        newColor = "text-primary-container";
        newBarColor = "bg-primary-container";
        newChips = ['Infection', 'Febrile State', 'Inflammation'];
        newAction = "Schedule a virtual consultation within the next 4 hours. Stay hydrated and rest.";
      } else {
        newUrgency = 20;
        newStatus = "LOW";
        newColor = "text-primary";
        newBarColor = "bg-primary";
        newChips = ['General Malaise', 'Observation Mode'];
        newAction = "Monitor for 24 hours. No immediate action required based on current description.";
      }

      setUrgency(newUrgency);
      setStatusText(newStatus);
      setColorClass(newColor);
      setBarColor(newBarColor);
      setChips(newChips);
      setAction(newAction);
      setIsProcessing(false);
    }, 1500);
  };

  return (
    <div className="py-4 md:py-spacing-margin-desktop px-4 md:px-spacing-margin-desktop max-w-[1600px] mx-auto w-full pb-36 md:pb-12">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Section */}
        <section className="space-y-4">
          <h1 className="font-headline-lg text-headline-lg text-on-surface">On-Demand Triage Gateway</h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
            Enter your symptoms below. Our AI reasoning engine provides clinical-grade triage assessments while you wait for a human-in-the-loop verification.
          </p>
        </section>

        {/* Bento Layout Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Input Panel (Large) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-surface-container rounded-xl p-6 border border-outline-variant relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-focus-within:opacity-30 transition-opacity">
                <span className="material-symbols-outlined text-6xl">psychology</span>
              </div>
              
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-8 bg-primary rounded-full"></div>
                <h2 className="font-title-md text-title-md">Symptom Description</h2>
              </div>
              
              <textarea 
                className="w-full h-48 bg-surface-container-highest border border-outline-variant rounded-lg p-4 font-body-lg text-body-lg text-on-surface placeholder:text-on-surface-variant/40 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none resize-none relative z-10" 
                id="symptom-input" 
                value={symptomText}
                onChange={(e) => setSymptomText(e.target.value)}
                placeholder="Describe what you are feeling... (e.g., 'Mujhe seene mein dard hai aur saans lene mein takleef ho rahi hai')"
              ></textarea>
              
              <div className="flex justify-between items-center mt-6 relative z-10">
                <p className="text-xs text-on-surface-variant flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">lock</span>
                  End-to-End Encrypted
                </p>
                <button 
                  onClick={handleSubmit}
                  disabled={isProcessing}
                  className="px-6 py-3 bg-primary text-on-primary rounded-lg font-bold hover:opacity-90 active:scale-95 transition-all flex items-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-sm">sync</span> 
                      Processing...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-sm">auto_awesome</span>
                      Analyze Symptoms
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Analysis Panel (Side) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-surface-container rounded-xl p-6 border border-outline-variant flex flex-col h-full">
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-title-md text-title-md flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">analytics</span>
                  Real-time Triage Report
                </h2>
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-widest">
                  {isProcessing ? 'Processing' : 'Ready'}
                </span>
              </div>
              
              {/* Urgency Meter */}
              <div className="mb-8 space-y-4">
                <div className="flex justify-between items-end">
                  <span className="text-on-surface-variant text-sm font-label-md">Urgency Level</span>
                  <span className={`font-bold text-lg ${colorClass}`} id="urgency-status">
                    {statusText}
                  </span>
                </div>
                <div className="h-3 w-full bg-surface-container-highest rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${barColor} transition-all duration-1000 ease-out`} 
                    style={{ width: `${urgency}%` }}
                  ></div>
                </div>
              </div>

              {/* Symptom Mapping */}
              <div className="space-y-4 mb-8">
                <span className="text-on-surface-variant text-sm font-label-md">Detected Mappings</span>
                <div className="flex flex-wrap gap-2">
                  {chips.length === 0 ? (
                    <div className="px-3 py-2 bg-surface-container-highest border border-outline-variant rounded-lg text-sm text-on-surface-variant flex items-center gap-2 opacity-50 italic">
                      Awaiting diagnostic string...
                    </div>
                  ) : (
                    chips.map((chip, idx) => (
                      <div key={idx} className="px-3 py-1 bg-surface-container-highest border border-outline-variant rounded-full text-sm text-on-surface-variant">
                        {chip}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Recommended Action */}
              <div className="mt-auto bg-surface-container-highest rounded-xl p-4 border border-outline-variant border-l-4 border-l-primary">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/20 rounded-lg text-primary">
                    <span className="material-symbols-outlined">medical_information</span>
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold text-sm text-primary">Recommended Action</p>
                    <p className="text-on-surface text-sm">{action}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Analysis Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-surface-container rounded-xl p-6 border border-outline-variant group hover:border-primary/50 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <span className="material-symbols-outlined text-primary">monitor_heart</span>
              <h4 className="font-title-md text-on-surface">Vitals Proxy</h4>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-on-surface">--</span>
              <span className="text-on-surface-variant">BPM (Est)</span>
            </div>
          </div>
          
          <div className="bg-surface-container rounded-xl p-6 border border-outline-variant group hover:border-primary/50 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <span className="material-symbols-outlined text-primary">neurology</span>
              <h4 className="font-title-md text-on-surface">AI Confidence</h4>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-on-surface">
                {urgency > 0 ? (urgency + 5).toFixed(1) : '0.0'}
              </span>
              <span className="text-on-surface-variant">% Match</span>
            </div>
            <p className="text-xs text-on-surface-variant mt-2">Correlation with global medical database.</p>
          </div>
          
          <div className="bg-surface-container rounded-xl p-6 border border-outline-variant group hover:border-primary/50 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <span className="material-symbols-outlined text-primary">history</span>
              <h4 className="font-title-md text-on-surface">Historical Delta</h4>
            </div>
            <div className="flex items-center gap-2 text-primary font-bold">
              <span className="material-symbols-outlined">trending_flat</span>
              <span>Stable</span>
            </div>
            <p className="text-xs text-on-surface-variant mt-2">Comparison with your last assessment (14 days ago).</p>
          </div>
        </section>
      </div>
    </div>
  );
}
