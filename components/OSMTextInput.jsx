import 'react-native-get-random-values';
import { View, Text, Image, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import pinIcon from '../assets/icons/pin.png';
import axios from 'axios';

export default function OSMTextInput({ icon, handlePress, onSearch }) {
    // const [searchResults, setSearchResults] = useState([]);
    const [query, setQuery] = useState('');

    // Nominatim Search API
    // const searchLocation = async (text) => {
    //     setQuery(text);
    //     if (text.length > 2) {
    //         const response = await axios.get(
    //             `https://nominatim.openstreetmap.org/search?q=${text}&format=json&addressdetails=1&limit=5`
    //         );
    //         setSearchResults(response.data);
    //     } else {
    //         setSearchResults([]);
    //     }
    // };

    // 当输入内容变化时，触发onSearch回调
    const handleInputChange = (text) => {
        setQuery(text);
        onSearch(text); // 传递到父组件进行搜索处理
    };

    return (
        <View className='flex-row bg-[#FFFFFF] items-center w-11/12 h-12 rounded-full relative'>
            <Image className='w-5 h-5 absolute left-4' source={pinIcon} resizeMode={'contain'} />
            <TextInput
                className='ml-14'
                placeholder='Search here'
                value={query}
                onChangeText={handleInputChange}
                style={styles.input}
            />
            <Image className='w-5 h-5 absolute right-4' source={icon} resizeMode={'contain'} />
        </View>
    );
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
})
