import { View, Text, Alert } from 'react-native'
import React, { useState } from 'react'
import CustomButton from './CustomButton'
import { PaymentSheetError, useStripe } from '@stripe/stripe-react-native'


export default function Payment({ fullName, email, amount, driverId, rideTime }) {
    const { initPaymentSheet, presentPaymentSheet } = useStripe();
    const [success, setSuccess] = useState(false);

    const confirmHandler = async (paymentMethod, intentCreationCallBack) => {
        const { paymentIntent, customer } = await fetchAPI(
            "/(api)/(stripe)/create",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: fullName || email.split("@")[0],
                    email: email,
                    amount: amount,
                    paymentMethodId: paymentMethod.id
                })
            }
        );

        if (paymentIntent.client_secret) {
            const { result } = await fetchAPI("/(api)/(stripe)/pay", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    payment_method_id: paymentMethod.id,
                    payment_intent_id: paymentIntent.id,
                    customer_id: customer
                }),
            });

            if (result.client_secret) {

            }
        }

        const { clientSecret, error } = await Response.json();
        if (clientSecret) {
            intentCreationCallBack({ clientSecret });
        } else {
            intentCreationCallBack({ error });
        }
    }

    const initializePaymentSheet = async () => {
        const { error } = await initPaymentSheet({
            merchantDisplayName: "Example, Inc.",
            intentConfiguration: {
                mode: {
                    amount: 1099,
                    currencyCode: "USD",
                },
                confirmHandler: confirmHandler
            }
        });
        if (error) {

        }
    }



    const openPaymentSheet = async () => {
        await initializePaymentSheet();

        const { error } = await presentPaymentSheet();

        if (error) {
            Alert.alert(`Error code: ${error.code}`, error.message);
        } else {
            Alert.alert('Success', 'Your payment method is successfully set up for future payments!');
            setSuccess(true);
        }
    };


    return (
        <View className='my-10'>
            <CustomButton
                onPress={openPaymentSheet}
                title={'Confirm Ride'}
            />
        </View>
    )
}