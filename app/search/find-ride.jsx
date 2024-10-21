import { View, Text } from 'react-native'
import React from 'react'
import { useLocationStore } from '../../store'
import OSMTextInput from '../../components/OSMTextInput'
import searchIcon from '../../assets/icons/search.png'
import targetIcon from '../../assets/icons/target.png'
import mapIcon from '../../assets/icons/map.png'
import CustomButton from '../../components/CustomButton'

export default function FindRide() {
    const { userAddress, destinationAddress, setUserLocation, setDestinationLocation } = useLocationStore();




    return (
        <>
            <View className='mb-2'>
                <Text className='text-lg mb-3'>
                    From
                </Text>
                <View className='items-center'>
                    <OSMTextInput
                        containerStyle={'bg-neutral-100'}
                        icon={targetIcon}
                        textInputStyle={{ backgroundColor: 'transparent' }}
                        value={userAddress}
                    />
                </View>
            </View>

            <View className='mb-2'>
                <Text className='text-lg mb-3'>
                    To
                </Text>
                <View className='items-center'>
                    <OSMTextInput
                        containerStyle={'bg-neutral-100'}
                        icon={mapIcon}
                        textInputStyle={{ backgroundColor: 'transparent' }}
                        value={destinationAddress}
                    />
                </View>
            </View>
            <View className='items-center mt-3 h-24'>
                <CustomButton
                    title={'Find Now'}
                />
            </View>
        </>
    )
}