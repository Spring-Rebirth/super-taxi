import { Slot, usePathname } from 'expo-router'
import { View, Text, Image } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { TouchableOpacity } from 'react-native'
import { router } from 'expo-router'
import backArrowIcon from '../../assets/icons/back-arrow.png'
import CustomMap from '../../components/CustomMap'
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet'
import { StatusBar } from 'expo-status-bar';

export default function RideLayout() {
    const bottomSheetRef = useRef(null);
    const pathname = usePathname(); // 获取当前路由路径
    const [snapPoints, setSnapPoints] = useState(["44%", "95%"]);
    const [index, setIndex] = useState(0);
    const [pageName, setPageName] = useState('');

    useEffect(() => {
        if (pathname === '/search/confirm-ride') {
            // 当路由为某个特定页面时，设置不同的 snapPoints
            setSnapPoints(["65%", "95%"]);
            setIndex(0);
            setPageName('Choose a Driver')
        } else if (pathname === '/search/book-ride') {
            // 设置另一个特定页面的 snapPoints
            setSnapPoints(["65%", "95%"]);
            setIndex(1);
            setPageName('Book Ride');
        } else {
            // 默认 snapPoints
            setSnapPoints(["44%", "95%"]);
            setIndex(0);
            setPageName('Ride');
        }
    }, [pathname]); // 路由变化时触发

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <StatusBar style='dark' />
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
                        <Text className='text-lg font-semibold ml-5'>
                            {pageName}
                        </Text>
                    </View>

                    <View className='absolute top-0 bottom-0 left-0 right-0'>
                        <CustomMap myLocationHeight={400} />
                    </View>

                </View>

                <BottomSheet
                    ref={bottomSheetRef}
                    snapPoints={snapPoints}
                    index={index}
                >
                    <BottomSheetView style={{ flex: 1, padding: 15 }}>
                        <Slot />
                    </BottomSheetView>
                </BottomSheet>
            </View>
        </GestureHandlerRootView>
    )
}