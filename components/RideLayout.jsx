import { View, Text, Image } from 'react-native'
import React from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { TouchableOpacity } from 'react-native'
import { router } from 'expo-router'
import backArrowIcon from '../assets/icons/back-arrow.png'

export default function RideLayout({ children }) {
    return (
        <GestureHandlerRootView>
            <View className='flex-1 bg-white'>
                <View className='h-screen bg-blue-500'>
                    <View className='flex-row absolute z-10 top-16 items-center justify-start px-5'>
                        <TouchableOpacity onPress={() => router.back()}>
                            <View>
                                <Image
                                    className='w-6 h-6'
                                    source={backArrowIcon}
                                    resizeMode={'contain'}
                                />
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

            </View>
        </GestureHandlerRootView>
    )
}