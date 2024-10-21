import { View, Text, FlatList } from 'react-native'
import React from 'react'
import { driverMock } from '../../constants/MockDrivers'
import DriverCard from '../../components/DriverCard'
import CustomButton from '../../components/CustomButton'
import { router } from 'expo-router'

export default function ConfirmRide() {
    return (
        <View>
            <FlatList
                data={driverMock}
                ListFooterComponent={() => (
                    <View className='mt-3'>
                        <CustomButton
                            title={'Select Ride'}
                            onPress={() => router.push('/search/book-ride')}
                        />
                    </View>
                )}
                renderItem={({ item }) => (
                    <DriverCard
                        item={item}
                    />
                )}
            />
        </View>
    )
}