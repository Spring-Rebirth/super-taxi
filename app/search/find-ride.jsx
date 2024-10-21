import { View, Text } from 'react-native'
import React, { useState } from 'react'
import { useLocationStore } from '../../store'
import OSMTextInput from '../../components/OSMTextInput'
import searchIcon from '../../assets/icons/search.png'
import targetIcon from '../../assets/icons/target.png'
import mapIcon from '../../assets/icons/map.png'
import CustomButton from '../../components/CustomButton'
import axios from 'axios'
import { router } from 'expo-router'


export default function FindRide() {
    const { userAddress, destinationAddress, setUserLocation, setDestinationLocation } = useLocationStore();
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
                        onSearch={searchLocation}
                        searchResults={searchResults}
                        onSelectResult={handleResultPress}
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
                        onSearch={searchLocation}
                        searchResults={searchResults}
                        onSelectResult={handleResultPress}
                    />
                </View>
            </View>
            <View className='items-center mt-3 h-24'>
                <CustomButton
                    title={'Find Now'}
                />
            </View>
        </>
    )
}