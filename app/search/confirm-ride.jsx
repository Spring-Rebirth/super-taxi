import { View, Text, FlatList } from 'react-native'
import React from 'react'
import { driverMock } from '../../constants/MockDrivers'
import DriverCard from '../../components/DriverCard'

export default function ConfirmRide() {
    return (
        <View>
            <FlatList
                data={driverMock}
                renderItem={({ item }) => (
                    <DriverCard
                        item={item}
                    />
                )}
            />
        </View>
    )
}