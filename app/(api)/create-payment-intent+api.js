// /app/(api)/create-payment-intent.js

import Stripe from 'stripe';

const stripe = new Stripe(`${process.env.EXPO_SECRET_STRIPE_API_KEY}`, {
    apiVersion: '2024-09-30.acacia',
});

export async function POST(request) {
    try {
        const { amount, currency, driverId, rideTime } = await request.json();

        // 在此可以添加其他逻辑，例如验证数据、记录订单等

        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency,
            metadata: {
                driverId: driverId.toString(),
                rideTime: rideTime.toString(),
            },
        });

        return new Response(
            JSON.stringify({ clientSecret: paymentIntent.client_secret }),
            {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    } catch (error) {
        console.error('Error creating payment intent:', error);
        return new Response(
            JSON.stringify({ error: error.message }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    }
}

