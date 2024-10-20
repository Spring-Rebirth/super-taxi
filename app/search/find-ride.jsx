import { View, Text } from 'react-native'
import React from 'react'
import { useLocationStore } from '../../store'

export default function FindRide() {
    const { userAddress, destinationAddress, setUserLocation, setDestinationLocation } = useLocationStore();




    return (
        <View>
            <Text className='text-xl'>
                {userAddress}
            </Text>
            <Text className='text-xl'>
                {destinationAddress}
            </Text>
        </View>
    )
}