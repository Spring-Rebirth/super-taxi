import { View, Text } from 'react-native'
import React from 'react'
import { useLocationStore } from '../../store'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function FindRide() {
    const { userAddress, destinationAddress, setUserLocation, setDestinationLocation } = useLocationStore();




    return (
        <>
            <View className='my-3'>
                <Text className='text-lg mb-3'>
                    From
                </Text>

            </View>
        </>
    )
}