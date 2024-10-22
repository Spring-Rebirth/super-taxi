const { create } = require('react-test-renderer');

const stripe = require('stripe')('sk_test_51QCQ22FtcuUTeLbKwAOxfPrig4sP3x9yjC58rt5r0qL6hfNctS8h56yst11AcRVu8C7WCUl2jTeQ8m7FAopYkEv900t2imyZVh');
// This example sets up an endpoint using the Express framework.
// Watch this video to get started: https://youtu.be/rPR2aJ6XnAc.

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