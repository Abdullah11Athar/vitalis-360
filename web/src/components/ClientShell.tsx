"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import MobileBottomNav from "./MobileBottomNav";
import { getAssetPath, getApiPath } from "@/lib/config";
import { createDynamicPatient } from "@/lib/patientData";

interface UserSession {
  role: string;
  username: string;
}

export default function ClientShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarPinned, setIsSidebarPinned] = useState(false);
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);
  const [user, setUser] = useState<UserSession | null>(null);
  const [isSessionLoading, setIsSessionLoading] = useState(true);
  
  // Modals & Popups
  const [showBriefing, setShowBriefing] = useState(false);
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);
  const [showAddDoctorModal, setShowAddDoctorModal] = useState(false);
  const [showVitalsModal, setShowVitalsModal] = useState(false);

  // Add Patient Form State
  const [newName, setNewName] = useState('');
  const [newAge, setNewAge] = useState('');
  const [newGender, setNewGender] = useState('Female');
  const [newWard, setNewWard] = useState('Acute Care Wing');
  const [newPhone, setNewPhone] = useState('+923000000000');
  const [newHR, setNewHR] = useState('78');
  const [newBP, setNewBP] = useState('120/80');
  const [newSpO2, setNewSpO2] = useState('98');
  const [newTemp, setNewTemp] = useState('98.6°F');
  const [newDiagnosis, setNewDiagnosis] = useState('Acute Febrile Syndrome');

  // Add Doctor Form State
  const [newDocName, setNewDocName] = useState('');
  const [newDocRole, setNewDocRole] = useState('Doctor');
  const [newDocWard, setNewDocWard] = useState('Cardiology & Telemetry');
  const [newDocPhone, setNewDocPhone] = useState('+923000000000');

  // Input Vitals Form State
  const [inputHR, setInputHR] = useState('75');
  const [inputBP, setInputBP] = useState('120/80');
  const [inputSpO2, setInputSpO2] = useState('98');
  const [isVitalsLoading, setIsVitalsLoading] = useState(false);
  const [globalToast, setGlobalToast] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("vitalis_user");
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch (e) {
        localStorage.removeItem("vitalis_user");
      }
    }

    const savedPinned = localStorage.getItem("vitalis_sidebar_pinned");
    if (savedPinned !== null) {
      setIsSidebarPinned(savedPinned === "true");
    }

    setIsSessionLoading(false);

    // Register global event listeners for cross-page modal triggers and toasts
    const openAddPatient = () => setShowAddPatientModal(true);
    const openAddDoctor = () => setShowAddDoctorModal(true);
    const openVitals = () => setShowVitalsModal(true);
    const handleToast = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail) {
        setGlobalToast(detail);
        setTimeout(() => setGlobalToast(null), 3800);
      }
    };

    window.addEventListener('open-add-patient-modal', openAddPatient);
    window.addEventListener('open-add-doctor-modal', openAddDoctor);
    window.addEventListener('open-vitals-modal', openVitals);
    window.addEventListener('show-toast', handleToast);

    return () => {
      window.removeEventListener('open-add-patient-modal', openAddPatient);
      window.removeEventListener('open-add-doctor-modal', openAddDoctor);
      window.removeEventListener('open-vitals-modal', openVitals);
      window.removeEventListener('show-toast', handleToast);
    };
  }, []);

  const handleToggleSidebar = () => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setIsMobileMenuOpen(prev => !prev);
    } else {
      setIsSidebarPinned(prev => {
        const next = !prev;
        localStorage.setItem("vitalis_sidebar_pinned", String(next));
        return next;
      });
      setIsSidebarHovered(false);
    }
  };

  const isSidebarExpanded = isSidebarPinned || isSidebarHovered || isMobileMenuOpen;

  // Role Routing Guardrails
  useEffect(() => {
    if (isSessionLoading) return;

    const path = pathname.toLowerCase();
    
    if (!user) {
      // Force redirect to clean login routes if trying to access protected paths while logged out
      if (
        (path.startsWith('/portal') || 
         path.startsWith('/doctor') || 
         path.startsWith('/patient') || 
         path.startsWith('/billing') ||
         path.startsWith('/audits') ||
         path.startsWith('/emergency') ||
         path.startsWith('/settings')) && 
        !path.startsWith('/login')
      ) {
        router.push('/login');
      }
      return;
    }
    
    const role = user.role.toLowerCase();
    
    // Redirect if on landing or login page while logged in
    if (pathname === '/' || pathname.startsWith('/login')) {
      if (role === 'doctor') {
        router.push('/doctor/rounds');
      } else if (role === 'patient') {
        router.push('/patient/dashboard');
      } else if (role === 'staff') {
        router.push('/patient');
      }
      return;
    }
  }, [user, pathname, router, isSessionLoading]);

  const handleLogout = () => {
    localStorage.removeItem("vitalis_user");
    setUser(null);
    window.location.href = getApiPath('/');
  };

  // Add Patient Action
  const submitNewPatient = (e: React.FormEvent) => {
    e.preventDefault();
    const newPatient = createDynamicPatient({
      name: newName,
      age: parseInt(newAge) || 30,
      gender: newGender,
      ward: newWard,
      phone: newPhone,
      hr: parseInt(newHR) || 75,
      bp: newBP,
      spo2: parseInt(newSpO2) || 98,
      temp: newTemp,
      diagnosis: newDiagnosis
    });

    const currentPatients = JSON.parse(localStorage.getItem('vitalis_patients') || '[]');
    currentPatients.unshift(newPatient);
    localStorage.setItem('vitalis_patients', JSON.stringify(currentPatients));

    // Reset Form
    setNewName('');
    setNewAge('');
    setNewDiagnosis('Acute Febrile Syndrome');
    setShowAddPatientModal(false);

    // Notify directory page to sync state
    window.dispatchEvent(new Event('patients-updated'));
    window.dispatchEvent(new CustomEvent('show-toast', { detail: `✅ Patient "${newPatient.name}" admitted with clinical profile: "${newDiagnosis}"!` }));
  };

  const submitNewDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    const newDoc = {
      id: 'DOC-' + Math.floor(1000 + Math.random() * 9000),
      name: newDocName || 'Dr. Salman Ali',
      role: newDocRole,
      ward: newDocWard,
      phone: newDocPhone,
      status: 'Active On-Call'
    };

    const currentDocs = JSON.parse(localStorage.getItem('vitalis_doctors') || '[]');
    currentDocs.push(newDoc);
    localStorage.setItem('vitalis_doctors', JSON.stringify(currentDocs));

    setNewDocName('');
    setShowAddDoctorModal(false);
    window.dispatchEvent(new CustomEvent('show-toast', { detail: `👨‍⚕️ ${newDoc.role} "${newDoc.name}" added to Clinical Directory! WhatsApp linked: ${newDocPhone}` }));
  };

  const getActivePatientInfo = () => {
    if (typeof window !== 'undefined') {
      const storedActiveId = localStorage.getItem('vitalis_active_patient_id');
      const savedPatients = localStorage.getItem('vitalis_patients');
      if (savedPatients) {
        try {
          const list = JSON.parse(savedPatients);
          if (storedActiveId) {
            const match = list.find((p: any) => p.id === storedActiveId);
            if (match) return { id: match.id, name: match.name };
          }
          if (user?.role === 'Patient' && user.username) {
            const match = list.find((p: any) => p.name.toLowerCase().includes(user.username.toLowerCase()) || user.username.toLowerCase().includes(p.name.toLowerCase()));
            if (match) return { id: match.id, name: match.name };
          }
          if (list.length > 0) return { id: list[0].id, name: list[0].name };
        } catch (e) {}
      }
    }
    return { id: '8829-XL', name: user?.role === 'Patient' ? user.username : 'Zeeshan Ali' };
  };

  // Submit Vitals / SOS Action
  const submitVitals = async (isSOS: boolean) => {
    setIsVitalsLoading(true);
    const active = getActivePatientInfo();
    try {
      const vitalsPayload = {
        patientId: active.id,
        patientName: active.name,
        heartRate: parseInt(inputHR) || 75,
        bp: inputBP,
        spO2: parseInt(inputSpO2) || 98,
        doctorEndorsed: isSOS
      };

      if (isSOS) {
        // Direct E911 dispatch
        const response = await fetch(getApiPath('/api/emergency'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...vitalsPayload, doctorEndorsed: true })
        });
        const data = await response.json();
        if (response.ok) {
          window.dispatchEvent(new CustomEvent('show-toast', { detail: `🚨 SOS DISPATCH TRIGGERED! Dispatch ID: ${data.dispatchId}. Ambulance dispatched via E911 network.` }));
        } else {
          window.dispatchEvent(new CustomEvent('show-toast', { detail: `❌ Dispatch failed: ${data.error}` }));
        }
      } else {
        // Just log vitals
        const response = await fetch(getApiPath('/api/vitals'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(vitalsPayload)
        });
        const data = await response.json();
        if (data.actionRequired === 'E911_STANDBY') {
          window.dispatchEvent(new CustomEvent('show-toast', { detail: "⚠️ CRITICAL Vitals logged! System initiated E911 Standby state." }));
        } else {
          window.dispatchEvent(new CustomEvent('show-toast', { detail: "📊 Vitals successfully synchronized with Health Connect." }));
        }
      }
      setShowVitalsModal(false);
    } catch (err: any) {
      window.dispatchEvent(new CustomEvent('show-toast', { detail: "❌ Vitals logging failed: " + err.message }));
    } finally {
      setIsVitalsLoading(false);
    }
  };

  return (
    <>
      {/* Global Floating Toast Notification System */}
      {globalToast && (
        <div className="fixed bottom-24 sm:bottom-6 left-4 right-4 sm:left-auto sm:right-6 z-[100] bg-on-surface text-surface px-4 sm:px-6 py-3.5 sm:py-4 rounded-2xl shadow-2xl border border-primary/40 flex items-center gap-3 animate-bounce-short max-w-md mx-auto sm:mx-0">
          <span className="material-symbols-outlined text-primary text-xl sm:text-2xl shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
          <span className="text-xs sm:text-sm font-bold tracking-wide break-words">{globalToast}</span>
        </div>
      )}

      {/* Daily Briefing Initialization Modal */}
      {showBriefing && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-3 sm:p-4 backdrop-blur-md">
          <div className="w-full max-w-lg bg-surface-container border-2 border-primary/30 rounded-3xl p-5 sm:p-8 shadow-2xl relative animate-pulse-soft max-h-[88vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center gap-3 mb-6 border-b border-outline-variant/50 pb-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/15 flex items-center justify-center text-primary border border-primary/30 shrink-0">
                <span className="material-symbols-outlined text-3xl">verified_user</span>
              </div>
              <div>
                <span className="text-xs font-bold text-primary uppercase tracking-widest block">EMR INITIALIZATION BRIEFING</span>
                <h3 className="font-headline-lg text-lg md:text-xl text-on-surface font-bold">Good Morning, {user?.username}</h3>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="bg-surface-container-high rounded-2xl p-4 border border-outline-variant/30 flex gap-4">
                <span className="material-symbols-outlined text-primary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>calendar_today</span>
                <div>
                  <h4 className="font-bold text-sm text-on-surface">Today's Appointments</h4>
                  <p className="text-xs text-on-surface-variant mt-0.5">3 virtual round updates, 2 telemetry followups.</p>
                </div>
              </div>

              <div className="bg-surface-container-high rounded-2xl p-4 border border-outline-variant/30 flex gap-4">
                <span className="material-symbols-outlined text-tertiary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>medication</span>
                <div>
                  <h4 className="font-bold text-sm text-on-surface">Medication Reminders</h4>
                  <p className="text-xs text-on-surface-variant mt-0.5">Metformin 500mg (BID) and Insulin levels check queued.</p>
                </div>
              </div>

              <div className="bg-surface-container-high rounded-2xl p-4 border border-outline-variant/30 border-l-4 border-l-error flex gap-4">
                <span className="material-symbols-outlined text-error text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
                <div>
                  <h4 className="font-bold text-sm text-error">Critical Telemetry Alerts</h4>
                  <p className="text-xs text-on-surface-variant mt-0.5">Tachycardia warning active for #8829-XL (Zeeshan Ali) & High Fever 102.4°F alert for #5512-UF (Umar Farooq).</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowBriefing(false)}
              className="w-full py-4 bg-primary text-on-primary font-bold rounded-2xl shadow-lg hover:opacity-90 active:scale-95 transition-all text-sm cursor-pointer"
            >
              Acknowledge Briefing & Enter Dashboard
            </button>
          </div>
        </div>
      )}

      {/* Add Patient Modal */}
      {showAddPatientModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-3 sm:p-4 backdrop-blur-sm">
          <div className="w-full max-w-md bg-surface-container border border-outline-variant rounded-3xl p-5 sm:p-6 shadow-2xl relative max-h-[88vh] overflow-y-auto custom-scrollbar">
            <button 
              onClick={() => setShowAddPatientModal(false)}
              className="absolute right-4 top-4 text-on-surface-variant hover:text-on-surface p-1 rounded-full cursor-pointer"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            <h3 className="text-lg font-black text-on-surface mb-4 uppercase tracking-wider border-b border-outline-variant/40 pb-2">Add New Patient Census</h3>
            <form onSubmit={submitNewPatient} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">Full Name</label>
                <input 
                  type="text" 
                  value={newName} 
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-surface-container-high border border-outline-variant/40 rounded-xl p-2.5 text-xs text-on-surface focus:outline-none focus:border-primary"
                  placeholder="e.g. John Doe"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">Age</label>
                  <input 
                    type="number" 
                    value={newAge} 
                    onChange={(e) => setNewAge(e.target.value)}
                    className="w-full bg-surface-container-high border border-outline-variant/40 rounded-xl p-2.5 text-xs text-on-surface focus:outline-none focus:border-primary"
                    placeholder="35"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">Gender</label>
                  <select 
                    value={newGender} 
                    onChange={(e) => setNewGender(e.target.value)}
                    className="w-full bg-surface-container-high border border-outline-variant/40 rounded-xl p-2.5 text-xs text-on-surface focus:outline-none focus:border-primary"
                  >
                    <option>Female</option>
                    <option>Male</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">Primary Diagnosis / Chief Complaint</label>
                <input 
                  type="text" 
                  value={newDiagnosis} 
                  onChange={(e) => setNewDiagnosis(e.target.value)}
                  className="w-full bg-surface-container-high border border-outline-variant/40 rounded-xl p-2.5 text-xs text-on-surface focus:outline-none focus:border-primary font-bold"
                  placeholder="e.g. Acute High Fever & Chills"
                  required
                />
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {[
                    { label: 'High Fever', dx: 'High-Grade Febrile Syndrome', hr: '106', temp: '102.4°F' },
                    { label: 'Appendicitis', dx: 'Acute Appendicitis & RLQ Guarding', hr: '94', temp: '99.8°F' },
                    { label: 'Severe Migraine', dx: 'Intractable Migraine with Visual Aura', hr: '74', temp: '98.6°F' },
                    { label: 'Asthma/Bronchitis', dx: 'Acute Bronchitis & Respiratory Wheeze', hr: '102', temp: '101.2°F' },
                    { label: 'Tachycardia', dx: 'Paroxysmal Supraventricular Tachycardia', hr: '138', temp: '99.0°F' }
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => {
                        setNewDiagnosis(preset.dx);
                        setNewHR(preset.hr);
                        setNewTemp(preset.temp);
                      }}
                      className="text-[9px] px-2 py-0.5 rounded-lg bg-surface-container border border-outline-variant/50 text-primary hover:bg-primary/10 transition-colors cursor-pointer font-medium"
                    >
                      + {preset.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">Assigned Ward</label>
                <input 
                  type="text" 
                  value={newWard} 
                  onChange={(e) => setNewWard(e.target.value)}
                  className="w-full bg-surface-container-high border border-outline-variant/40 rounded-xl p-2.5 text-xs text-on-surface focus:outline-none focus:border-primary"
                  required
                />
              </div>
              <div className="grid grid-cols-4 gap-2">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider block">HR (bpm)</label>
                  <input 
                    type="number" 
                    value={newHR} 
                    onChange={(e) => setNewHR(e.target.value)}
                    className="w-full bg-surface-container-high border border-outline-variant/40 rounded-xl p-2 text-xs text-on-surface focus:outline-none"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider block">BP</label>
                  <input 
                    type="text" 
                    value={newBP} 
                    onChange={(e) => setNewBP(e.target.value)}
                    className="w-full bg-surface-container-high border border-outline-variant/40 rounded-xl p-2 text-xs text-on-surface focus:outline-none"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider block">SpO2 (%)</label>
                  <input 
                    type="number" 
                    value={newSpO2} 
                    onChange={(e) => setNewSpO2(e.target.value)}
                    className="w-full bg-surface-container-high border border-outline-variant/40 rounded-xl p-2 text-xs text-on-surface focus:outline-none"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider block">Temp (°F)</label>
                  <input 
                    type="text" 
                    value={newTemp} 
                    onChange={(e) => setNewTemp(e.target.value)}
                    className="w-full bg-surface-container-high border border-outline-variant/40 rounded-xl p-2 text-xs text-on-surface focus:outline-none"
                    placeholder="98.6°F"
                    required
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">WhatsApp Phone Number</label>
                <input 
                  type="text" 
                  value={newPhone} 
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full bg-surface-container-high border border-outline-variant/40 rounded-xl p-2.5 text-xs text-on-surface focus:outline-none focus:border-primary"
                  placeholder="e.g. +923001234567"
                  required
                />
              </div>
              <button 
                type="submit" 
                className="w-full py-3 bg-primary text-on-primary font-bold text-xs rounded-xl shadow-md mt-4 cursor-pointer"
              >
                Register Patient to Census
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Doctor / Staff Modal */}
      {showAddDoctorModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-3 sm:p-4 backdrop-blur-sm">
          <div className="w-full max-w-md bg-surface-container border border-outline-variant rounded-3xl p-5 sm:p-6 shadow-2xl relative max-h-[88vh] overflow-y-auto custom-scrollbar">
            <button 
              onClick={() => setShowAddDoctorModal(false)}
              className="absolute right-4 top-4 text-on-surface-variant hover:text-on-surface p-1 rounded-full cursor-pointer"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            <h3 className="text-lg font-black text-on-surface mb-4 uppercase tracking-wider border-b border-outline-variant/40 pb-2">Add Clinician / Medical Staff</h3>
            <form onSubmit={submitNewDoctor} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">Full Name</label>
                <input 
                  type="text" 
                  value={newDocName} 
                  onChange={(e) => setNewDocName(e.target.value)}
                  className="w-full bg-surface-container-high border border-outline-variant/40 rounded-xl p-2.5 text-xs text-on-surface focus:outline-none focus:border-primary"
                  placeholder="e.g. Dr. Salman Ali"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">Role</label>
                  <select 
                    value={newDocRole} 
                    onChange={(e) => setNewDocRole(e.target.value)}
                    className="w-full bg-surface-container-high border border-outline-variant/40 rounded-xl p-2.5 text-xs text-on-surface focus:outline-none focus:border-primary"
                  >
                    <option>Doctor</option>
                    <option>Specialist</option>
                    <option>Surgeon</option>
                    <option>Head Nurse</option>
                    <option>Staff</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">Department / Ward</label>
                  <input 
                    type="text" 
                    value={newDocWard} 
                    onChange={(e) => setNewDocWard(e.target.value)}
                    className="w-full bg-surface-container-high border border-outline-variant/40 rounded-xl p-2.5 text-xs text-on-surface focus:outline-none focus:border-primary"
                    required
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">Emergency WhatsApp Contact</label>
                <input 
                  type="text" 
                  value={newDocPhone} 
                  onChange={(e) => setNewDocPhone(e.target.value)}
                  className="w-full bg-surface-container-high border border-outline-variant/40 rounded-xl p-2.5 text-xs text-on-surface focus:outline-none focus:border-primary"
                  required
                />
              </div>
              <button 
                type="submit" 
                className="w-full py-3 bg-secondary text-on-secondary font-bold text-xs rounded-xl shadow-md mt-4 cursor-pointer"
              >
                Enroll Clinician to Directory
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Input Vitals / Trigger SOS Modal */}
      {showVitalsModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-3 sm:p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-surface-container border border-outline-variant rounded-3xl p-5 sm:p-6 shadow-2xl relative max-h-[88vh] overflow-y-auto custom-scrollbar">
            <button 
              onClick={() => setShowVitalsModal(false)}
              className="absolute right-4 top-4 text-on-surface-variant hover:text-on-surface p-1 rounded-full cursor-pointer"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            <h3 className="text-lg font-black text-on-surface mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">monitor_heart</span>
              Record Vitals Telemetry
            </h3>
            {(() => {
              const active = getActivePatientInfo();
              return <p className="text-xs text-on-surface-variant mb-4">Patient: {active.name} (#{active.id})</p>;
            })()}

            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">Heart Rate</label>
                  <input 
                    type="number" 
                    value={inputHR} 
                    onChange={(e) => setInputHR(e.target.value)}
                    className="w-full bg-surface-container-high border border-outline-variant/40 rounded-xl p-2.5 text-xs text-on-surface focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">Blood Pres.</label>
                  <input 
                    type="text" 
                    value={inputBP} 
                    onChange={(e) => setInputBP(e.target.value)}
                    className="w-full bg-surface-container-high border border-outline-variant/40 rounded-xl p-2.5 text-xs text-on-surface focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">SpO2 (%)</label>
                  <input 
                    type="number" 
                    value={inputSpO2} 
                    onChange={(e) => setInputSpO2(e.target.value)}
                    className="w-full bg-surface-container-high border border-outline-variant/40 rounded-xl p-2.5 text-xs text-on-surface focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  onClick={() => submitVitals(false)}
                  disabled={isVitalsLoading}
                  className="flex-1 py-3 bg-surface-container-high hover:bg-surface-container-highest text-on-surface border border-outline-variant/40 font-bold text-xs rounded-xl cursor-pointer disabled:opacity-50"
                >
                  Log to Cloud
                </button>
                <button 
                  onClick={() => submitVitals(true)}
                  disabled={isVitalsLoading}
                  className="flex-1 py-3 bg-error text-on-error font-bold text-xs rounded-xl shadow-md shadow-error/15 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1"
                >
                  <span className="material-symbols-outlined text-xs">emergency</span>
                  <span>Trigger SOS</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Layout Shell */}
      {!user || pathname === '/' || pathname.startsWith('/login') ? (
        <main className="flex-1 bg-background overflow-x-hidden min-w-0 min-h-screen w-full max-w-full">
          {children}
        </main>
      ) : (
        <>
          {/* Desktop Left Edge Hover Trigger Strip */}
          {!isSidebarExpanded && (
            <div 
              className="hidden md:block fixed left-0 top-0 bottom-0 w-4 z-40 cursor-pointer pointer-events-auto"
              onMouseEnter={() => setIsSidebarHovered(true)}
              title="Hover to open navigation panel"
            />
          )}

          <Sidebar 
            isExpanded={isSidebarExpanded}
            isPinned={isSidebarPinned}
            setIsPinned={(val) => {
              setIsSidebarPinned(val);
              localStorage.setItem("vitalis_sidebar_pinned", String(val));
            }}
            setIsHovered={setIsSidebarHovered}
            isMobileOpen={isMobileMenuOpen} 
            setIsMobileOpen={setIsMobileMenuOpen} 
            user={user}
            onAddPatientClick={() => setShowAddPatientModal(true)}
          />
          <div className={`flex flex-col flex-1 min-w-0 ${isSidebarPinned ? 'md:ml-64' : 'ml-0'} transition-all duration-300 overflow-x-hidden w-full max-w-full`}>
            <Topbar 
              onMenuClick={handleToggleSidebar} 
              onLogout={handleLogout} 
              user={user} 
              isSidebarOpen={isSidebarExpanded}
            />
            <main className="flex-1 bg-background overflow-x-hidden min-w-0 w-full max-w-full pb-36 md:pb-8">
              {children}
            </main>
            <MobileBottomNav />
          </div>
        </>
      )}
    </>
  );
}
