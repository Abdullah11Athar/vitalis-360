"use client";
import React, { useState, useEffect } from 'react';

export default function EmergencyAlert() {
  const [countdown, setCountdown] = useState(60);
  const [isDispatching, setIsDispatching] = useState(false);
  const [dispatched, setDispatched] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const [profile, setProfile] = useState<any>({
    address: "Flat 402, 4th Floor, Shaheen Heights, Block 6",
    city: "Karachi",
    preferredHospital: "Aga Khan University Hospital ER",
    emergencyContactName: "Faisal Ali (Brother)",
    emergencyContactPhone: "+923009876543"
  });

  const [dispatchLogs, setDispatchLogs] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('vitalis_emergency_profile');
    if (saved) {
      setProfile(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (!dismissed && !dispatched && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown, dismissed, dispatched]);

  const handleDispatch = () => {
    setIsDispatching(true);
    setDispatchLogs([]);
    const logs = [
      `🔍 Fetching EMR rescue parameters for patient Zeeshan Ali...`,
      `📍 Coordinates loaded: ${profile.address}, Floor: Flat 402, 4th Floor, ${profile.city}`,
      `📞 Emergency Contact loaded: ${profile.emergencyContactName} (${profile.emergencyContactPhone})`,
      `🏥 Preferred ER Target selected: ${profile.preferredHospital}`,
      `📤 Initiating Twilio WhatsApp Gateway connection...`,
      `💬 WhatsApp dispatch payload queued for delivery to ${profile.emergencyContactPhone}`,
      `🚑 Contacting City Ambulance Dispatch via E911 Protocol...`,
      `✅ SOS DISPATCH SUCCESSFUL! Dispatch ID: SOS-${Math.floor(100000 + Math.random()*900000)}. Ambulance dispatched.`
    ];
    
    let currentIdx = 0;
    const interval = setInterval(() => {
      if (currentIdx < logs.length) {
        setDispatchLogs(prev => [...prev, logs[currentIdx]]);
        currentIdx++;
      } else {
        clearInterval(interval);
        setIsDispatching(false);
        setDispatched(true);
      }
    }, 450);
  };

  if (dismissed) {
    return (
      <div className="p-8 max-w-4xl mx-auto text-center flex flex-col items-center justify-center min-h-[70vh]">
        <div className="w-20 h-20 bg-primary/20 text-primary rounded-full flex items-center justify-center mb-6">
          <span className="material-symbols-outlined text-4xl">check_circle</span>
        </div>
        <h1 className="font-headline-lg text-headline-lg text-on-surface mb-2">Alert Dismissed</h1>
        <p className="text-on-surface-variant max-w-md mb-8">
          The autonomous sentinel has logged this event as a false alarm. Your vitals continue to be monitored in real-time.
        </p>
        <button 
          onClick={() => setDismissed(false)}
          className="px-6 py-3 bg-surface-container-high text-on-surface rounded-xl hover:bg-surface-bright transition-all"
        >
          Re-open Alert Simulator
        </button>
      </div>
    );
  }

  return (
    <div className="relative min-h-[calc(100vh-5rem)] flex items-center justify-center p-4 md:p-8 overflow-hidden pb-36 md:pb-8">
      {/* Background Pulse Effect */}
      <div className="absolute inset-0 bg-error/5 animate-pulse pointer-events-none"></div>

      {/* Main Alert Modal Card */}
      <div className="relative w-full max-w-2xl bg-surface-container-highest border-2 border-error/50 rounded-3xl overflow-hidden shadow-[0px_20px_50px_rgba(147,0,10,0.5)] z-10">
        {/* Shimmer overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-error/10 to-transparent w-full animate-pulse pointer-events-none"></div>

        <div className="p-6 md:p-10 flex flex-col items-center text-center">
          {/* Sentinel Icon */}
          <div className="w-20 h-20 bg-error-container text-error rounded-full flex items-center justify-center mb-6 animate-bounce shadow-lg shadow-error/30">
            <span className="material-symbols-outlined text-[48px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              emergency_home
            </span>
          </div>

          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-error text-on-error text-xs font-black rounded-full uppercase tracking-wider animate-pulse">
              Stage 2 Critical
            </span>
            <span className="text-on-surface-variant text-sm font-medium">Autonomous Sentinel Detection</span>
          </div>

          <h1 className="font-headline-lg text-2xl md:text-headline-lg text-error mb-2 tracking-tight uppercase font-black">
            Critical Vitals Spike Detected
          </h1>

          <p className="font-body-md text-on-surface-variant max-w-lg mb-8 leading-relaxed">
            Your current readings indicate a potentially serious condition. Our autonomous sentinel has already alerted your primary care physician Dr. Julian Vance.
          </p>

          {/* Vitals Bento Box */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mb-8">
            <div className="bg-background/80 border border-error/40 rounded-2xl p-5 flex items-center justify-between shadow-inner">
              <div className="text-left">
                <div className="flex items-center gap-1.5 text-error mb-1">
                  <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                  <span className="font-label-sm text-xs uppercase tracking-wider font-bold">Heart Rate</span>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-4xl md:text-5xl font-black text-error">135</span>
                  <span className="text-sm font-bold text-error/70">BPM</span>
                </div>
              </div>
              <div className="flex items-end gap-1 h-10">
                <div className="bg-error w-1.5 h-[40%] rounded-full animate-pulse"></div>
                <div className="bg-error w-1.5 h-[80%] rounded-full animate-pulse"></div>
                <div className="bg-error w-1.5 h-[100%] rounded-full animate-pulse"></div>
                <div className="bg-error w-1.5 h-[60%] rounded-full animate-pulse"></div>
              </div>
            </div>

            <div className="bg-background/80 border border-error/40 rounded-2xl p-5 flex items-center justify-between shadow-inner">
              <div className="text-left">
                <div className="flex items-center gap-1.5 text-error mb-1">
                  <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>blood_pressure</span>
                  <span className="font-label-sm text-xs uppercase tracking-wider font-bold">Blood Pressure</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl md:text-4xl font-black text-error leading-none">175<span className="text-on-surface-variant/40 font-light">/</span>110</span>
                  <span className="text-xs font-bold text-error/70 ml-1">mmHg</span>
                </div>
              </div>
              <span className="px-2 py-1 bg-error-container text-on-error-container text-[10px] font-bold rounded-full uppercase">
                Spike
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="w-full space-y-3 sm:space-y-4">
            <button 
              onClick={handleDispatch}
              disabled={dispatched || isDispatching}
              className={`w-full py-3.5 sm:py-4 px-4 sm:px-8 font-bold rounded-xl text-sm sm:text-base transition-all flex items-center justify-center gap-2.5 shadow-lg ${
                dispatched 
                  ? 'bg-primary text-on-primary cursor-default shadow-primary/20' 
                  : 'bg-error text-on-error hover:scale-[1.02] active:scale-95 shadow-error/30 animate-pulse'
              }`}
            >
              <span className={`material-symbols-outlined text-xl sm:text-2xl shrink-0 ${isDispatching ? 'animate-spin' : ''}`}>
                {isDispatching ? 'refresh' : dispatched ? 'check_circle' : 'ambulance'}
              </span>
              <span className="text-center">
                {isDispatching 
                  ? 'Contacting Emergency Dispatch...' 
                  : dispatched 
                  ? 'Ambulance En Route (ETA: 6 mins)' 
                  : 'Dispatch Ambulance to City Central Hospital'}
              </span>
            </button>

            {dispatchLogs.length > 0 && (
              <div className="w-full bg-background border border-outline-variant/60 rounded-2xl p-4 text-left font-mono text-[10px] text-primary space-y-1.5 shadow-inner">
                <div className="text-on-surface-variant font-bold text-[9px] uppercase tracking-wider border-b border-outline-variant/30 pb-1 mb-2 flex justify-between items-center">
                  <span>Twilio Gateway & EMR Dispatch Logs</span>
                  <span className="animate-pulse w-1.5 h-1.5 rounded-full bg-primary"></span>
                </div>
                {dispatchLogs.map((log, index) => (
                  <div key={index} className="leading-relaxed flex gap-2">
                    <span className="text-outline-variant select-none">&gt;</span>
                    <span>{log}</span>
                  </div>
                ))}
              </div>
            )}

            <button 
              onClick={() => setDismissed(true)}
              className="w-full py-3 sm:py-3.5 px-4 sm:px-8 border border-outline-variant text-on-surface-variant font-bold text-xs sm:text-sm rounded-xl hover:bg-surface-container-low hover:text-on-surface transition-colors cursor-pointer"
            >
              I am okay / False Alarm
            </button>
          </div>
        </div>

        {/* Countdown Bar */}
        <div className="h-1.5 bg-surface-container w-full overflow-hidden">
          <div 
            className="h-full bg-error transition-all duration-1000 ease-linear"
            style={{ width: `${(countdown / 60) * 100}%` }}
          ></div>
        </div>
        <div className="bg-surface-container px-6 py-2 flex justify-between items-center text-xs text-on-surface-variant">
          <span>Auto-escalation in: <strong className="text-error">{countdown}s</strong></span>
          <span>Protocol: HITL-Overrule</span>
        </div>
      </div>
    </div>
  );
}
