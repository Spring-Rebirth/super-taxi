import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo'
import { Link } from 'expo-router'
import { FlatList, Text, TouchableOpacity, View, StyleSheet } from 'react-native'
import { ridesMock } from '../../constants/MockRides'
import TaxiTripCard from '../../components/TaxiTripCard'
import CustomMap from '../../components/CustomMap'
import { useEffect, useState } from 'react'
import * as Location from 'expo-location'
import { useLocationStore } from '../../store/index'
import OSMTextInput from '../../components/OSMTextInput'
import searchIcon from '../../assets/icons/search.png'
import axios from 'axios'
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry'
import { create } from 'zustand'

export default function Home() {
    const { user } = useUser(); // console.log('user:', JSON.stringify(user, null, 2));
    const { setUserLocation, setDestinationLocation } = useLocationStore();
    const [locationPermissions, setLocationPermissions] = useState(false);

    const [searchResults, setSearchResults] = useState([]);

    const searchLocation = async (query) => {
        if (query.length > 2) {
            const response = await axios.get(
                `https://nominatim.openstreetmap.org/search?q=${query}&format=json&addressdetails=1&limit=5`
            );
            setSearchResults(response.data); // 设置搜索结果
        } else {
            setSearchResults([]); // 如果输入少于3个字符，清空结果
        }
    };

    const handleResultPress = (item) => {
        // 在这里处理用户点击某个搜索结果的逻辑
        console.log('Selected location:', item);
        setSearchResults([]); // 选择后隐藏搜索结果
    };

    useEffect(() => {
        async function requestLocation() {
            let { status } = await Location.requestForegroundPermissionsAsync();

            if (status !== 'granted') {
                setLocationPermissions(false);
                return;
            }

            let location = await Location.getCurrentPositionAsync();

            const address = await Location.reverseGeocodeAsync({
                latitude: location.coords?.latitude,
                longitude: location.coords?.longitude
            });

            setUserLocation({
                // latitude: location.coords?.latitude,
                // longitude: location.coords?.longitude,
                latitude: 37.78825,
                longitude: -122.4324,
                address: `${address[0].name}, ${address[0].region}`
            });
        }

        requestLocation();
    }, [])

    return (
        <View className='my-8 bg-[#F6F8FA] h-screen'>
            <SignedIn>
                <View className='my-2 px-4'>
                    <Text className='text-xl my-4 font-semibold'>
                        Hello {user?.emailAddresses[0].emailAddress}
                    </Text>
                </View>

                {/* 将 OSMTextInput 作为头部组件 */}
                <View className='items-center'>
                    <OSMTextInput
                        icon={searchIcon}
                        onSearch={searchLocation} // 传递搜索回调函数
                    />
                </View>

                {/* 将搜索结果的FlatList移到主布局外 */}
                {searchResults.length > 0 && (
                    <FlatList
                        data={searchResults}
                        keyExtractor={(item) => item.place_id.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => handleResultPress(item)}>
                                <View style={styles.resultItem}>
                                    <Text>{item.display_name}</Text>
                                </View>
                            </TouchableOpacity>
                        )}
                        style={styles.searchResults} // 样式，确保搜索结果在页面的顶层
                    />
                )}


                <FlatList
                    style={{ marginBottom: 100 }}
                    data={ridesMock}
                    ListHeaderComponent={() => (
                        <>
                            <Text className='text-xl font-semibold ml-4 my-5'>
                                Your current location
                            </Text>
                            <View className='h-[300px] bg-transparent mx-4'>
                                <CustomMap />
                            </View>

                            <Text className='text-xl font-semibold ml-4 my-5'>
                                Recent Rides
                            </Text>
                        </>
                    )}
                    renderItem={({ item }) => (
                        <TaxiTripCard
                            data={item}
                        />
                    )}
                />

            </SignedIn>
            <SignedOut>
                <Link href="/sign-in">
                    <Text>Sign In</Text>
                </Link>
                <Link href="/sign-up">
                    <Text>Sign Up</Text>
                </Link>
            </SignedOut>
        </View>
    )
}
const styles = StyleSheet.create({
    input: {
        flex: 1,
        backgroundColor: 'white',
        fontWeight: '400',
        paddingHorizontal: 16,
        height: '100%',
        borderRadius: 25,
    },
    searchResults: {
        position: 'absolute', // 确保FlatList绝对定位
        top: 120, // 根据需要调整
        left: 0,
        right: 0,
        zIndex: 999, // 保证其在顶层
        backgroundColor: 'white',
        borderRadius: 10,
        maxHeight: 200, // 限制高度，防止溢出
    },
    resultItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#d4d4d4',
    },
});
