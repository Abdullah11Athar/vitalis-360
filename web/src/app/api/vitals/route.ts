import { NextResponse } from 'next/server';

// Mock Patient Vitals Database
const patients = [
  { id: '1', name: 'Zeeshan Khan', heartRate: 135, bp: '175/110', spO2: 93, level: 3 },
  { id: '2', name: 'Jane Doe', heartRate: 72, bp: '120/80', spO2: 98, level: 1 }
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const patientId = searchParams.get('id');

  if (patientId) {
    const patient = patients.find(p => p.id === patientId);
    if (!patient) return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    return NextResponse.json(patient);
  }

  return NextResponse.json(patients);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Simulate updating vitals from Health Connect
    // In a real app, this would use the Android Health Connect API
    
    // Check if the vitals hit a critical threshold
    if (body.heartRate > 120 || parseInt(body.bp.split('/')[0]) > 160) {
      // Trigger E911 Alert system internally
      console.log('CRITICAL ALERT: Threshold breached. E911 Standby initiated.');
      
      return NextResponse.json({ 
        success: true, 
        message: 'Vitals logged. CRITICAL ALERT TRIGGERED.',
        actionRequired: 'E911_STANDBY'
      });
    }

    return NextResponse.json({ success: true, message: 'Vitals logged.' });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
  }
}
