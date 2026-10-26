import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { 
      amount, 
      patientName = "Zeeshan Ali", 
      patientId = "8829-XL",
      cardNumber = "",
      expiry = "12/28",
      cvv = "123",
      customSecretKey
    } = await req.json();

    const stripeSecretKey = (customSecretKey || process.env.STRIPE_SECRET_KEY || '').trim();
    if (!stripeSecretKey) {
      return NextResponse.json(
        { success: false, error: "Stripe Secret Key is not configured on the server." },
        { status: 500 }
      );
    }

    const cleanCard = (cardNumber || '').toString().trim();
    const digits = cleanCard.replace(/\D/g, '');

    // Map card numbers to authentic Stripe testing tokens for accurate issuer decline behavior
    let cardToken = 'tok_visa'; // default valid visa

    if (
      digits.endsWith('9995') || 
      cleanCard.toLowerCase().includes('low') || 
      cleanCard.toLowerCase().includes('insufficient')
    ) {
      // Official Stripe Insufficient Funds (Low Balance) Token
      cardToken = 'tok_chargeDeclinedInsufficientFunds';
    } else if (digits.endsWith('0002') || cleanCard.toLowerCase().includes('decline')) {
      // Official Stripe Card Declined Token
      cardToken = 'tok_chargeDeclined';
    } else if (digits.endsWith('0005')) {
      // Expired Card Token
      cardToken = 'tok_chargeDeclinedExpiredCard';
    } else if (digits.endsWith('0069')) {
      // Incorrect CVC Token
      cardToken = 'tok_chargeDeclinedIncorrectCvc';
    } else if (digits.endsWith('4242') || digits.length >= 15) {
      cardToken = 'tok_visa';
    }

    const cents = Math.round(Number(amount || 142.50) * 100);

    const params = new URLSearchParams();
    params.append('amount', cents.toString());
    params.append('currency', 'usd');
    params.append('description', `VITALIS-360 Clinical Copay: ${patientName} (${patientId})`);
    params.append('payment_method_data[type]', 'card');
    params.append('payment_method_data[card][token]', cardToken);
    params.append('confirm', 'true');
    params.append('return_url', 'https://projects.aaenterprisetech.com/kaggle/project/billing/ledger');
    params.append('metadata[patientName]', patientName);
    params.append('metadata[patientId]', patientId);
    params.append('metadata[platform]', 'VITALIS-360 EMR');

    const stripeRes = await fetch('https://api.stripe.com/v1/payment_intents', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeSecretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    });

    const data = await stripeRes.json();

    if (!stripeRes.ok) {
      const err = data.error || {};
      const declineCode = err.decline_code || err.code || 'card_declined';
      let userMessage = err.message || "Payment authorization failed.";
      
      if (declineCode === 'insufficient_funds') {
        userMessage = "Card Declined: Your card has insufficient funds / low balance. Please use an alternate card or top up your account.";
      } else if (declineCode === 'generic_decline') {
        userMessage = "Card Declined: The transaction was declined by the card issuer.";
      } else if (declineCode === 'expired_card') {
        userMessage = "Card Declined: The card has expired. Please check the expiration date.";
      } else if (declineCode === 'incorrect_cvc') {
        userMessage = "Card Declined: Security code (CVC) is incorrect.";
      }

      return NextResponse.json(
        { 
          success: false, 
          error: userMessage,
          decline_code: declineCode 
        },
        { status: 400 }
      );
    }

    if (data.status !== 'succeeded') {
      return NextResponse.json(
        { 
          success: false, 
          error: `Payment status is ${data.status}. Not confirmed.`,
          decline_code: data.status
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      paymentIntentId: data.id,
      chargeId: data.latest_charge || data.id,
      status: data.status,
      amount: data.amount_received ? data.amount_received / 100 : amount,
      currency: data.currency,
      created: data.created,
      livemode: data.livemode
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Internal payment processing error" },
      { status: 500 }
    );
  }
}
