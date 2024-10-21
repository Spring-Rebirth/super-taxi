import { View, Text, FlatList } from 'react-native'
import React from 'react'
import DriverCard from '../../components/DriverCard'
import CustomButton from '../../components/CustomButton'
import { router } from 'expo-router'
import { useDriverStore } from '../../store'

export default function ConfirmRide() {
    const { driver, selectedDriver, setSelectedDriver } = useDriverStore();

    return (
        <View>
            <FlatList
                data={driver}
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