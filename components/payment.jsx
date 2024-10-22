import { View, Text, Alert } from 'react-native'
import React, { useState } from 'react'
import CustomButton from './CustomButton'
import { PaymentSheetError, useStripe } from '@stripe/stripe-react-native'

export default function Payment() {
    const { initPaymentSheet, presentPaymentSheet } = useStripe();
    const [success, setSuccess] = useState(false);

    const initializePaymentSheet = async () => {
        const {
            setupIntent,
            ephemeralKey,
            customer,
        } = await fetchPaymentSheetParams();
    }

    const confirmHandler = async (paymentMethod, shouldSavePaymentMethod, intentCreationCallBack) => {

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