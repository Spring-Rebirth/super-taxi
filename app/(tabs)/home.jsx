import { useAuth, useUser } from '@clerk/clerk-expo';
import { router } from 'expo-router';
import { FlatList, Image, Text, View, TouchableOpacity, ActivityIndicator, Button, Alert } from 'react-native';
import TaxiTripCard from '../../components/TaxiTripCard';
import CustomMap from '../../components/CustomMap';
import { useEffect, useState, useRef, useMemo } from 'react';
import * as Location from 'expo-location';
import { useLocationStore } from '../../store/index';
import OSMTextInput from '../../components/OSMTextInput';
import searchIcon from '../../assets/icons/search.png';
import axios from 'axios';
import signOutIcon from '../../assets/icons/out.png';
import { images } from "@/constants";
import { api } from '../../api-mock';
import { StatusBar } from 'expo-status-bar';

function ListHeader({ memoizedMap }) {
    return (
        <>
            <View className="h-[300px] bg-transparent mx-4 mt-5">{memoizedMap}</View>
            <Text className="text-xl font-semibold ml-8 my-5 text-[#4682B4]">
                Recent Rides
            </Text>
        </>
    );
}

export default function Home() {
    const { user } = useUser(); // 获取当前用户信息
    const { setUserLocation, setDestinationLocation } = useLocationStore();
    const [searchResults, setSearchResults] = useState([]); // 保存搜索结果
    const { signOut } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [ridesData, setRidesData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 使用 useRef 来持久化变量
    const lastRequestTime = useRef(0);
    const debounceTimer = useRef(null);
    const cache = useRef({});
    const memoizedMap = useMemo(() => <CustomMap />, []);

    useEffect(() => {
        const fetchUserRides = async () => {
            if (!user?.id) {
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                const response = await api.getUserRides(user.id);
                setRidesData(response.data);
            } catch (err) {
                console.error('Error fetching user rides:', err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserRides();
    }, [user]);


    // 处理地点搜索
    const searchLocation = async (query) => {
        // 如果输入少于3个字符，清空结果
        if (query.length < 2) {
            setSearchResults([]);
            setIsLoading(false);
            return;
        }

        setSearchResults(null); // null 表示搜索进行中
        setIsLoading(true);

        // 防抖机制
        clearTimeout(debounceTimer.current);
        debounceTimer.current = setTimeout(async () => {
            // 如果缓存中已有结果，直接使用缓存
            if (cache.current[query]) {
                setSearchResults(cache.current[query]);
                setIsLoading(false);
                return;
            }

            const now = Date.now();

            // 节流：检查请求是否过于频繁
            if (now - lastRequestTime.current < 1000) {
                console.log('请求太频繁，请稍后再试');
                return;
            }

            lastRequestTime.current = now; // 更新最后请求时间

            // 发起请求
            try {
                const response = await axios.get(
                    `https://nominatim.openstreetmap.org/search?q=${query}&format=json&addressdetails=1&limit=5`,
                    {
                        headers: {
                            'User-Agent': 'super-taxi/1.0 (https://uber.com)',
                        },
                    }
                );
                cache.current[query] = response.data; // 缓存请求结果
                setSearchResults(response.data); // 设置搜索结果
            } catch (error) {
                console.error('请求错误:', error);
            } finally {
                setIsLoading(false); // 结束加载
            }
        }, 500); // 500 毫秒的防抖时间
    };

    const handleResultPress = (item) => {
        const { address, lat, lon } = item;
        // console.log('address:', JSON.stringify(address, null, 2));
        const formattedAddress = [
            address.state,
            address.city,
            address.suburb,
            address.commercial,
            address.road && address.house_number
                ? `${address.road} ${address.house_number}`
                : address.road,
            address.building
        ]
            .filter(Boolean)
            .join(', ');

        setDestinationLocation({
            latitude: parseFloat(lat),
            longitude: parseFloat(lon),
            address: formattedAddress,
        });

        router.push('/search/find-ride');

        setSearchResults([]); // 选择后隐藏搜索结果
    };

    useEffect(() => {
        async function requestLocation() {
            let { status } = await Location.requestForegroundPermissionsAsync();

            if (status !== 'granted') {
                return;
            }
            let location;

            try {
                location = await Location.getCurrentPositionAsync();
                // 使用位置信息的代码
            } catch (error) {
                console.error('获取位置信息时出错：', error);
                Alert.alert(
                    '位置信息错误',
                    `获取位置信息时出错：${error.message}`,
                    [{ text: '确定' }]
                );
            }

            const address = await Location.reverseGeocodeAsync({
                latitude: location.coords?.latitude,
                longitude: location.coords?.longitude,
            });

            const formattedAddress = [
                address[0].region,
                address[0].city,
                address[0].district,
                address[0].subregion || address[0].suburb,
                address[0].commercial,
                address[0].street && address[0].streetNumber
                    ? `${address[0].street} ${address[0].streetNumber}`
                    : address[0].street
            ]
                .filter(Boolean)
                .join(', ');

            setUserLocation({
                latitude: location.coords?.latitude,
                longitude: location.coords?.longitude,
                address: formattedAddress
            });
        }

        requestLocation();
    }, [setUserLocation]);

    const memoizedHeader = useMemo(() => {
        return <ListHeader memoizedMap={memoizedMap} />;
    }, [memoizedMap]);


    return (
        <View className="my-8 bg-[#F6F8FA] h-screen">
            <StatusBar style="dark" />
            <View className="my-2 px-8 flex-row justify-between items-center">
                <Text className="text-xl my-4 font-semibold text-[#FF6B6B]">
                    Hello, {user?.username || user?.firstName || 'Guest'}
                </Text>
                <TouchableOpacity
                    onPress={async () => {
                        await signOut();
                        router.replace('/(auth)/sign-in');
                    }}
                >
                    <Image
                        className="w-5 h-5"
                        source={signOutIcon}
                        resizeMode={'contain'}
                    />
                </TouchableOpacity>
            </View>

            {/* 将 OSMTextInput 作为头部组件 */}
            <View className="items-center px-4">
                <OSMTextInput
                    containerStyle={'bg-[#FFFFFF]'}
                    icon={searchIcon}
                    onSearch={searchLocation}
                    searchResults={searchResults}
                    isLoading={isLoading}
                    onSelectResult={handleResultPress}
                />
            </View>

            <FlatList
                style={{ marginBottom: 100 }}
                data={ridesData}
                ListHeaderComponent={memoizedHeader}
                renderItem={({ item }) => <TaxiTripCard data={item} />}
                ListEmptyComponent={() => (
                    <View className="flex flex-col items-center justify-center">
                        {!loading ? (
                            <>
                                <Image
                                    source={images.noResult}
                                    className="w-20 h-20"
                                    alt="No recent rides found"
                                    resizeMode="contain"
                                />
                                <Text className="text-sm">No recent rides found</Text>
                            </>
                        ) : (
                            <ActivityIndicator size="small" color="#000" />
                        )}
                    </View>
                )}
            />
        </View>
    );
}