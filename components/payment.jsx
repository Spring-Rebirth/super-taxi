import { View, Text } from 'react-native'
import React from 'react'
import CustomButton from './CustomButton'

export default function Payment() {
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