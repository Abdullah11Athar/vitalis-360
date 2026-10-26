import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rxcuis = searchParams.get('rxcuis'); // e.g. "207106+656659" or "7531+36437"

  if (!rxcuis) {
    return NextResponse.json({ error: 'Missing rxcuis parameter' }, { status: 400 });
  }

  try {
    const response = await fetch(`https://rxnav.nlm.nih.gov/REST/interaction/list.json?rxcuis=${rxcuis}`);
    if (!response.ok) {
      throw new Error(`RxNav API responded with status ${response.status}`);
    }
    const data = await response.json();
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
