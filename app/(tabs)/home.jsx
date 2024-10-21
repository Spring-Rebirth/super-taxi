import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo'
import { Link, router } from 'expo-router'
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


export default function Home() {
    const { user } = useUser(); // console.log('user:', JSON.stringify(user, null, 2));
    const { setUserLocation, setDestinationLocation } = useLocationStore();
    const [locationPermissions, setLocationPermissions] = useState(false);

    const [searchResults, setSearchResults] = useState([]); // 保存搜索结果
    const [query, setQuery] = useState('');  // 保存搜索框的内容

    // 处理地点搜索
    const searchLocation = async (query) => {
        setQuery(query); // 保存当前的查询
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
        console.log('Selected location:', JSON.stringify(item, null, 2));
        const { address, lat, lon } = item;
        const formattedAddress = [
            address.house_number && address.road ? `${address.house_number} ${address.road}` : address.road,  // 检查 house_number 和 road
            address.town,
            address.state && address.postcode ? `${address.state} ${address.postcode}` : address.state || address.postcode,  // 检查 state 和 postcode
            address.country
        ].filter(Boolean).join(', ');

        setDestinationLocation({
            latitude: parseFloat(lat),  // 确保转换为浮点数
            longitude: parseFloat(lon), // 确保转换为浮点数
            address: formattedAddress   // 一个字符串
        });

        router.push('/search/find-ride');

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
                // address: `${address[0].name}, ${address[0].region}`
                latitude: 37.78825,
                longitude: -122.4324,
                address: 'San Francisco, CA, USA'
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
                        containerStyle={'bg-[#FFFFFF]'}
                        icon={searchIcon}
                        onSearch={searchLocation}
                        searchResults={searchResults}
                        onSelectResult={handleResultPress}
                    />
                </View>

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
