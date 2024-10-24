import 'react-native-get-random-values';
import { View, Text, Image, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import pinIcon from '../assets/icons/pin.png';

export default function OSMTextInput({
    icon,
    onSearch,
    containerStyle,
    textInputStyle,
    value,
    searchResults,
    onSelectResult,
}) {
    const [query, setQuery] = useState(value || '');

    // 当输入内容变化时，触发onSearch回调
    const handleInputChange = (text) => {
        setQuery(text);
        onSearch(text); // 传递到父组件进行搜索处理
    };

    return (
        <View>
            {/* 搜索框 */}
            <View className={`flex-row items-center w-full h-12 rounded-full relative ${containerStyle}`}>
                <Image className='w-5 h-5 absolute left-4' source={pinIcon} resizeMode={'contain'} />
                <TextInput
                    className='mx-10'
                    placeholder='Search here'
                    value={query}
                    onChangeText={handleInputChange}
                    style={[styles.input, textInputStyle]}
                />
                <Image className='w-5 h-5 absolute right-4' source={icon} resizeMode={'contain'} />
            </View>

            {/* 搜索列表 */}
            {searchResults && searchResults.length > 0 && (
                <FlatList
                    data={searchResults}
                    keyExtractor={(item) => item.place_id.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => onSelectResult(item)}>
                            <View style={styles.resultItem}>
                                <Text>{item.display_name}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                    style={styles.searchResults}
                />
            )}
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
    searchResults: {
        position: 'absolute', // 确保FlatList绝对定位
        top: 52, // 根据需要调整
        left: 0,
        right: 0,
        zIndex: 999, // 保证其在顶层
        backgroundColor: '#F0F8FF',
        borderRadius: 10,
        maxHeight: 200, // 限制高度，防止溢出
    },
    resultItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#d4d4d4',
    },
});
