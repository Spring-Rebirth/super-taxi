import { View, Text, FlatList } from 'react-native'
import React from 'react'
import DriverCard from '../../components/DriverCard'
import CustomButton from '../../components/CustomButton'
import { router } from 'expo-router'
import { useDriverStore } from '../../store'

export default function ConfirmRide() {
    const { drivers, selectedDriver, setSelectedDriver } = useDriverStore();
    console.log('drivers:', JSON.stringify(drivers, null, 2));
    return (
        <View>
            <FlatList
                data={drivers}
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
                        selected={selectedDriver}
                        setSelected={() => setSelectedDriver(Number(item.id))}
                    />
                )}
            />
        </View>
    )
}