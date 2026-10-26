---
theme: dark
colors:
  primary: '#10B981'
  secondary: '#0F172A'
  critical: '#EF4444'
  surface: '#1E293B'
  text: '#F8FAFC'
  surface-dim: '#0e1511'
  surface-bright: '#343b36'
  surface-container-lowest: '#09100c'
  surface-container-low: '#161d19'
  surface-container: '#1a211d'
  surface-container-high: '#242c27'
  surface-container-highest: '#2f3632'
  on-surface: '#dde4dd'
  on-surface-variant: '#bbcabf'
  inverse-surface: '#dde4dd'
  inverse-on-surface: '#2b322d'
  outline: '#86948a'
  outline-variant: '#3c4a42'
  surface-tint: '#4edea3'
  on-primary: '#003824'
  primary-container: '#10b981'
  on-primary-container: '#00422b'
  inverse-primary: '#006c49'
  on-secondary: '#283044'
  secondary-container: '#3f465c'
  on-secondary-container: '#adb4ce'
  tertiary: '#ffb3af'
  on-tertiary: '#650911'
  tertiary-container: '#fc7c78'
  on-tertiary-container: '#711419'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#6ffbbe'
  primary-fixed-dim: '#4edea3'
  on-primary-fixed: '#002113'
  on-primary-fixed-variant: '#005236'
  secondary-fixed: '#dae2fd'
  secondary-fixed-dim: '#bec6e0'
  on-secondary-fixed: '#131b2e'
  on-secondary-fixed-variant: '#3f465c'
  tertiary-fixed: '#ffdad7'
  tertiary-fixed-dim: '#ffb3af'
  on-tertiary-fixed: '#410005'
  on-tertiary-fixed-variant: '#842225'
  background: '#0e1511'
  on-background: '#dde4dd'
  surface-variant: '#2f3632'
  text-primary: '#F8FAFC'
  text-secondary: '#94A3B8'
typography:
  fontFamily: Inter, sans-serif
  headings: SemiBold, clean, and authoritative
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '600'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
name: Vitalis-360
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 32px
  widget-gap: 20px
---

# VITALIS-360 Design System

## Overview
VITALIS-360 is a world-class AI Healthcare Sentinel. The UI must feel empathetic, authoritative, evidence-based, and non-alarmist. It must convey a "premium clinical" aesthetic, inspired by Awwwards-winning healthcare sites (like Zocdoc, Teladoc, Mayo Clinic).

## Global Rules
- **Dark Mode Default**: The application should use a dark mode default for a modern, high-tech, and comfortable viewing experience.
- **Micro-animations**: Use subtle fade-ins, smooth transitions, and hover effects to make the app feel alive and responsive, but never distracting.
- **High Contrast Cues**: Always use Red for Critical (e.g., Level 3 Vitals breach) and Green for Stable.
- **Accessibility**: All text must be highly legible. Use large touch targets (buttons) for mobile.

## Components

### 1. Patient Dashboard (Daily Briefing)
- **Layout**: A clean, widget-based grid.
- **Header**: "Good Morning, Zeeshan. Your vitals are stable."
- **Widgets**:
  - **Vitals Monitor**: Real-time cards showing Heart Rate (BPM), Blood Pressure, and SpO2. Use smooth, animated sparkline charts for history.
  - **Action Items**: A list of pending medication reminders and appointments with a simple "Tick" button to endorse.
  - **Triage Gateway Button**: A prominent, easily accessible floating action button for "Input Vitals / SOS".

### 2. Emergency Sentinel Alert (Critical State)
- **Visual State**: When a Level 3-4 breach occurs, the surrounding UI should pulse with a subtle red glow. 
- **Modal**: A high-contrast, uncluttered modal appears:
  - *Headline*: "Critical Vitals Spike Detected"
  - *Details*: "Heart Rate: 135 BPM | BP: 175/110"
  - *Primary Action*: "Dispatch Ambulance to City Central Hospital (ETA: 6 mins)" (Solid Red Button)
  - *Secondary Action*: "I am okay / False Alarm" (Outlined Button)

### 3. Doctor/Receptionist Portal (Triad Interface)
- **Layout**: Sidebar navigation with a main content area.
- **Intelligent Virtual Rounds Table**: 
  - A data table listing all patients. 
  - Columns: Patient Name, Current Status (Green Dot / Red Dot), Latest Vitals, Pending Endorsements.
  - *Row Expansion*: Clicking a patient row expands to show the Glass.ai Differential Diagnosis (DDx) draft and lifestyle correlations.
- **Endorsement Bar**: A sticky bottom or top bar highlighting actions that need human endorsement (e.g., "Approve Paracetamol for Zeeshan - No drug interactions found via RxNav").

### 4. Micro-Interactions & Feedback
- **Tick/Cross Endorsement**: When a doctor endorses an action (Tick), show a satisfying green checkmark animation.
- **Loading States**: Use skeleton screens instead of spinners to maintain the structural feel while data loads.