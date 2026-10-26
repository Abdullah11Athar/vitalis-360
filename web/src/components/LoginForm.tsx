"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAssetPath, getApiPath } from '@/lib/config';

interface LoginFormProps {
  initialRole?: 'doctor' | 'patient' | 'staff' | null;
}

export default function LoginForm({ initialRole = null }: LoginFormProps) {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<'doctor' | 'patient' | 'staff' | null>(initialRole);
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // If user already logged in, redirect to their portal
    const saved = localStorage.getItem("vitalis_user");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const role = parsed.role?.toLowerCase();
        if (role === 'doctor') {
          window.location.href = getApiPath('/doctor/rounds');
          return;
        } else if (role === 'patient') {
          window.location.href = getApiPath('/patient/dashboard');
          return;
        } else if (role === 'staff') {
          window.location.href = getApiPath('/patient');
          return;
        }
      } catch (e) {
        localStorage.removeItem("vitalis_user");
      }
    }

    if (initialRole) {
      applyRole(initialRole);
    }
  }, [initialRole]);

  const applyRole = (role: 'doctor' | 'patient' | 'staff') => {
    setSelectedRole(role);
    setErrorMsg('');
    if (role === 'doctor') {
      setUsernameInput('doctor');
      setPasswordInput('health1234');
    } else if (role === 'patient') {
      setUsernameInput('patient');
      setPasswordInput('health12345');
    } else if (role === 'staff') {
      setUsernameInput('staff');
      setPasswordInput('health1234');
    }
  };

  const handleRoleSelect = (role: 'doctor' | 'patient' | 'staff') => {
    applyRole(role);
    // Update the browser URL without triggering full page reload or router lock
    try {
      const targetUrl = getApiPath(`/login/${role}`);
      window.history.pushState(null, '', targetUrl);
    } catch (e) {
      // Fallback
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    if (selectedRole === 'doctor' && usernameInput === 'doctor' && passwordInput === 'health1234') {
      const session = { role: 'Doctor', username: 'Dr. Julian Vance' };
      localStorage.setItem("vitalis_user", JSON.stringify(session));
      window.location.href = getApiPath('/doctor/rounds');
    } else if (selectedRole === 'patient' && usernameInput === 'patient' && passwordInput === 'health12345') {
      const session = { role: 'Patient', username: 'Zeeshan Ali' };
      localStorage.setItem("vitalis_user", JSON.stringify(session));
      window.location.href = getApiPath('/patient/dashboard');
    } else if (selectedRole === 'staff' && usernameInput === 'staff' && passwordInput === 'health1234') {
      const session = { role: 'Staff', username: 'Emma Watson (Lead Receptionist)' };
      localStorage.setItem("vitalis_user", JSON.stringify(session));
      window.location.href = getApiPath('/patient');
    } else {
      setIsSubmitting(false);
      setErrorMsg("Invalid credentials. Please verify username and password.");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background relative overflow-hidden px-4 selection:bg-primary selection:text-on-primary">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-tertiary/10 rounded-full blur-3xl animate-pulse-soft pointer-events-none"></div>

      <div className="w-full max-w-md bg-surface-container-low border border-outline-variant p-8 rounded-3xl shadow-2xl relative z-10 backdrop-blur-md">
        <div className="text-center mb-8 flex flex-col items-center">
          <img 
            src={getAssetPath('/logo.png')} 
            alt="VITALIS-360 Logo" 
            className="h-14 w-auto object-contain mb-3 drop-shadow-[0_0_15px_rgba(78,222,163,0.3)]" 
          />
          <span className="font-headline-lg text-3xl font-black text-primary tracking-tighter block mb-1.5 drop-shadow-[0_0_15px_rgba(78,222,163,0.2)]">
            VITALIS-360
          </span>
          <p className="text-xs text-on-surface-variant font-bold uppercase tracking-widest">
            {selectedRole === 'doctor' 
              ? 'Autonomous Clinician Portal' 
              : selectedRole === 'patient' 
              ? 'Patient Telemetry Portal' 
              : selectedRole === 'staff' 
              ? 'Staff Administrative Portal' 
              : 'Select Portal Role'}
          </p>
        </div>

        {/* Role Toggle Selector */}
        <div className="flex bg-surface-container rounded-2xl p-1 mb-6 border border-outline-variant/30">
          {(['doctor', 'patient', 'staff'] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => handleRoleSelect(r)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                selectedRole === r 
                  ? 'bg-primary text-on-primary shadow-md' 
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">Username</label>
            <input
              type="text"
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              disabled={!selectedRole || isSubmitting}
              placeholder={selectedRole ? `Enter ${selectedRole} username` : "Select a role first"}
              className="w-full bg-surface-container border border-outline-variant/50 rounded-xl p-3.5 text-sm text-on-surface focus:outline-none focus:border-primary placeholder:text-on-surface-variant/45 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">Password</label>
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              disabled={!selectedRole || isSubmitting}
              placeholder={selectedRole ? "••••••••••••" : "Select a role first"}
              className="w-full bg-surface-container border border-outline-variant/50 rounded-xl p-3.5 text-sm text-on-surface focus:outline-none focus:border-primary placeholder:text-on-surface-variant/45 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              required
            />
          </div>

          {errorMsg && (
            <p className="text-xs font-bold text-error text-center mt-2 bg-error/10 py-2 rounded-xl border border-error/20">
              {errorMsg}
            </p>
          )}

          <button
            type="submit"
            disabled={!selectedRole || isSubmitting}
            className="w-full py-4 bg-primary text-on-primary font-bold text-sm rounded-xl transition-all active:scale-98 hover:opacity-90 shadow-md shadow-primary/10 mt-6 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <span>Authenticating...</span>
            ) : selectedRole ? (
              <span>Sign In as {selectedRole.toUpperCase()}</span>
            ) : (
              <span>Select a Role to Sign In</span>
            )}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-outline-variant/30 text-center">
          <p className="text-[10px] text-on-surface-variant/70 uppercase tracking-widest font-bold">
            Demo Credentials Pre-filled on Role Selection
          </p>
        </div>
      </div>
    </div>
  );
}
