import { View, Text } from 'react-native'
import React, { useState } from 'react'
import { useLocationStore } from '../../store'
import OSMTextInput from '../../components/OSMTextInput'
import targetIcon from '../../assets/icons/target.png'
import mapIcon from '../../assets/icons/map.png'
import CustomButton from '../../components/CustomButton'
import axios from 'axios'
import { router } from 'expo-router'


export default function FindRide() {
    const { userAddress, destinationAddress, setUserLocation, setDestinationLocation } = useLocationStore();
    const [fromSearchResults, setFromSearchResults] = useState([]); // 为 From 输入框管理搜索结果
    const [toSearchResults, setToSearchResults] = useState([]); // 为 To 输入框管理搜索结果

    let lastRequestTime = 0;
    let debounceTimer;
    const cache = {};
    const searchLocation = async (query, type) => {
        // 清空结果条件
        if (query.length <= 2) {
            if (type === 'from') {
                setFromSearchResults([]);  // 清空 From 搜索结果
            } else if (type === 'to') {
                setToSearchResults([]);  // 清空 To 搜索结果
            }
            return;  // 直接返回，避免不必要的请求
        }

        // 防抖机制
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(async () => {

            // 如果缓存中已有结果，则直接返回缓存中的数据
            if (cache[query]) {
                if (type === 'from') {
                    setFromSearchResults(cache[query]);  // 直接从缓存中获取 From 数据
                } else if (type === 'to') {
                    setToSearchResults(cache[query]);  // 直接从缓存中获取 To 数据
                }
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
                        }
                    }
                );
                cache[query] = response.data;  // 缓存请求结果

                // 根据类型设置相应的搜索结果
                if (type === 'from') {
                    setFromSearchResults(response.data);  // 设置 From 搜索结果
                } else if (type === 'to') {
                    setToSearchResults(response.data);  // 设置 To 搜索结果
                }
            } catch (error) {
                console.error('请求错误:', error);
            }

        }, 500);  // 500 毫秒的防抖时间
    };


    const handleResultPress = (item, type) => {
        // console.log('Selected location:', JSON.stringify(item, null, 2));
        const { address, lat, lon } = item;
        const formattedAddress = [
            address.house_number && address.road ? `${address.house_number} ${address.road}` : address.road,
            address.town,
            address.state && address.postcode ? `${address.state} ${address.postcode}` : address.state || address.postcode,
            address.country
        ].filter(Boolean).join(', ');

        if (type === 'from') {
            setUserLocation({
                latitude: parseFloat(lat),
                longitude: parseFloat(lon),
                address: formattedAddress
            });
        } else if (type === 'to') {
            setDestinationLocation({
                latitude: parseFloat(lat),
                longitude: parseFloat(lon),
                address: formattedAddress
            });
        }

        // 隐藏结果列表
        if (type === 'from') {
            setFromSearchResults([]);
        } else if (type === 'to') {
            setToSearchResults([]);
        }
    };

    return (
        <>
            <View className='mb-2'>
                <Text className='text-lg mb-3'>
                    From
                </Text>
                <View className='items-center'>
                    <OSMTextInput
                        containerStyle={'bg-neutral-100'}
                        icon={targetIcon}
                        textInputStyle={{ backgroundColor: 'transparent' }}
                        value={userAddress}
                        onSearch={(query) => searchLocation(query, 'from')}
                        searchResults={fromSearchResults}
                        onSelectResult={(item) => handleResultPress(item, 'from')}
                    />
                </View>
            </View>

            <View className='mb-2'>
                <Text className='text-lg mb-3'>
                    To
                </Text>
                <View className='items-center'>
                    <OSMTextInput
                        containerStyle={'bg-neutral-100'}
                        icon={mapIcon}
                        textInputStyle={{ backgroundColor: 'transparent' }}
                        value={destinationAddress}
                        onSearch={(query) => searchLocation(query, 'to')}
                        searchResults={toSearchResults}
                        onSelectResult={(item) => handleResultPress(item, 'to')}
                    />
                </View>
            </View>
            <View className='items-center mt-8 h-24'>
                <CustomButton
                    title={'Find Now'}
                    onPress={() => router.push('/search/confirm-ride')}
                />
            </View>
        </>
    )
}