# 5-Day AI Agents Intensive Course — Google x Kaggle Project Hub

Welcome to the project repository for the **Google x Kaggle 5-Day AI Agents Intensive Course**.

## Project: VITALIS-360 (Autonomous AI Medical Orchestrator & Clinical Guardian)
- **Live Production URL:** [https://projects.aaenterprisetech.com/kaggle/project](https://projects.aaenterprisetech.com/kaggle/project)
- **Kaggle Capstone Track:** Agents for Good / Concierge Agents

---

## 📁 Repository Directory Structure

```text
5 Days Ai Agent Course/
├── VITALIS-360/                 # Linked Full-Stack Project Directory (Junction)
│   ├── web/                    # Next.js 16 Production Web Application & API routes
│   │   ├── src/app/api/        # Gemini, RxNav, Emergency, Vitals, Stripe, WhatsApp routes
│   │   ├── src/app/doctor/     # Doctor Virtual Rounds & Clinical Intelligence
│   │   ├── src/app/patient/    # Patient Dashboard, Voice Advisor, Lifestyle, Sleep
│   │   └── src/app/emergency/  # Triage, Alert & E911 dispatch matrix
│   ├── mobile-app/             # Android Kotlin Mobile App (Health Connect SDK)
│   ├── VITALIS-360-Mobile-App.apk # Pre-built Android APK
│   ├── API_KEYS.md             # Integration Keys (Twilio, Stitch, Stripe, etc.)
│   └── DESIGN.md               # Technical specification and architecture
├── vitalis_agent.py            # Standalone Python Clinical Agent with Google GenAI SDK
├── KAGGLE_SUBMISSION_WRITEUP.md# Official Capstone Submission document & Video script
└── README.md                   # Repository overview (this file)
```

---

## 🚀 Quickstart Guide

### 1. Run the Python AI Clinical Agent
Test all 5 clinical tools (RxNav guard, telemetry scoring, ICD-10 mapping, SOS triage, SHA-256 vault):
```bash
python vitalis_agent.py
```

### 2. Run the Next.js Web Application
```bash
cd VITALIS-360/web
npm run dev
```
Then visit:
- Landing Page: `http://localhost:3000/kaggle/project`
- Doctor Rounds: `http://localhost:3000/kaggle/project/doctor/rounds`
- Patient Portal: `http://localhost:3000/kaggle/project/patient/dashboard`
- Voice AI Advisor: `http://localhost:3000/kaggle/project/patient/advisor`
