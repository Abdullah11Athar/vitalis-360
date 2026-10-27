export interface ClinicalHistoryItem {
  condition: string;
  diagnosed: string;
  medications: string[];
  management: string;
}

export interface LabMetric {
  name: string;
  description: string;
  value: string;
  unit?: string;
  status: 'Normal' | 'Elevated' | 'Low' | 'Critical' | 'Borderline';
  statusColor: 'primary' | 'error' | 'amber' | 'secondary';
}

export interface LabPanel {
  panelName: string;
  date: string;
  metrics: LabMetric[];
}

export interface AlarmItem {
  id: number;
  title: string;
  time: string;
  desc: string;
  type: 'error' | 'warning' | 'info';
}

export interface AdvisorAssessment {
  icd10: string;
  title: string;
  confidence: number;
  differential: string;
  speechText: string;
  transcripts: Array<{ time: string; text: string; isLive?: boolean }>;
  orders: Array<{ id: number; type: string; name: string; accepted?: boolean }>;
}

export interface LifestyleData {
  wellnessScore: number;
  summary: string;
  sleepHours: number;
  sleepDelta: string;
  dailySteps: number;
  stepPercentage: number;
  stressScore: number;
  stressLabel: string;
}

export interface SleepData {
  sleepScore: number;
  sleepHours: number;
  remPercentage: number;
  deepSleep: string;
  circadianStability: string;
  respiratoryRate: number;
  sleepEfficiency: string;
}

export interface PatientRecord {
  id: string;
  name: string;
  age: number;
  gender: string;
  ward: string;
  phone?: string;
  status: string;
  statusColor: 'error' | 'primary' | 'amber' | 'secondary';
  hr: number;
  heartRate?: number;
  bp: string;
  spo2: number;
  spO2?: number;
  temp: string;
  diagnosis: string;
  avatar: string;
  href?: string;
  alarms: AlarmItem[];
  clinicalHistory: ClinicalHistoryItem[];
  labPanel: LabPanel;
  advisor: AdvisorAssessment;
  lifestyle: LifestyleData;
  sleep: SleepData;
}

export const DEFAULT_PATIENTS: PatientRecord[] = [
  {
    id: '8829-XL',
    name: 'Zeeshan Ali',
    age: 34,
    gender: 'Male',
    ward: 'Telemetry Ward 4B',
    phone: '+923001234567',
    status: 'Critical Alert',
    statusColor: 'error',
    hr: 142,
    heartRate: 142,
    bp: '138/88',
    spo2: 94,
    spO2: 94,
    temp: '99.2°F',
    diagnosis: 'Supraventricular Tachycardia & Type 2 DM',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    href: '/patient/detail?id=8829-XL',
    alarms: [
      { id: 1, title: 'Tachycardia Event', time: '2m ago', desc: 'Resting HR spiked to 142 bpm during sleep cycle.', type: 'error' },
      { id: 2, title: 'Glucose Spike Warning', time: '18m ago', desc: 'Post-prandial glucose reached 185 mg/dL.', type: 'warning' }
    ],
    clinicalHistory: [
      {
        condition: 'Type 2 Diabetes Mellitus',
        diagnosed: 'Diagnosed 2021',
        medications: ['Metformin 500mg (BID)'],
        management: 'Diet & Insulin Regulated'
      },
      {
        condition: 'Paroxysmal Supraventricular Tachycardia',
        diagnosed: 'Active Monitoring',
        medications: ['Propranolol 20mg (PRN)'],
        management: 'Continuous Telemetry'
      }
    ],
    labPanel: {
      panelName: 'Metabolic & Glycemic Profile',
      date: 'April 24, 2026',
      metrics: [
        { name: 'HbA1c', description: 'Glycated Hemoglobin', value: '6.1%', unit: '%', status: 'Normal', statusColor: 'primary' },
        { name: 'Fasting Blood Sugar', description: 'Serum Glucose', value: '168 mg/dL', unit: 'mg/dL', status: 'Elevated', statusColor: 'error' },
        { name: 'Serum Potassium', description: 'Electrolyte Balance', value: '3.8 mEq/L', unit: 'mEq/L', status: 'Normal', statusColor: 'primary' }
      ]
    },
    advisor: {
      icd10: 'I47.1',
      title: 'Supraventricular Tachycardia',
      confidence: 94,
      differential: 'Paroxysmal Supraventricular Tachycardia (PSVT) vs. Sinus Tachycardia secondary to glycemic spike. Recommend continuous rhythm strip analysis and serum electrolyte panel.',
      speechText: 'Primary suggested diagnosis mapping is I 47.1, Supraventricular Tachycardia. Patient telemetry confirms persistent resting heart rate of 142 beats per minute. Recommend immediate vagal maneuvers, intravenous adenosine standby, and electrolyte repletion.',
      transcripts: [
        { time: '10:24', text: 'Patient reports sudden onset fluttering sensation in chest accompanied by mild shortness of breath.', isLive: false },
        { time: '10:25', text: 'Telemetry confirmed sudden jump from 78 bpm to 142 bpm. Blood pressure remains compensated at 138 over 88.', isLive: false },
        { time: 'Live', text: 'Analyzing telemetry rhythm strips for P-wave morphology and QRS duration...', isLive: true }
      ],
      orders: [
        { id: 1, type: 'biotech', name: 'Order STAT Serum Potassium & Magnesium', accepted: false },
        { id: 2, type: 'cardiology', name: '12-Lead Electrocardiogram (ECG)', accepted: false }
      ]
    },
    lifestyle: {
      wellnessScore: 72,
      summary: 'Metabolic markers require closer glycemic surveillance; telemetry shows nocturnal sympathetic spikes.',
      sleepHours: 6.1,
      sleepDelta: '-18% vs weekly avg',
      dailySteps: 4200,
      stepPercentage: 52,
      stressScore: 78,
      stressLabel: 'High Sympathetic Tone'
    },
    sleep: {
      sleepScore: 64,
      sleepHours: 6.1,
      remPercentage: 18,
      deepSleep: '1.2h',
      circadianStability: '71%',
      respiratoryRate: 19,
      sleepEfficiency: '76%'
    }
  },
  {
    id: '9912-KA',
    name: 'Elena Rostova',
    age: 48,
    gender: 'Female',
    ward: 'ICU Bed 2',
    phone: '+923002345678',
    status: 'Monitoring',
    statusColor: 'primary',
    hr: 76,
    heartRate: 76,
    bp: '120/78',
    spo2: 98,
    spO2: 98,
    temp: '98.4°F',
    diagnosis: 'Post-op Cardiac Bypass (CABG) / Stable Recovery',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    href: '/patient/detail?id=9912-KA',
    alarms: [
      { id: 1, title: 'Mediastinal Drainage Check', time: '12m ago', desc: '4-hour postoperative fluid output milestone scheduled for review.', type: 'info' }
    ],
    clinicalHistory: [
      {
        condition: 'Triple Vessel CAD (Post-CABG Day 3)',
        diagnosed: 'Surgical Day 3',
        medications: ['Aspirin 81mg', 'Clopidogrel 75mg'],
        management: 'Postoperative Sternal Precautions'
      },
      {
        condition: 'Essential Hypertension',
        diagnosed: 'Diagnosed 2018',
        medications: ['Amlodipine 5mg (Daily)'],
        management: 'BP Maintained < 130/80'
      }
    ],
    labPanel: {
      panelName: 'Post-Operative Cardiac & Coagulation Panel',
      date: 'April 25, 2026',
      metrics: [
        { name: 'Cardiac Troponin I', description: 'Myocardial Biomarker', value: '0.04 ng/mL', unit: 'ng/mL', status: 'Normal', statusColor: 'primary' },
        { name: 'Platelet Count', description: 'Coagulation Status', value: '215,000 /µL', unit: '/µL', status: 'Normal', statusColor: 'primary' },
        { name: 'Hematocrit', description: 'Red Blood Cell Volume', value: '33.2%', unit: '%', status: 'Borderline', statusColor: 'amber' }
      ]
    },
    advisor: {
      icd10: 'Z95.1',
      title: 'Presence of Aortocoronary Bypass Graft',
      confidence: 98,
      differential: 'Uncomplicated postoperative cardiovascular convalescence. Sternal stability intact with no signs of wound dehiscence, infection, or pericardial effusion.',
      speechText: 'Primary diagnostic mapping is Z 95.1, Post-coronary artery bypass graft recovery. Hemodynamics are stable with target mean arterial pressure maintained. Recommend progressive ambulation and pulmonary toilet protocol.',
      transcripts: [
        { time: '09:15', text: 'Patient ambulated 50 meters with physical therapy without desaturation or angina.', isLive: false },
        { time: '09:20', text: 'Bilateral breath sounds clear, sternal incision clean, dry, and intact.', isLive: false },
        { time: 'Live', text: 'Correlating postoperative anticoagulant compliance and oxygen saturation curves...', isLive: true }
      ],
      orders: [
        { id: 1, type: 'biotech', name: 'Order Morning CBC & Electrolytes', accepted: true },
        { id: 2, type: 'cardiology', name: 'Echocardiogram Ejection Fraction Followup', accepted: false }
      ]
    },
    lifestyle: {
      wellnessScore: 88,
      summary: 'Postoperative recovery is proceeding within target trajectory; physical rehabilitation initiated.',
      sleepHours: 7.8,
      sleepDelta: '+14% vs baseline',
      dailySteps: 3100,
      stepPercentage: 62,
      stressScore: 32,
      stressLabel: 'Well Managed / Calm'
    },
    sleep: {
      sleepScore: 85,
      sleepHours: 7.8,
      remPercentage: 22,
      deepSleep: '1.9h',
      circadianStability: '92%',
      respiratoryRate: 15,
      sleepEfficiency: '89%'
    }
  },
  {
    id: '7734-BM',
    name: 'Marcus Vance',
    age: 62,
    gender: 'Male',
    ward: 'Telemetry Ward 4A',
    phone: '+923003456789',
    status: 'Stable',
    statusColor: 'primary',
    hr: 68,
    heartRate: 68,
    bp: '128/82',
    spo2: 97,
    spO2: 97,
    temp: '98.6°F',
    diagnosis: 'Essential Hypertension & Mild Arrhythmia',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    href: '/patient/detail?id=7734-BM',
    alarms: [],
    clinicalHistory: [
      {
        condition: 'Essential Hypertension',
        diagnosed: 'Diagnosed 2017',
        medications: ['Lisinopril 10mg (Daily)'],
        management: 'Stable Maintenance'
      },
      {
        condition: 'Mild Sinus Bradycardia / Arrhythmia',
        diagnosed: 'Active Observation',
        medications: ['Carvedilol 6.25mg (BID)'],
        management: 'Wearable ECG Sync'
      }
    ],
    labPanel: {
      panelName: 'Renal & Lipid Function Panel',
      date: 'April 22, 2026',
      metrics: [
        { name: 'Serum Creatinine', description: 'Kidney Filtration', value: '1.05 mg/dL', unit: 'mg/dL', status: 'Normal', statusColor: 'primary' },
        { name: 'eGFR', description: 'Glomerular Filtration', value: '84 mL/min', unit: 'mL/min', status: 'Normal', statusColor: 'primary' },
        { name: 'LDL Cholesterol', description: 'Low-Density Lipoprotein', value: '98 mg/dL', unit: 'mg/dL', status: 'Normal', statusColor: 'primary' }
      ]
    },
    advisor: {
      icd10: 'I10',
      title: 'Essential (Primary) Hypertension',
      confidence: 96,
      differential: 'Stage 1 essential hypertension under optimal medical maintenance. No end-organ damage or renal compromise detected.',
      speechText: 'Primary diagnostic mapping is I 10, Essential Hypertension under stable medical therapy. Blood pressure has remained well within normative parameters over the last 48 hours. Continue current antihypertensive regimen.',
      transcripts: [
        { time: '08:30', text: 'Patient reports feeling well rested. Denies dizziness, palpitations, or visual changes.', isLive: false },
        { time: '08:35', text: 'Radial pulses equal and synchronous bilaterally. Neurological baseline intact.', isLive: false },
        { time: 'Live', text: 'Monitoring 24-hour ambulatory blood pressure indices...', isLive: true }
      ],
      orders: [
        { id: 1, type: 'biotech', name: 'Order Basic Metabolic Panel (BMP)', accepted: false },
        { id: 2, type: 'pharmacy', name: 'Refill Lisinopril 10mg 30-Day Supply', accepted: true }
      ]
    },
    lifestyle: {
      wellnessScore: 92,
      summary: 'Cardiovascular parameters are robust; sustained physical mobility and steady circadian alignment.',
      sleepHours: 8.0,
      sleepDelta: '+5% vs baseline',
      dailySteps: 7800,
      stepPercentage: 97,
      stressScore: 24,
      stressLabel: 'Relaxed / Optimal'
    },
    sleep: {
      sleepScore: 88,
      sleepHours: 8.0,
      remPercentage: 25,
      deepSleep: '2.1h',
      circadianStability: '95%',
      respiratoryRate: 14,
      sleepEfficiency: '92%'
    }
  },
  {
    id: '4421-SP',
    name: 'Sarah Jenkins',
    age: 29,
    gender: 'Female',
    ward: 'Maternity Wing',
    phone: '+923004567890',
    status: 'Observation',
    statusColor: 'amber',
    hr: 88,
    heartRate: 88,
    bp: '118/74',
    spo2: 99,
    spO2: 99,
    temp: '98.7°F',
    diagnosis: 'Gestational Diabetes Mellitus (GDM) Triage',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    href: '/patient/detail?id=4421-SP',
    alarms: [
      { id: 1, title: 'Glycemic Drift Alert', time: '25m ago', desc: '1-hour postprandial glucose measured 148 mg/dL after breakfast.', type: 'warning' }
    ],
    clinicalHistory: [
      {
        condition: 'Gestational Diabetes (28 Weeks)',
        diagnosed: 'Diagnosed at 24w',
        medications: ['Nutritional Therapy', 'Humulin Standby'],
        management: 'Continuous Glucose Monitoring'
      },
      {
        condition: 'Iron Deficiency in Pregnancy',
        diagnosed: 'Active',
        medications: ['Ferrous Fumarate 210mg (OD)'],
        management: 'Dietary Fortification'
      }
    ],
    labPanel: {
      panelName: 'Maternal & Fetal Glycemic Profile',
      date: 'April 26, 2026',
      metrics: [
        { name: '1-Hour Glucose Challenge', description: 'Post-Challenge Glycemia', value: '148 mg/dL', unit: 'mg/dL', status: 'Borderline', statusColor: 'amber' },
        { name: 'Fasting Plasma Glucose', description: 'Basal Glycemic Level', value: '92 mg/dL', unit: 'mg/dL', status: 'Normal', statusColor: 'primary' },
        { name: 'Hemoglobin', description: 'Maternal Oxygen Carrying', value: '11.8 g/dL', unit: 'g/dL', status: 'Normal', statusColor: 'primary' }
      ]
    },
    advisor: {
      icd10: 'O24.419',
      title: 'Gestational Diabetes Mellitus in Pregnancy',
      confidence: 95,
      differential: 'Diet-controlled gestational diabetes at 28 weeks. Fetal heart tones brisk at 144 bpm. No proteinuria or preeclamptic indices noted.',
      speechText: 'Primary diagnostic mapping is O 24.419, Gestational Diabetes Mellitus. Postprandial glucose curves indicate mild carbohydrate sensitivity. Recommend low glycemic index meal planning and continuous fetal movement logging.',
      transcripts: [
        { time: '11:10', text: 'Maternal vital signs stable. Continuous fetal heart monitoring shows baseline 144 bpm with good accelerations.', isLive: false },
        { time: '11:15', text: 'Patient completed nutritional counseling session on complex carbohydrate portion control.', isLive: false },
        { time: 'Live', text: 'Tracking continuous glucose monitor readings and uterine activity...', isLive: true }
      ],
      orders: [
        { id: 1, type: 'biotech', name: 'Order HbA1c & Fasting Insulin Panel', accepted: true },
        { id: 2, type: 'radiology', name: 'Schedule Growth Ultrasound at 32 Weeks', accepted: false }
      ]
    },
    lifestyle: {
      wellnessScore: 84,
      summary: 'Fetal maternal parameters are reassuring; dietary adherence maintains stable glycemic boundaries.',
      sleepHours: 7.5,
      sleepDelta: '-5% vs target',
      dailySteps: 5600,
      stepPercentage: 70,
      stressScore: 45,
      stressLabel: 'Mild Pregnancy Fatigue'
    },
    sleep: {
      sleepScore: 80,
      sleepHours: 7.5,
      remPercentage: 20,
      deepSleep: '1.6h',
      circadianStability: '88%',
      respiratoryRate: 16,
      sleepEfficiency: '84%'
    }
  },
  {
    id: '5512-UF',
    name: 'Umar Farooq',
    age: 26,
    gender: 'Male',
    ward: 'Acute Care Wing',
    phone: '+923005678901',
    status: 'Critical Alert',
    statusColor: 'error',
    hr: 108,
    heartRate: 108,
    bp: '122/80',
    spo2: 95,
    spO2: 95,
    temp: '102.4°F',
    diagnosis: 'Acute Bronchitis & High-Grade Febrile Syndrome',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    href: '/patient/detail?id=5512-UF',
    alarms: [
      { id: 1, title: 'High-Grade Fever Spike', time: '4m ago', desc: 'Core body temp reached 102.4°F (39.1°C) with persistent rigors.', type: 'error' },
      { id: 2, title: 'Sinus Tachycardia Alert', time: '15m ago', desc: 'Heart rate elevated to 108 bpm secondary to febrile metabolic response.', type: 'warning' }
    ],
    clinicalHistory: [
      {
        condition: 'Acute Infectious Bronchitis',
        diagnosed: 'Onset 3 Days Ago',
        medications: ['Azithromycin 500mg', 'Paracetamol 1g (QDS)'],
        management: 'Hydration & Antipyretic Protocol'
      },
      {
        condition: 'Seasonal Allergic Rhinitis',
        diagnosed: 'Diagnosed 2022',
        medications: ['Cetirizine 10mg (PRN)'],
        management: 'Environmental Control'
      }
    ],
    labPanel: {
      panelName: 'Infectious Disease & Inflammatory Markers',
      date: 'April 27, 2026',
      metrics: [
        { name: 'C-Reactive Protein (CRP)', description: 'Systemic Inflammation Marker', value: '48 mg/L', unit: 'mg/L', status: 'Critical', statusColor: 'error' },
        { name: 'White Blood Cell (WBC)', description: 'Leukocyte Defense', value: '14,200 /µL', unit: '/µL', status: 'Elevated', statusColor: 'error' },
        { name: 'Platelets', description: 'Thrombocyte Count', value: '240,000 /µL', unit: '/µL', status: 'Normal', statusColor: 'primary' }
      ]
    },
    advisor: {
      icd10: 'J20.9',
      title: 'Acute Bronchitis with High Pyrexia',
      confidence: 93,
      differential: 'Acute infectious bronchitis vs. atypical bacterial pneumonia. Patient displays productive cough, wheezing, and pyrexia of 102.4°F. Chest X-Ray indicated to rule out pulmonary consolidation.',
      speechText: 'Primary suggested diagnosis mapping is J 20.9, Acute Bronchitis with High Pyrexia. Patient demonstrates core temperature of 102.4 degrees Fahrenheit and tachycardia of 108 beats per minute. Recommend antipyretic administration, blood cultures, and urgent PA chest radiography.',
      transcripts: [
        { time: '08:40', text: 'Patient presents with severe productive cough, shivering chills, and persistent fever peaking at 102.4°F.', isLive: false },
        { time: '08:45', text: 'Chest auscultation reveals coarse bilateral rhonchi and mid-zone expiratory wheezing.', isLive: false },
        { time: 'Live', text: 'Analyzing inflammatory marker escalation and fever response curve...', isLive: true }
      ],
      orders: [
        { id: 1, type: 'biotech', name: 'Order Blood Cultures x 2 & Sputum Gram Stain', accepted: true },
        { id: 2, type: 'radiology', name: 'STAT PA and Lateral Chest Radiograph (X-Ray)', accepted: false }
      ]
    },
    lifestyle: {
      wellnessScore: 58,
      summary: 'Acutely impaired by febrile illness; elevated resting heart rate and disrupted sleep cycles due to coughing.',
      sleepHours: 5.2,
      sleepDelta: '-35% vs baseline',
      dailySteps: 1800,
      stepPercentage: 22,
      stressScore: 75,
      stressLabel: 'High Acute Illness Strain'
    },
    sleep: {
      sleepScore: 54,
      sleepHours: 5.2,
      remPercentage: 14,
      deepSleep: '0.8h',
      circadianStability: '60%',
      respiratoryRate: 22,
      sleepEfficiency: '62%'
    }
  },
  {
    id: '3389-SK',
    name: 'Sadia Khan',
    age: 31,
    gender: 'Female',
    ward: 'Surgical Observation',
    phone: '+923006789012',
    status: 'Critical Alert',
    statusColor: 'error',
    hr: 96,
    heartRate: 96,
    bp: '112/70',
    spo2: 99,
    spO2: 99,
    temp: '99.8°F',
    diagnosis: 'Suspected Acute Appendicitis & RLQ Guarding',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    href: '/patient/detail?id=3389-SK',
    alarms: [
      { id: 1, title: 'Acute Abdominal Pain Spike', time: '8m ago', desc: 'Severe sharp pain localized at McBurney\'s point with involuntary guarding.', type: 'error' },
      { id: 2, title: 'Low-Grade Pyrexia Drift', time: '30m ago', desc: 'Temperature shifted up to 99.8°F accompanied by nausea and anorexia.', type: 'warning' }
    ],
    clinicalHistory: [
      {
        condition: 'Suspected Acute Appendicitis',
        diagnosed: 'Onset 14 Hours Ago',
        medications: ['IV Ringer Lactate', 'NPO Status Confirmed'],
        management: 'Surgical Team Standby'
      },
      {
        condition: 'Laparoscopic Cholecystectomy',
        diagnosed: 'Resolved (2020)',
        medications: ['None'],
        management: 'Surgical History Cleared'
      }
    ],
    labPanel: {
      panelName: 'Acute Surgical Emergency Panel',
      date: 'April 27, 2026',
      metrics: [
        { name: 'White Blood Cell (WBC)', description: 'Neutrophilic Leukocytosis', value: '16,800 /µL', unit: '/µL', status: 'Critical', statusColor: 'error' },
        { name: 'Neutrophil Shift', description: 'Left Shift Band Cells', value: '88%', unit: '%', status: 'Elevated', statusColor: 'error' },
        { name: 'Beta-hCG', description: 'Pregnancy Exclusion', value: 'Negative', unit: '', status: 'Normal', statusColor: 'primary' }
      ]
    },
    advisor: {
      icd10: 'K35.80',
      title: 'Unspecified Acute Appendicitis',
      confidence: 97,
      differential: 'Acute uncomplicated appendicitis with positive McBurney\'s and Rovsing\'s sign vs. acute mesenteric adenitis. Ultrasound and surgical consult urgent.',
      speechText: 'Primary suggested diagnosis mapping is K 35.80, Unspecified Acute Appendicitis. Patient exhibits acute right lower quadrant localized guarding, rebound tenderness at McBurney\'s point, and leukocytosis. Recommend immediate NPO protocol, surgical team consult, and urgent abdominal ultrasound.',
      transcripts: [
        { time: '10:05', text: 'Patient reports severe sharp pain migrating from periumbilical area to right iliac fossa over 14 hours.', isLive: false },
        { time: '10:10', text: 'Exam demonstrates positive McBurney\'s point tenderness, positive Rovsing\'s sign, and localized rigidity.', isLive: false },
        { time: 'Live', text: 'Synthesizing Alvarado score metrics and emergency surgical readiness...', isLive: true }
      ],
      orders: [
        { id: 1, type: 'surgery', name: 'Emergency General Surgery Consultation', accepted: true },
        { id: 2, type: 'radiology', name: 'STAT Abdominal and Pelvic Ultrasound', accepted: true }
      ]
    },
    lifestyle: {
      wellnessScore: 60,
      summary: 'Severely restricted mobility due to acute peritoneal discomfort; fasting protocol active.',
      sleepHours: 4.8,
      sleepDelta: '-45% vs baseline',
      dailySteps: 1200,
      stepPercentage: 15,
      stressScore: 82,
      stressLabel: 'Acute Pain Elevation'
    },
    sleep: {
      sleepScore: 48,
      sleepHours: 4.8,
      remPercentage: 11,
      deepSleep: '0.6h',
      circadianStability: '55%',
      respiratoryRate: 20,
      sleepEfficiency: '52%'
    }
  },
  {
    id: '6643-TT',
    name: 'Tani Tariq',
    age: 24,
    gender: 'Female',
    ward: 'Neurological Day Care',
    phone: '+923007890123',
    status: 'Observation',
    statusColor: 'amber',
    hr: 74,
    heartRate: 74,
    bp: '116/76',
    spo2: 98,
    spO2: 98,
    temp: '98.6°F',
    diagnosis: 'Intractable Migraine with Visual Aura & Photophobia',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    href: '/patient/detail?id=6643-TT',
    alarms: [
      { id: 1, title: 'Severe Photophobia Warning', time: '10m ago', desc: 'Patient in dimmed observation room; severe unilateral hemicranial throbbing.', type: 'warning' }
    ],
    clinicalHistory: [
      {
        condition: 'Chronic Migraine with Aura',
        diagnosed: 'Diagnosed 2023',
        medications: ['Sumatriptan 50mg (PRN)', 'Ondansetron 4mg'],
        management: 'Trigger Avoidance & Dark Therapy'
      },
      {
        condition: 'Mild Iron Deficiency',
        diagnosed: 'Diagnosed 2024',
        medications: ['Ferrous Sulfate 200mg (Daily)'],
        management: 'Routine Hematology Review'
      }
    ],
    labPanel: {
      panelName: 'Neurovascular & Metabolic Screening',
      date: 'April 26, 2026',
      metrics: [
        { name: 'Serum Magnesium', description: 'Neurovascular Balance', value: '1.6 mg/dL', unit: 'mg/dL', status: 'Low', statusColor: 'amber' },
        { name: 'Hemoglobin', description: 'Oxygen Capacity', value: '11.4 g/dL', unit: 'g/dL', status: 'Borderline', statusColor: 'amber' },
        { name: 'Serum Electrolytes', description: 'Sodium/Chloride/Potassium', value: 'Optimal', unit: '', status: 'Normal', statusColor: 'primary' }
      ]
    },
    advisor: {
      icd10: 'G43.109',
      title: 'Migraine with Visual Aura',
      confidence: 94,
      differential: 'Classic migraine with scintillating scotoma vs. tension-type headache with autonomic overlay. Intravenous hydration and magnesium infusion indicated.',
      speechText: 'Primary suggested diagnosis mapping is G 43.109, Migraine with Visual Aura. Patient experiences unilateral throbbing headache, photophobia, and visual scintillations. Recommend intravenous magnesium sulfate, antiemetics, and non-pharmacological dark room quietude.',
      transcripts: [
        { time: '12:15', text: 'Patient reports sudden onset zigzag visual disturbances followed 30 minutes later by severe left hemicranial throbbing.', isLive: false },
        { time: '12:20', text: 'Marked photophobia and phonophobia present. Cranial nerves II through XII grossly intact.', isLive: false },
        { time: 'Live', text: 'Synthesizing neuro-headache protocol and medication responsiveness...', isLive: true }
      ],
      orders: [
        { id: 1, type: 'pharmacy', name: 'Administer IV Magnesium Sulfate 1g in 100mL D5W', accepted: true },
        { id: 2, type: 'neurology', name: 'Schedule Outpatient Brain MRI with Contrast', accepted: false }
      ]
    },
    lifestyle: {
      wellnessScore: 70,
      summary: 'Sensory sensitivity heightened during acute attack; darkness therapy and neuro-calm protocol engaged.',
      sleepHours: 6.4,
      sleepDelta: '-15% vs target',
      dailySteps: 3400,
      stepPercentage: 42,
      stressScore: 65,
      stressLabel: 'Sensory Overload'
    },
    sleep: {
      sleepScore: 68,
      sleepHours: 6.4,
      remPercentage: 16,
      deepSleep: '1.1h',
      circadianStability: '72%',
      respiratoryRate: 15,
      sleepEfficiency: '74%'
    }
  }
];

export function createDynamicPatient(input: {
  name: string;
  age: number;
  gender: string;
  ward: string;
  phone?: string;
  hr?: number;
  bp?: string;
  spo2?: number;
  temp?: string;
  diagnosis?: string;
  status?: string;
}): PatientRecord {
  const idNum = Math.floor(1000 + Math.random() * 9000);
  const id = `PT-${idNum}`;
  const hr = input.hr || 78;
  const bp = input.bp || '120/80';
  const spo2 = input.spo2 || 98;
  const temp = input.temp || '98.6°F';
  const name = input.name || 'New Patient';
  const diagnosis = input.diagnosis || 'General Clinical Triage';

  const isFever = diagnosis.toLowerCase().includes('fever') || parseFloat(temp) >= 100.4;
  const isAbdominal = diagnosis.toLowerCase().includes('append') || diagnosis.toLowerCase().includes('abdomen') || diagnosis.toLowerCase().includes('stomach') || diagnosis.toLowerCase().includes('pain');
  const isCardiac = diagnosis.toLowerCase().includes('cardiac') || diagnosis.toLowerCase().includes('tachy') || diagnosis.toLowerCase().includes('heart') || hr > 115;
  const isRespiratory = diagnosis.toLowerCase().includes('bronch') || diagnosis.toLowerCase().includes('asthma') || diagnosis.toLowerCase().includes('cough') || spo2 < 95;
  const isNeuro = diagnosis.toLowerCase().includes('migraine') || diagnosis.toLowerCase().includes('headache') || diagnosis.toLowerCase().includes('neuro');

  let icd10 = 'R69';
  let advisorTitle = 'Illness, Unspecified';
  let speechText = `Primary suggested diagnosis mapping is R 69, Clinical observation for ${name}. Hemodynamics are documented at heart rate ${hr} and oxygen saturation ${spo2} percent. Continue standard ward protocol.`;
  let differential = `Differential diagnostic synthesis queued for ${diagnosis}. Monitor vital trajectories closely.`;
  let labPanelName = 'Routine Admission Blood Panel';
  let labMetrics: LabMetric[] = [
    { name: 'Complete Blood Count (CBC)', description: 'Cellular Profile', value: 'Normal', status: 'Normal', statusColor: 'primary' },
    { name: 'Basic Metabolic Profile', description: 'Electrolytes & Creatinine', value: 'Normal', status: 'Normal', statusColor: 'primary' }
  ];
  let alarms: AlarmItem[] = [];

  if (isFever) {
    icd10 = 'R50.9';
    advisorTitle = 'Pyrexia & Acute Febrile Syndrome';
    speechText = `Primary suggested diagnosis mapping is R 50.9, Acute Febrile Syndrome for ${name}. Temperature elevated at ${temp} with compensatory heart rate of ${hr} beats per minute. Recommend blood cultures, antipyretic protocol, and serial vital checks.`;
    differential = 'Acute pyrexia secondary to viral syndrome vs. bacterial focal infection. Assess inflammatory biomarkers and urinalysis.';
    labPanelName = 'Infectious Disease & Febrile Workup';
    labMetrics = [
      { name: 'C-Reactive Protein (CRP)', description: 'Systemic Inflammation', value: '44 mg/L', unit: 'mg/L', status: 'Critical', statusColor: 'error' },
      { name: 'White Blood Cell (WBC)', description: 'Leukocyte Reaction', value: '13,800 /µL', unit: '/µL', status: 'Elevated', statusColor: 'error' },
      { name: 'Serum Lactate', description: 'Tissue Perfusion', value: '1.2 mmol/L', unit: 'mmol/L', status: 'Normal', statusColor: 'primary' }
    ];
    alarms.push({ id: 1, title: 'Febrile Temperature Alert', time: 'Just now', desc: `Core body temperature measured at ${temp}. Immediate cooling and antipyretics ordered.`, type: 'error' });
  } else if (isAbdominal) {
    icd10 = 'R10.32';
    advisorTitle = 'Acute Abdominal Tenderness / Suspected Appendicitis';
    speechText = `Primary suggested diagnosis mapping is R 10.32, Acute Abdominal Tenderness for ${name}. Differential includes acute appendiceal inflammation versus acute gastroenteritis. Recommend ultrasound imaging and surgical consult.`;
    differential = 'Acute localized peritonitis vs. appendicitis vs. functional colonic spasm. Ultrasound and abdominal radiography indicated.';
    labPanelName = 'Acute Abdominal & Surgical Triage';
    labMetrics = [
      { name: 'WBC with Differential', description: 'Leukocytosis Check', value: '15,600 /µL', unit: '/µL', status: 'Critical', statusColor: 'error' },
      { name: 'Serum Lipase', description: 'Pancreatic Enzyme', value: '38 U/L', unit: 'U/L', status: 'Normal', statusColor: 'primary' },
      { name: 'Urinalysis', description: 'Urinary Tract Assessment', value: 'Clear', unit: '', status: 'Normal', statusColor: 'primary' }
    ];
    alarms.push({ id: 1, title: 'Abdominal Guarding Warning', time: 'Just now', desc: 'Patient reports severe localized pain with physical guarding.', type: 'error' });
  } else if (isCardiac) {
    icd10 = 'I47.9';
    advisorTitle = 'Paroxysmal Tachycardia & Cardiac Strain';
    speechText = `Primary suggested diagnosis mapping is I 47.9, Cardiac Tachycardia for ${name}. Heart rate is elevated at ${hr} beats per minute. Recommend 12-lead ECG, troponin check, and continuous cardiac telemetry.`;
    differential = 'Sinus tachycardia vs. atrial flutter with variable conduction. Rule out acute ischemic trigger or metabolic hyperthyroidism.';
    labPanelName = 'Cardiac Enzyme & Electrolyte Panel';
    labMetrics = [
      { name: 'Cardiac Troponin T', description: 'Myocardial Necrosis Marker', value: '< 0.01 ng/mL', unit: 'ng/mL', status: 'Normal', statusColor: 'primary' },
      { name: 'Serum Potassium', description: 'Electrolyte Stability', value: '4.1 mEq/L', unit: 'mEq/L', status: 'Normal', statusColor: 'primary' },
      { name: 'Serum Magnesium', description: 'Ventricular Stability', value: '2.0 mg/dL', unit: 'mg/dL', status: 'Normal', statusColor: 'primary' }
    ];
    alarms.push({ id: 1, title: 'Tachycardia Alert', time: 'Just now', desc: `Heart rate spiked to ${hr} bpm on telemetry.`, type: 'error' });
  } else if (isRespiratory) {
    icd10 = 'J45.909';
    advisorTitle = 'Acute Respiratory Distress & Bronchospasm';
    speechText = `Primary suggested diagnosis mapping is J 45.909, Acute Bronchospasm for ${name}. Oxygen saturation measured at ${spo2} percent. Recommend bronchodilator nebulization and supplemental oxygen titration.`;
    differential = 'Acute asthma exacerbation vs. infectious viral bronchitis. Auscultate for bilateral expiratory wheezes and prolonged expiratory phase.';
    labPanelName = 'Pulmonary & Blood Gas Assessment';
    labMetrics = [
      { name: 'Arterial Blood SpO2', description: 'Pulse Oximetry', value: `${spo2}%`, unit: '%', status: spo2 < 95 ? 'Elevated' : 'Normal', statusColor: spo2 < 95 ? 'amber' : 'primary' },
      { name: 'Total IgE', description: 'Allergic Inflammatory', value: '180 IU/mL', unit: 'IU/mL', status: 'Borderline', statusColor: 'amber' }
    ];
    alarms.push({ id: 1, title: 'Desaturation Warning', time: 'Just now', desc: `Oxygen saturation dipped to ${spo2}%. Supplemental O2 active.`, type: 'warning' });
  } else if (isNeuro) {
    icd10 = 'G43.909';
    advisorTitle = 'Acute Cephalea & Migrainous Disorder';
    speechText = `Primary suggested diagnosis mapping is G 43.909, Acute Migraine Syndrome for ${name}. Blood pressure is ${bp}. Recommend analgesia, dark-room therapy, and neurovascular observation.`;
    differential = 'Severe vascular migraine vs. tension headache. Exclude meningismus or acute hypertensive encephalopathy.';
    labPanelName = 'Neurovascular & Inflammatory Screen';
    labMetrics = [
      { name: 'Serum Electrolytes', description: 'Metabolic Balance', value: 'Stable', unit: '', status: 'Normal', statusColor: 'primary' },
      { name: 'ESR (Sed Rate)', description: 'Vascular Inflammation', value: '12 mm/hr', unit: 'mm/hr', status: 'Normal', statusColor: 'primary' }
    ];
    alarms.push({ id: 1, title: 'Severe Pain Alert', time: 'Just now', desc: 'Patient experiencing high intensity throbbing cephalalgia.', type: 'warning' });
  }

  const avatar = input.gender?.toLowerCase() === 'female'
    ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'
    : 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80';

  const statusColor = (alarms.length > 0 && alarms.some(a => a.type === 'error')) ? 'error' : (alarms.length > 0 ? 'amber' : 'primary');
  const status = statusColor === 'error' ? 'Critical Alert' : (statusColor === 'amber' ? 'Observation' : 'Stable');

  return {
    id,
    name,
    age: input.age || 30,
    gender: input.gender || 'Not Specified',
    ward: input.ward || 'General Medical Ward',
    phone: input.phone || '+923000000000',
    status,
    statusColor,
    hr,
    heartRate: hr,
    bp,
    spo2,
    spO2: spo2,
    temp,
    diagnosis,
    avatar,
    href: `/patient/detail?id=${id}`,
    alarms,
    clinicalHistory: [
      {
        condition: diagnosis,
        diagnosed: 'Admitted Today',
        medications: ['Supportive Protocol', 'IV Hydration PRN'],
        management: 'Continuous Ward Telemetry'
      }
    ],
    labPanel: {
      panelName: labPanelName,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      metrics: labMetrics
    },
    advisor: {
      icd10,
      title: advisorTitle,
      confidence: 92,
      differential,
      speechText,
      transcripts: [
        { time: 'Admit', text: `Patient ${name} admitted to ${input.ward || 'ward'} with chief complaint: ${diagnosis}.`, isLive: false },
        { time: 'Triage', text: `Vital signs recorded: Heart Rate ${hr} bpm, Blood Pressure ${bp}, SpO2 ${spo2}%, Core Temp ${temp}.`, isLive: false },
        { time: 'Live', text: `AI sentinel tracking real-time clinical biomarkers and telemetry trends for ${name}...`, isLive: true }
      ],
      orders: [
        { id: 1, type: 'biotech', name: `Order STAT ${labPanelName}`, accepted: true },
        { id: 2, type: 'radiology', name: 'Schedule Diagnostic Imaging Evaluation', accepted: false }
      ]
    },
    lifestyle: {
      wellnessScore: statusColor === 'error' ? 62 : 82,
      summary: `Clinical status actively managed under ${diagnosis} protocol.`,
      sleepHours: 7.0,
      sleepDelta: 'Normal for inpatient ward',
      dailySteps: 2500,
      stepPercentage: 35,
      stressScore: statusColor === 'error' ? 76 : 38,
      stressLabel: statusColor === 'error' ? 'Acute Physiological Stress' : 'Controlled Baseline'
    },
    sleep: {
      sleepScore: statusColor === 'error' ? 58 : 78,
      sleepHours: 7.0,
      remPercentage: 18,
      deepSleep: '1.2h',
      circadianStability: '78%',
      respiratoryRate: 16,
      sleepEfficiency: '78%'
    }
  };
}

export function initializePatients(): PatientRecord[] {
  if (typeof window === 'undefined') {
    return DEFAULT_PATIENTS;
  }

  const saved = localStorage.getItem('vitalis_patients');
  if (!saved) {
    localStorage.setItem('vitalis_patients', JSON.stringify(DEFAULT_PATIENTS));
    return DEFAULT_PATIENTS;
  }

  try {
    const list: any[] = JSON.parse(saved);
    // If the list is older format (less than 7 patients or missing clinicalHistory), upgrade it!
    const hasFullSchema = list.length >= 4 && list[0] && Array.isArray(list[0].clinicalHistory) && list[0].labPanel && list[0].advisor;
    
    // Check if Umar, Sadia, or Tani exist in the list. If not, append them!
    const names = list.map(p => p.name?.toLowerCase());
    let updated = false;

    DEFAULT_PATIENTS.forEach(defPatient => {
      const idx = list.findIndex(p => p.id === defPatient.id || p.name?.toLowerCase() === defPatient.name.toLowerCase());
      if (idx === -1) {
        list.push(defPatient);
        updated = true;
      } else if (!list[idx].clinicalHistory || !list[idx].labPanel || !list[idx].advisor || !list[idx].temp) {
        // Upgrade existing with rich clinical data
        list[idx] = { ...defPatient, ...list[idx], clinicalHistory: defPatient.clinicalHistory, labPanel: defPatient.labPanel, advisor: defPatient.advisor, alarms: defPatient.alarms, temp: defPatient.temp, lifestyle: defPatient.lifestyle, sleep: defPatient.sleep };
        updated = true;
      }
    });

    if (updated || !hasFullSchema) {
      localStorage.setItem('vitalis_patients', JSON.stringify(list));
    }
    return list;
  } catch (e) {
    localStorage.setItem('vitalis_patients', JSON.stringify(DEFAULT_PATIENTS));
    return DEFAULT_PATIENTS;
  }
}

export function getPatientById(id: string): PatientRecord {
  const cleanId = (id || '').replace(/^#/, '');
  const allPatients = initializePatients();
  
  const found = allPatients.find(p => p.id === cleanId || p.id === id || p.id.replace(/^#/, '') === cleanId);
  if (found) {
    // Ensure all sub-objects exist
    if (!found.clinicalHistory || !found.labPanel || !found.advisor) {
      const def = DEFAULT_PATIENTS.find(d => d.id === found.id);
      if (def) {
        return { ...def, ...found };
      }
      return createDynamicPatient({
        name: found.name,
        age: found.age,
        gender: found.gender,
        ward: found.ward,
        phone: found.phone,
        hr: found.hr || found.heartRate,
        bp: found.bp,
        spo2: found.spo2 || found.spO2,
        temp: found.temp,
        diagnosis: found.diagnosis,
        status: found.status
      });
    }
    return found;
  }

  // Fallback to default by id, or first default patient
  const defMatch = DEFAULT_PATIENTS.find(d => d.id === cleanId);
  if (defMatch) return defMatch;

  return DEFAULT_PATIENTS[0];
}
