// /app/(api)/create-payment-intent.js

import Stripe from 'stripe';

const stripe = new Stripe(`${process.env.EXPO_SECRET_STRIPE_API_KEY}`, {
    apiVersion: '2024-09-30.acacia',
});

export async function POST(request) {
    try {
        const { amount, currency, driverId, rideTime } = await request.json();

        // 创建客户
        const customer = await stripe.customers.create();

        // 创建支付意图
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency,
            customer: customer.id,
            metadata: {
                driverId: driverId.toString(),
                rideTime: rideTime.toString(),
            },
        });

        // 创建临时密钥
        const ephemeralKey = await stripe.ephemeralKeys.create(
            { customer: customer.id },
            { apiVersion: '2024-09-30.acacia' }
        );

        return new Response(
            JSON.stringify({
                paymentIntent: paymentIntent.client_secret,
                ephemeralKey: ephemeralKey.secret,
                customer: customer.id,
            }),
            {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    } catch (error) {
        console.error('Error creating payment sheet params:', error);
        return new Response(
            JSON.stringify({ error: error.message }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    }
}
