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

    const searchLocation = async (query, type) => {
        if (query.length > 2) {
            const response = await axios.get(
                `https://nominatim.openstreetmap.org/search?q=${query}&format=json&addressdetails=1&limit=5`
            );
            if (type === 'from') {
                setFromSearchResults(response.data); // 设置 From 搜索结果
            } else if (type === 'to') {
                setToSearchResults(response.data); // 设置 To 搜索结果
            }
        } else {
            if (type === 'from') {
                setFromSearchResults([]); // 清空 From 搜索结果
            } else if (type === 'to') {
                setToSearchResults([]); // 清空 To 搜索结果
            }
        }
    };

    const handleResultPress = (item, type) => {
        console.log('Selected location:', JSON.stringify(item, null, 2));
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