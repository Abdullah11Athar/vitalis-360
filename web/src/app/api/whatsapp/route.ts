import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { to, message } = await request.json();
    
    // WaAPI Token provided by user
    const apiToken = "J3oZAfuiEzJ0oZ6gJm4xTDiEjsmW8MJFoih74vRU60445376";
    
    // 1. Fetch active instances from WaAPI to dynamically acquire Instance ID
    const listResponse = await fetch('https://waapi.app/api/v1/instances', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiToken}`
      }
    });

    if (!listResponse.ok) {
      const errorText = await listResponse.text();
      return NextResponse.json({ error: `WaAPI list instances failed: ${errorText}` }, { status: listResponse.status });
    }

    const listData = await listResponse.json();
    const instances = listData.instances || [];

    if (instances.length === 0) {
      return NextResponse.json({ error: 'No WaAPI instances found. Please create an instance in your WaAPI dashboard.' }, { status: 400 });
    }

    // Grab the first active instance
    const activeInstance = instances[0];
    const instanceId = activeInstance.id;

    // 2. Format recipient phone number: only digits (e.g. "923001234567")
    const cleanPhone = to.replace(/[^\d]/g, "");
    const chatId = `${cleanPhone}@c.us`;

    // 3. Send message via WaAPI instance
    const sendResponse = await fetch(`https://waapi.app/api/v1/instances/${instanceId}/client/action/send-message`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiToken}`
      },
      body: JSON.stringify({
        chatId: chatId,
        message: message
      })
    });

    if (!sendResponse.ok) {
      const errorText = await sendResponse.text();
      return NextResponse.json({ error: `WaAPI send message failed: ${errorText}` }, { status: sendResponse.status });
    }

    const sendData = await sendResponse.json();

    return NextResponse.json({
      success: true,
      sid: sendData.data?.message?.id?._serialized || `WA-${Date.now()}`,
      status: "sent",
      to: chatId,
      message: message,
      gateway: "WaAPI Production Gateway",
      instanceId: instanceId
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
