import { View, Text } from 'react-native'
import React from 'react'
import CustomButton from './CustomButton'

export default function Payment() {
    return (
        <View className='my-10'>
            <CustomButton
                className=''
                title={'Confirm Ride'}
            />
        </View>
    )
}