import { View, Text } from 'react-native'
import React from 'react'
import { useLocationStore } from '../../store'
import OSMTextInput from '../../components/OSMTextInput'
import searchIcon from '../../assets/icons/search.png'

export default function FindRide() {
    const { userAddress, destinationAddress, setUserLocation, setDestinationLocation } = useLocationStore();




    return (
        <>
            <View className='my-3'>
                <Text className='text-lg mb-3'>
                    From
                </Text>
                <View className='items-center '>
                    <OSMTextInput
                        containerStyle={'bg-neutral-100'}
                        icon={searchIcon}
                        textInputStyle={{ backgroundColor: 'transparent' }}
                    />
                </View>
            </View>
        </>
    )
}