import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Simulate Bandwidth E911 EVS API integration
    // Requires Doctor/Receptionist Endorsement (HITL rule)
    if (!body.doctorEndorsed) {
      return NextResponse.json(
        { error: 'Human-in-the-Loop constraint: Doctor endorsement required for E911 dispatch.' },
        { status: 403 }
      );
    }

    const payload = {
      notificationType: 'EMERGENCY_DISPATCH',
      patientId: body.patientId,
      location: {
        lat: 37.7749, // Mock coordinates
        lng: -122.4194,
        address: '123 Recovery Lane, Apt 4B'
      },
      vitalsAtDispatch: body.vitals,
      timestamp: new Date().toISOString()
    };

    console.log('--- BANDWIDTH E911 API DISPATCHED ---', payload);

    // Dispatch real-time emergency broadcast via WaAPI WhatsApp instance
    try {
      const apiToken = "J3oZAfuiEzJ0oZ6gJm4xTDiEjsmW8MJFoih74vRU60445376";
      const listRes = await fetch('https://waapi.app/api/v1/instances', {
        headers: { 'Authorization': `Bearer ${apiToken}`, 'Accept': 'application/json' }
      });
      if (listRes.ok) {
        const listData = await listRes.json();
        if (listData.instances && listData.instances.length > 0) {
          const instId = listData.instances[0].id;
          await fetch(`https://waapi.app/api/v1/instances/${instId}/client/action/send-message`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${apiToken}`, 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({
              chatId: "923000000000@c.us",
              message: `🚨 *[VITALIS-360 EMERGENCY SOS DISPATCHED]*\n\nAmbulance E911 dispatched for Patient *${body.patientName || body.patientId || 'Active Patient'}*!\n\n🩺 *Vitals at Dispatch:*\n• Heart Rate: *${body.heartRate || 142} bpm*\n• Blood Pressure: *${body.bp || '110/70'}*\n• SpO2: *${body.spO2 || 88}%*\n\n📍 *Location:* 123 Recovery Lane, Apt 4B\n⏱️ *Response Time:* Estimated < 4 minutes.`
            })
          });
          console.log('--- WAAPI WHATSAPP SOS ALERT SENT ---');
        }
      }
    } catch (e) {
      console.error("WhatsApp SOS dispatch failed:", e);
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Ambulance dispatched via E911 network.',
      dispatchId: 'E911-' + Math.floor(Math.random() * 1000000)
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to dispatch' }, { status: 500 });
  }
}
