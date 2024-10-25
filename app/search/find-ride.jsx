import { View, Text } from 'react-native';
import React, { useState, useRef } from 'react';
import { useLocationStore } from '../../store';
import OSMTextInput from '../../components/OSMTextInput';
import searchIcon from '../../assets/icons/search.png';
import CustomButton from '../../components/CustomButton';
import axios from 'axios';
import { router } from 'expo-router';

export default function FindRide() {
    const {
        userAddress,
        destinationAddress,
        setUserLocation,
        setDestinationLocation,
    } = useLocationStore();

    const [fromSearchResults, setFromSearchResults] = useState([]); // 为 From 输入框管理搜索结果
    const [toSearchResults, setToSearchResults] = useState([]); // 为 To 输入框管理搜索结果
    const [isLoading, setIsLoading] = useState(false);

    const lastRequestTime = useRef(0);
    const debounceTimer = useRef(null);
    const cache = useRef({});

    const searchLocation = async (query, type) => {
        // 清空结果条件
        if (query.length < 2) {
            if (type === 'from') {
                setFromSearchResults([]); // 清空 From 搜索结果
            } else if (type === 'to') {
                setToSearchResults([]); // 清空 To 搜索结果
            }
            return; // 直接返回，避免不必要的请求
        }

        setFromSearchResults(null); // null 表示搜索进行中
        setToSearchResults(null);
        setIsLoading(true);

        // 防抖机制
        clearTimeout(debounceTimer.current);
        debounceTimer.current = setTimeout(async () => {
            // 如果缓存中已有结果，则直接返回缓存中的数据
            if (cache.current[query]) {
                if (type === 'from') {
                    setFromSearchResults(cache.current[query]); // 直接从缓存中获取 From 数据
                } else if (type === 'to') {
                    setToSearchResults(cache.current[query]); // 直接从缓存中获取 To 数据
                }
                setIsLoading(false);
                return;
            }

            const now = Date.now();

            // 检查是否距离上次请求超过1秒
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
                            'User-Agent': 'super-taxi/1.0 (https://uber.com)', // 提供有效的 User-Agent
                        },
                    }
                );
                cache.current[query] = response.data; // 缓存请求结果

                // 根据类型设置相应的搜索结果
                if (type === 'from') {
                    setFromSearchResults(response.data); // 设置 From 搜索结果
                } else if (type === 'to') {
                    setToSearchResults(response.data); // 设置 To 搜索结果
                }
            } catch (error) {
                console.error('请求错误:', error);
            } finally {
                setIsLoading(false); // 结束加载
            }
        }, 500); // 500 毫秒的防抖时间
    };

    const handleResultPress = (item, type) => {
        const { address, lat, lon } = item;
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
            .join(' ');

        if (type === 'from') {
            setUserLocation({
                latitude: parseFloat(lat),
                longitude: parseFloat(lon),
                address: formattedAddress,
            });
            setFromSearchResults([]); // 隐藏结果列表
        } else if (type === 'to') {
            setDestinationLocation({
                latitude: parseFloat(lat),
                longitude: parseFloat(lon),
                address: formattedAddress,
            });
            setToSearchResults([]); // 隐藏结果列表
        }
    };

    return (
        <>
            <View className="mb-2">
                <Text className="text-lg mb-3">From</Text>
                <View className="items-center">
                    <OSMTextInput
                        containerStyle="bg-neutral-100"
                        icon={searchIcon}
                        textInputStyle={{ backgroundColor: 'transparent' }}
                        value={userAddress}
                        onSearch={(query) => searchLocation(query, 'from')}
                        searchResults={fromSearchResults}
                        isLoading={isLoading}
                        onSelectResult={(item) => handleResultPress(item, 'from')}
                    />
                </View>
            </View>

            <View className="mb-2">
                <Text className="text-lg mb-3">To</Text>
                <View className="items-center">
                    <OSMTextInput
                        containerStyle="bg-neutral-100"
                        icon={searchIcon}
                        textInputStyle={{ backgroundColor: 'transparent' }}
                        value={destinationAddress}
                        onSearch={(query) => searchLocation(query, 'to')}
                        searchResults={toSearchResults}
                        onSelectResult={(item) => handleResultPress(item, 'to')}
                    />
                </View>
            </View>

            <View className="items-center mt-8 h-24">
                <CustomButton
                    title="Find Now"
                    onPress={() => router.push('/search/confirm-ride')}
                />
            </View>
        </>
    );
}