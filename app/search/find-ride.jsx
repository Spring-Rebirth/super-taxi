import { View, Text } from 'react-native'
import React from 'react'
import { useLocationStore } from '../../store'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function FindRide() {
    const { userAddress, destinationAddress, setUserLocation, setDestinationLocation } = useLocationStore();




    return (
        <SafeAreaView>
            <Text className='text-xl'>
                {userAddress}
            </Text>
            <Text className='text-xl'>
                {destinationAddress}
            </Text>
        </SafeAreaView>
    )
}