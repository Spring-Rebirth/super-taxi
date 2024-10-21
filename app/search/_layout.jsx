import { Slot } from 'expo-router'
import { View, Text, Image } from 'react-native'
import React, { useRef } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { TouchableOpacity } from 'react-native'
import { router } from 'expo-router'
import backArrowIcon from '../../assets/icons/back-arrow.png'
import CustomMap from '../../components/CustomMap'
import BottomSheet from '@gorhom/bottom-sheet'

export default function RideLayout() {
    const bottomSheetRef = useRef(null);

    return (
        <GestureHandlerRootView>
            <View className='flex-1 bg-white'>
                <View className='flex-1 bg-blue-500'>
                    <View className='flex-row absolute z-10 top-16 items-center justify-start px-5'>
                        <TouchableOpacity onPress={() => router.back()}>
                            <View className='w-10 h-10 bg-white rounded-full justify-center items-center'>
                                <Image
                                    className='w-6 h-6'
                                    source={backArrowIcon}
                                    resizeMode={'contain'}
                                />
                            </View>
                        </TouchableOpacity>
                        {/* <Text className='text-xl ml-5'>
                            Back
                        </Text> */}
                    </View>

                    <View className='absolute top-0 bottom-0 left-0 right-0'>
                        <CustomMap />
                    </View>

                </View>

                <BottomSheet
                    ref={bottomSheetRef}
                    snapPoints={["40%", "85%"]}
                    index={0}
                >

                </BottomSheet>
            </View>
        </GestureHandlerRootView>
    )
}