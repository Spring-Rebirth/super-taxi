import { View, Text } from 'react-native'
import React from 'react'
import CustomButton from './CustomButton'
import { useStripe } from '@stripe/stripe-react-native'

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