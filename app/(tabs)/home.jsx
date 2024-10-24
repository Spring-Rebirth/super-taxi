import { useAuth, useUser } from '@clerk/clerk-expo'
import { router } from 'expo-router'
import { FlatList, Image, Text, View } from 'react-native'
import { ridesMock } from '../../constants/MockRides'
import TaxiTripCard from '../../components/TaxiTripCard'
import CustomMap from '../../components/CustomMap'
import { useEffect, useState } from 'react'
import * as Location from 'expo-location'
import { useLocationStore } from '../../store/index'
import OSMTextInput from '../../components/OSMTextInput'
import searchIcon from '../../assets/icons/search.png'
import axios from 'axios'
import signOutIcon from '../../assets/icons/out.png'
import { TouchableOpacity } from 'react-native'


export default function Home() {
    const { user } = useUser(); // console.log('user:', JSON.stringify(user, null, 2));
    const { setUserLocation, setDestinationLocation } = useLocationStore();
    const [locationPermissions, setLocationPermissions] = useState(false);
    const [searchResults, setSearchResults] = useState([]); // 保存搜索结果
    const [query, setQuery] = useState('');  // 保存搜索框的内容
    const { signOut } = useAuth();

    // 处理地点搜索
    let lastRequestTime = 0;
    let debounceTimer;
    const cache = {};

    const searchLocation = async (query) => {
        setQuery(query); // 保存当前的查询

        // 清空结果条件
        if (query.length <= 2) {
            setSearchResults([]); // 如果输入少于3个字符，清空结果
            return;  // 直接返回，避免不必要的debounce
        }

        // 防抖机制
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(async () => {

            // 如果缓存中已有结果，则直接返回缓存中的数据
            if (cache[query]) {
                setSearchResults(cache[query]);  // 直接从缓存中获取数据
                return;
            }

            const now = new Date().getTime();

            // 检查是否距离上次请求超过1秒
            if (now - lastRequestTime < 1000) {
                console.log('请求太频繁，请稍后再试');
                return;
            }

            lastRequestTime = now;  // 更新最后请求时间

            // 发起请求
            try {
                const response = await axios.get(
                    `https://nominatim.openstreetmap.org/search?q=${query}&format=json&addressdetails=1&limit=5`,
                    {
                        headers: {
                            'User-Agent': 'super-taxi/1.0 (https://uber.com)',  // 提供有效的 User-Agent
                            // 'Referer': 'https://example.com',  // 如果适用，也可以添加 Referer
                        }
                    }
                );
                cache[query] = response.data;  // 缓存请求结果
                setSearchResults(response.data);  // 设置搜索结果
            } catch (error) {
                console.error('请求错误:', error);
            }

        }, 500);  // 500 毫秒的防抖时间
    };


    const handleResultPress = (item) => {
        // 在这里处理用户点击某个搜索结果的逻辑
        // console.log('Selected location:', JSON.stringify(item, null, 2));
        const { address, lat, lon } = item;
        const formattedAddress = [
            // 检查 house_number 和 road
            address.house_number && address.road ? `${address.house_number} ${address.road}` : address.road,  // 针对中国地址格式，优先显示 commercial（商业区/建筑名）、suburb（街道）和 city（市）
            address.commercial,  // 显示商业区名（如 "腾讯大厦"）
            address.suburb,  // 显示街道（如 "粤海街道"）
            address.city,  // 显示市（如 "南山区"）
            address.state && address.postcode ? `${address.state} ${address.postcode}` : address.state || address.postcode,  // 检查 state 和 postcode
            address.country  // 显示国家
        ].filter(Boolean).join(', ');  // 使用 filter(Boolean) 去除任何 undefined 或空值

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
            // console.log('user location:', JSON.stringify(address, null, 2));

            const formattedAddress = [
                // 针对外国地址，优先显示 house_number 和 road
                address[0].streetNumber && address[0].street ? `${address[0].streetNumber} ${address[0].street}` : address[0].street,

                // 处理中国地址中的商业区、街道、区和市
                address[0].commercial,  // 显示商业区名（如 "腾讯大厦"）
                address[0].subregion || address[0].suburb,  // 显示街道（如 "粤海街道" 或 subregion）
                address[0].district,  // 显示区（如 "宝安区"）
                address[0].city,  // 显示城市（如 "深圳市"）

                // 处理省/州和邮政编码
                address[0].region && address[0].postalCode ? `${address[0].region} ${address[0].postalCode}` : address[0].region || address[0].postalCode,

                // 最后显示国家
                address[0].country  // 显示国家
            ].filter(Boolean).join(', ');  // 过滤空值并拼接

            setUserLocation({
                latitude: location.coords?.latitude,
                longitude: location.coords?.longitude,
                address: formattedAddress
                // latitude: 37.78825,
                // longitude: -122.4324,
                // address: 'San Francisco, CA, USA'
            });
        }

        requestLocation();
    }, [])

    return (
        <View className='my-8 bg-[#F6F8FA] h-screen'>
            <View className='my-2 px-8 flex-row justify-between items-center'>
                <Text className='text-xl my-4 font-semibold'>
                    Hello {user?.firstName || 'Mike'}
                </Text>
                <TouchableOpacity onPress={async () => {
                    await signOut();  // 等待 signOut 完成
                    router.replace('/(auth)/sign-in');  // 完成退出后再跳转页面
                }}>
                    <Image
                        className='w-5 h-5'
                        source={signOutIcon}
                        resizeMode={'contain'}
                    />
                </TouchableOpacity>
            </View>

            {/* 将 OSMTextInput 作为头部组件 */}
            <View className='items-center px-4'>
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
        </View>
    )
}
