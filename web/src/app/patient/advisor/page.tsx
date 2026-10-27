"use client";
import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { getApiPath } from '@/lib/config';
import { getPatientById, PatientRecord } from '@/lib/patientData';

function MedicalAdvisorContent() {
  const searchParams = useSearchParams();
  const patientId = searchParams.get('id') || '8829-XL';
  
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncComplete, setSyncComplete] = useState(false);
  const [txnId, setTxnId] = useState('');
  const [role, setRole] = useState('patient');
  const [patient, setPatient] = useState<PatientRecord>(() => getPatientById(patientId));

  const [isPlayingSpeech, setIsPlayingSpeech] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);

  const [isRecording, setIsRecording] = useState(true);
  const [transcripts, setTranscripts] = useState<Array<{ time: string; text: string; isLive?: boolean }>>(() => patient.advisor?.transcripts || []);
  const [orders, setOrders] = useState<Array<{ id: number; type: string; name: string; accepted?: boolean }>>(() => patient.advisor?.orders || []);

  const [isMuted, setIsMuted] = useState(true);
  const [recognitionInstance, setRecognitionInstance] = useState<any>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('vitalis_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        if (parsed.role) setRole(parsed.role.toLowerCase());
      } catch (e) {}
    }

    const currentRecord = getPatientById(patientId);
    setPatient(currentRecord);
    setTranscripts(currentRecord.advisor?.transcripts || []);
    setOrders(currentRecord.advisor?.orders || []);
  }, [patientId]);

  const handleCommit = () => {
    setIsSyncing(true);
    const hash = '7a' + Array.from({length:38}, () => Math.floor(Math.random()*16).toString(16)).join('');
    setTxnId(hash);
    setTimeout(() => {
      setIsSyncing(false);
      setSyncComplete(true);
    }, 1200);
  };

  const fallbackSpeak = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.onend = () => setIsPlayingSpeech(false);
      utterance.onerror = () => setIsPlayingSpeech(false);
      window.speechSynthesis.speak(utterance);
      window.dispatchEvent(new CustomEvent('show-toast', { detail: `🔊 Playing AI Clinical Synthesis readout for ${patient.name}...` }));
    } else {
      setIsPlayingSpeech(false);
    }
  };

  const playDiagnosticSpeech = async () => {
    if (isPlayingSpeech) {
      if (currentAudio) {
        currentAudio.pause();
        setCurrentAudio(null);
      }
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsPlayingSpeech(false);
      window.dispatchEvent(new CustomEvent('show-toast', { detail: "⏹️ Voice readout stopped." }));
      return;
    }

    setIsPlayingSpeech(true);
    const textToSpeak = patient.advisor?.speechText || `Primary suggested diagnosis mapping is ${patient.advisor?.icd10 || 'R69'}, for ${patient.name}. Continue active ward monitoring.`;

    try {
      const res = await fetch(getApiPath('/api/elevenlabs'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: textToSpeak }),
      });
      if (res.ok) {
        const audioBlob = await res.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        setCurrentAudio(audio);
        audio.onended = () => {
          setIsPlayingSpeech(false);
          setCurrentAudio(null);
        };
        audio.onerror = () => {
          fallbackSpeak(textToSpeak);
        };
        await audio.play();
        window.dispatchEvent(new CustomEvent('show-toast', { detail: `🔊 Playing ElevenLabs HD AI Voice Note for ${patient.name}...` }));
      } else {
        fallbackSpeak(textToSpeak);
      }
    } catch (err) {
      fallbackSpeak(textToSpeak);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        try {
          const rec = new SpeechRecognition();
          rec.continuous = true;
          rec.interimResults = true;
          rec.lang = 'en-US';

          rec.onresult = (event: any) => {
            const current = event.resultIndex;
            const transcriptText = event.results[current][0].transcript;
            if (transcriptText.trim()) {
              setTranscripts(prev => {
                const newItems = [...prev];
                newItems[newItems.length - 1] = {
                  time: 'Live',
                  text: transcriptText,
                  isLive: true
                };
                return newItems;
              });
            }
          };

          rec.onerror = (e: any) => {
            console.log('Speech rec status:', e.error);
          };

          setRecognitionInstance(rec);
        } catch (e) {
          console.warn('SpeechRecognition init error:', e);
        }
      }
    }
  }, []);

  const toggleMute = async () => {
    if (isMuted) {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          await navigator.mediaDevices.getUserMedia({ audio: true });
        }
        setIsMuted(false);
        setIsRecording(true);
        if (recognitionInstance) {
          try {
            recognitionInstance.start();
          } catch (e) {}
        }
        window.dispatchEvent(new CustomEvent('show-toast', { detail: "🎙️ Microphone active! Live transcription running." }));
      } catch (err) {
        setIsMuted(false);
        setIsRecording(true);
        window.dispatchEvent(new CustomEvent('show-toast', { detail: "🎙️ Live audio capture simulated. Real-time telemetry feed engaged." }));
      }
    } else {
      setIsMuted(true);
      if (recognitionInstance) {
        try {
          recognitionInstance.stop();
        } catch (e) {}
      }
      window.dispatchEvent(new CustomEvent('show-toast', { detail: "🎙️ Microphone muted." }));
    }
  };

  const toggleAccept = (id: number) => {
    setOrders(orders.map(o => o.id === id ? { ...o, accepted: !o.accepted } : o));
  };

  return (
    <div className="py-6 px-4 md:px-8 max-w-5xl mx-auto w-full pb-36 md:pb-12">
      {/* Header Profile Section */}
      <section className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-outline-variant pb-6">
        <div className="flex items-center gap-4">
          <Link href={`/patient/detail?id=${patient.id}`} prefetch={true} className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container hover:bg-surface-container-high transition-colors active:scale-95 duration-150 border border-outline-variant cursor-pointer">
            <span className="material-symbols-outlined text-primary">arrow_back</span>
          </Link>
          <div className="w-14 h-14 rounded-full bg-surface-container-high border-2 border-primary/40 overflow-hidden flex items-center justify-center shadow-md shrink-0">
            <img 
              src={patient.avatar} 
              alt={patient.name} 
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <span className="font-label-sm text-xs text-primary uppercase tracking-widest font-bold">Clinical AI Sentinel</span>
            <h1 className="font-headline-lg text-2xl md:text-3xl text-on-surface font-bold">Medical Advisor & Triage</h1>
            <p className="text-xs text-on-surface-variant font-medium">Real-time voice capture & differential ICD-10 synthesis for {patient.name} (#{patient.id})</p>
          </div>
        </div>

        <div className="flex gap-3">
          <Link href={`/patient/lifestyle?id=${patient.id}`} prefetch={true} className="px-4 py-2 bg-surface-container text-on-surface text-xs font-bold rounded-xl border border-outline-variant hover:bg-surface-container-high transition-all flex items-center gap-1.5 shadow-sm">
            <span className="material-symbols-outlined text-base text-primary">health_metrics</span>
            Lifestyle Audit
          </Link>
          <Link href={`/patient/sleep?id=${patient.id}`} prefetch={true} className="px-4 py-2 bg-surface-container text-on-surface text-xs font-bold rounded-xl border border-outline-variant hover:bg-surface-container-high transition-all flex items-center gap-1.5 shadow-sm">
            <span className="material-symbols-outlined text-base text-tertiary">bedtime</span>
            Sleep Fidelity
          </Link>
        </div>
      </section>

      {/* Live Voice Capture Waveform Section */}
      <section className="bg-surface-container-low border border-outline-variant rounded-2xl p-6 md:p-8 flex flex-col items-center justify-center gap-8 overflow-hidden relative mb-8 shadow-sm">
        <div className="absolute top-5 right-5 flex items-center gap-2 bg-error/10 px-3 py-1 rounded-full border border-error/20">
          <span className={`w-2.5 h-2.5 rounded-full bg-error ${isRecording ? 'animate-pulse' : ''}`}></span>
          <span className="text-xs font-bold text-error uppercase tracking-wider">{isRecording ? 'LIVE RECORDING' : 'PAUSED'}</span>
        </div>

        <div className="w-full h-32 flex items-center justify-center gap-1.5 my-2">
          {/* Dynamic Waveform Simulation */}
          {[40, 70, 90, 50, 100, 60, 80, 45, 30, 75, 95, 55, 40, 85, 65, 90, 40, 70, 85, 50, 95, 60].map((h, i) => (
            <div 
              key={i} 
              className={`w-1.5 bg-primary rounded-full transition-all ${isRecording ? 'animate-pulse' : 'opacity-40'}`}
              style={{ 
                height: isRecording ? `${h}%` : '20%',
                animationDelay: `${(i % 5) * 0.15}s`,
                animationDuration: `${0.8 + (i % 3) * 0.3}s`
              }}
            ></div>
          ))}
        </div>

        <div className="flex items-center gap-6 md:gap-8">
          <button 
            onClick={() => setIsRecording(!isRecording)}
            className="w-14 h-14 rounded-full border border-outline-variant bg-surface-container flex items-center justify-center text-on-surface hover:bg-surface-container-high active:scale-90 transition-all shadow-sm cursor-pointer"
            title={isRecording ? "Pause" : "Resume"}
          >
            <span className="material-symbols-outlined text-2xl">{isRecording ? 'pause' : 'play_arrow'}</span>
          </button>
          <button 
            onClick={() => {
              setIsRecording(false);
              window.dispatchEvent(new CustomEvent('show-toast', { detail: `🧠 Recording stopped. Finalized AI diagnostic synthesis for ${patient.name}.` }));
            }}
            className="w-20 h-20 rounded-full bg-error text-white flex items-center justify-center shadow-lg shadow-error/30 active:scale-95 transition-transform hover:opacity-90 cursor-pointer"
            title="Stop & Synthesize"
          >
            <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>stop</span>
          </button>
          <button 
            onClick={toggleMute}
            className={`w-14 h-14 rounded-full border flex items-center justify-center transition-all shadow-sm cursor-pointer ${
              isMuted 
                ? 'border-outline-variant bg-surface-container text-on-surface hover:bg-surface-container-high active:scale-90' 
                : 'border-primary bg-primary/20 text-primary hover:bg-primary/30 animate-pulse'
            }`}
            title={isMuted ? "Unmute Mic" : "Mute Mic"}
          >
            <span className="material-symbols-outlined text-2xl">{isMuted ? 'mic_off' : 'mic'}</span>
          </button>
        </div>
      </section>

      {/* Real-time Transcription Feed */}
      <section className="mb-8">
        <h2 className="text-sm font-bold text-primary uppercase tracking-wider flex items-center gap-2 mb-4">
          <span className="material-symbols-outlined text-xl">text_snippet</span> Live Clinical Transcription Feed ({patient.name})
        </h2>
        <div className="space-y-3 bg-surface-container-low p-6 rounded-2xl border border-outline-variant max-h-64 overflow-y-auto shadow-sm">
          {transcripts.map((item, idx) => (
            <div 
              key={idx} 
              className={`flex gap-4 p-3.5 rounded-xl transition-all ${
                item.isLive ? 'border-l-4 border-l-primary bg-primary/10 shadow-sm' : 'hover:bg-surface-container/40'
              }`}
            >
              <span className={`text-xs font-bold font-mono min-w-12 pt-0.5 ${item.isLive ? 'text-primary' : 'text-on-surface-variant'}`}>
                {item.time}
              </span>
              <p className={`text-sm md:text-base leading-relaxed ${item.isLive ? 'text-primary font-bold italic' : 'text-on-surface font-medium'}`}>
                &ldquo;{item.text}&rdquo;
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* AI Clinical Intelligence Card */}
      <section className="bg-surface-container-low rounded-2xl p-6 md:p-8 border-2 border-primary shadow-xl shadow-primary/5 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-outline-variant/50 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
              <span className="material-symbols-outlined text-2xl">psychology</span>
            </div>
            <div>
              <h3 className="font-bold text-xl text-on-surface">AI Clinical Synthesis & Triage</h3>
              <p className="text-xs text-on-surface-variant font-medium">Real-time differential diagnosis and clinical order generation for {patient.name}</p>
            </div>
          </div>
          <div className="bg-primary/20 text-primary px-4 py-1.5 rounded-full text-xs font-bold border border-primary/30 w-fit flex items-center gap-1.5">
            <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
            <span>{patient.advisor?.confidence || 94}% Diagnostic Confidence</span>
          </div>
        </div>

        {/* ICD-10 Mapping */}
        <div className="bg-surface-container p-4 sm:p-5 rounded-2xl border border-outline-variant/50 space-y-2.5 shadow-sm">
          <span className="text-[11px] sm:text-xs font-bold text-on-surface-variant uppercase tracking-wider block">Primary Suggested Diagnosis (ICD-10 Mapping)</span>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            <div className="flex items-start sm:items-center gap-2.5 sm:gap-3 min-w-0">
              <span className="text-xl sm:text-2xl font-black text-primary shrink-0">{patient.advisor?.icd10 || 'R69'}</span>
              <span className="text-sm sm:text-base font-bold text-on-surface leading-snug">{patient.advisor?.title || patient.diagnosis}</span>
            </div>
            <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto pt-1 sm:pt-0">
              <button 
                onClick={playDiagnosticSpeech}
                disabled={isPlayingSpeech}
                className="h-8 sm:h-9 px-2.5 sm:px-3 rounded-lg bg-primary/10 text-primary border border-primary/20 flex items-center justify-center gap-1.5 hover:bg-primary/20 transition-all cursor-pointer disabled:opacity-50 text-xs font-bold shrink-0"
                title="Speak Clinical Note (ElevenLabs HD)"
              >
                <span className="material-symbols-outlined text-base">{isPlayingSpeech ? 'graphic_eq' : 'volume_up'}</span>
                <span>Listen Note</span>
              </button>
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20 text-primary">
                <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              </div>
            </div>
          </div>
          <p className="text-xs text-on-surface-variant mt-2 border-t border-outline-variant/30 pt-2 leading-relaxed">
            {patient.advisor?.differential || 'Differential considerations actively monitored. Telemetry within safe range.'}
          </p>
        </div>

        {/* Proposed Orders Grid */}
        <div className="space-y-3">
          <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">Autonomous Proposed Orders</span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {orders.map((order) => (
              <div key={order.id} className={`bg-surface-container p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${
                order.accepted ? 'border-primary bg-primary/5 shadow-sm shadow-primary/10' : 'border-outline-variant/50 hover:border-outline-variant'
              }`}>
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className={`p-2.5 rounded-lg shrink-0 ${order.accepted ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-primary'}`}>
                    <span className="material-symbols-outlined text-xl">{order.type}</span>
                  </div>
                  <div>
                    <span className="font-bold text-sm text-on-surface block">{order.name}</span>
                    <span className="text-[10px] font-medium text-on-surface-variant uppercase tracking-wider block">
                      {order.accepted ? 'Order Queued in EMR' : 'Pending Approval'}
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => toggleAccept(order.id)}
                  className={`w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer text-center ${
                    order.accepted 
                      ? 'bg-primary text-on-primary shadow-sm' 
                      : 'bg-surface-container-high text-on-surface hover:bg-primary/20 hover:text-primary'
                  }`}
                >
                  {order.accepted ? 'Accepted ✓' : 'Accept Order'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Action */}
        <div className="pt-2">
          <button 
            onClick={handleCommit}
            className="w-full bg-primary text-on-primary font-bold text-xs sm:text-sm py-3 sm:py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 active:scale-98 transition-all shadow-md shadow-primary/20 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base sm:text-lg shrink-0">send_and_archive</span>
            <span className="text-center">Commit Clinical Note & Queue Orders to EMR</span>
          </button>
        </div>
      </section>

      {/* Ledger Sync Modal */}
      {(isSyncing || syncComplete) && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-[200] p-4">
          <div className="bg-surface-container-low border border-outline-variant rounded-2xl max-w-md w-full max-h-[85vh] overflow-y-auto custom-scrollbar p-5 sm:p-6 shadow-2xl relative">
            {isSyncing ? (
              <div className="flex flex-col items-center py-6 text-center">
                <span className="material-symbols-outlined text-primary text-5xl animate-spin mb-4">sync</span>
                <h4 className="text-lg font-bold text-on-surface">Synchronizing with Clinical Ledger</h4>
                <p className="text-xs text-on-surface-variant mt-2 max-w-xs">Mining transaction block and validating SHA-256 cryptographic signatures against hospital EMR node...</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex flex-col items-center text-center pb-2 border-b border-outline-variant/30">
                  <span className="material-symbols-outlined text-primary text-5xl mb-3">verified</span>
                  <h4 className="text-lg font-bold text-on-surface">EMR Sync Successful</h4>
                  <p className="text-xs text-primary font-bold bg-primary/10 px-2.5 py-0.5 rounded-full border border-primary/20 mt-1.5">LEDGER TRANSMISSION COMMITTED</p>
                </div>
                <div className="space-y-2.5 text-xs text-on-surface">
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant font-medium">Record Type</span>
                    <span className="text-on-surface font-bold">Clinical Note & EMR Orders</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant font-medium">Block Height</span>
                    <span className="text-on-surface font-mono font-bold">#492,803</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant font-medium">Patient Signature</span>
                    <span className="text-on-surface font-bold">{patient.name}</span>
                  </div>
                  <div className="flex flex-col gap-1 pt-1.5 border-t border-outline-variant/30">
                    <span className="text-on-surface-variant font-medium text-left">Ledger Transaction Hash</span>
                    <span className="text-[10px] font-mono text-primary break-all bg-background p-2 rounded-lg border border-outline-variant/30 text-left">{txnId}</span>
                  </div>
                </div>
                <button 
                  onClick={() => setSyncComplete(false)}
                  className="w-full mt-4 py-2.5 bg-primary text-on-primary font-bold text-xs rounded-xl hover:opacity-90 active:scale-95 transition-all shadow-md cursor-pointer text-center"
                >
                  Close & Acknowledge
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function MedicalAdvisor() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-on-surface-variant font-medium">Loading clinical insights...</div>}>
      <MedicalAdvisorContent />
    </Suspense>
  );
}
