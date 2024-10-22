import { View, Text, Alert } from 'react-native'
import React from 'react'
import CustomButton from './CustomButton'
import { PaymentSheetError, useStripe } from '@stripe/stripe-react-native'

export default function Payment() {
    const { initPaymentSheet, presentPaymentSheet } = useStripe();

    const initializePaymentSheet = async () => {
        const {
            setupIntent,
            ephemeralKey,
            customer,
        } = await fetchPaymentSheetParams();
    }

    const confirmHandler = async (paymentMethod, shouldSavePaymentMethod, intentCreationCallBack) => {

    }



    const openPaymentSheet = () => {
        const { error } = await presentPaymentSheet();

        if (error) {
            Alert.alert(`Error code: ${error.code}`, error.message);
            if (error.code === PaymentSheetError.Canceled) {

            } else {

            }

        } else {
            Alert.alert('Success', 'Your payment method is successfully set up for future payments!');
        }
    };
}

return (
    <View className='my-10'>
        <CustomButton
            onPress={openPaymentSheet}
            title={'Confirm Ride'}
        />
    </View>
)
}