import Stripe from 'stripe';

const stripe = new Stripe(process.env.EXPO_SECRET_STRIPE_API_KEY, {
    apiVersion: '2023-08-16',
});

export async function POST(request) {
    try {
        const { amount, currency, driverId, rideTime } = await request.json();

        // 创建客户
        const customer = await stripe.customers.create();

        // 创建临时密钥
        const ephemeralKey = await stripe.ephemeralKeys.create(
            { customer: customer.id },
            { apiVersion: '2023-08-16' }
        );

        // 创建支付意图
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency,
            customer: customer.id,
            automatic_payment_methods: { enabled: true },
            metadata: {
                driverId: driverId.toString(),
                rideTime: rideTime.toString(),
            },
        });

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
        console.error('创建支付表参数时出错：', error);
        return new Response(
            JSON.stringify({ error: error.message }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    }
}
import { create } from 'zustand';
