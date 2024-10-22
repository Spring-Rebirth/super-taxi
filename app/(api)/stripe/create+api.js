import { Stripe } from 'stripe'

const stripe = new Stripe(process.env.EXPO_SECRET_STRIPE_API_KEY);

export async function POST(request) {
    const body = await request.json();
    const { name, email, amount } = body;
    if (!name || !email || !amount) {
        return new Response(
            JSON.stringify({
                error: 'Please enter a valid email address',
                status: 400
            })
        )
    }
}

app.post('/payment-sheet', async (req, res) => {
    // Use an existing Customer ID if this is a returning customer.
    const customer = await stripe.customers.create();
    const ephemeralKey = await stripe.ephemeralKeys.create(
        { customer: customer.id },
        { apiVersion: '2024-09-30.acacia' }
    );
    const setupIntent = await stripe.setupIntents.create({
        customer: customer.id,
        // In the latest version of the API, specifying the `automatic_payment_methods` parameter
        // is optional because Stripe enables its functionality by default.
        automatic_payment_methods: {
            enabled: true,
        },
    });
    res.json({
        setupIntent: setupIntent.client_secret,
        ephemeralKey: ephemeralKey.secret,
        customer: customer.id,
        publishableKey: 'pk_test_51QCQ22FtcuUTeLbKDvnvy8gGAuaeGDOTqjCgMjp8FGXvzdtRNHroyDrG6oZwPackuIHdiGSg0FTXwFcDweegTUey00VmF3aOgV'
    })
});