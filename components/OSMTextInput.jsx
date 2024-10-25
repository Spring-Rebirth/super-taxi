import 'react-native-get-random-values';
import { View, Text, Image, TextInput, FlatList, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import React, { useState } from 'react';
import pinIcon from '../assets/icons/pin.png';
import { create } from 'react-test-renderer';

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
    const [modalVisible, setModalVisible] = useState(false);

    // 当输入内容变化时，触发onSearch回调
    const handleInputChange = (text) => {
        setQuery(text);
    };

    const handleSearch = () => {
        if (query.trim().length > 0) {
            onSearch(query);
            setModalVisible(true); // 假设搜索结果会通过 props 更新
        } else {
            setModalVisible(false);
        }
    };

    const handleSelect = (item) => {
        setQuery(item.display_name);
        onSelectResult(item);
        setModalVisible(false);
    };

    return (
        <View>
            {/* 搜索框 */}
            <View className={`flex-row items-center w-full h-12 rounded-full relative ${containerStyle}`}>
                <Image className='w-5 h-5 absolute left-4' source={pinIcon} resizeMode={'contain'} />
                <TextInput
                    style={[styles.input, textInputStyle]}
                    className='mx-10'
                    placeholder='Search here'
                    value={query}
                    onChangeText={handleInputChange}
                    onFocus={() => {
                        if (query.length > 0) {
                            setModalVisible(true);
                        }
                    }}
                />
                <TouchableOpacity
                    className='absolute right-4'
                    onPress={handleSearch}
                >
                    <Image className='w-5 h-5'
                        source={icon}
                        resizeMode={'contain'}
                    />
                </TouchableOpacity>
            </View>

            {/* 搜索列表 */}
            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
            >
                <TouchableOpacity style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
                    <View style={styles.modalContent}>
                        {searchResults && searchResults.length > 0 ? (
                            searchResults.map((item) => (
                                <TouchableOpacity key={item.place_id} onPress={() => handleSelect(item)}>
                                    <View style={styles.item}>
                                        <Text>{item.display_name}</Text>
                                    </View>
                                </TouchableOpacity>
                            ))
                        ) : (
                            <Text style={styles.noResults}>No results found</Text>
                        )}
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 50,
        borderRadius: 25,
        backgroundColor: '#fff',
        paddingHorizontal: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 2,
    },
    iconLeft: {
        width: 20,
        height: 20,
        marginRight: 10,
    },
    iconRight: {
        width: 20,
        height: 20,
        marginLeft: 10,
    },
    input: {
        flex: 1,
        fontSize: 16,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 10,
        maxHeight: '80%',
        position: 'absolute',
        top: 126, // 距离顶部 100 个单位
        left: 20, // 距离左边 20 个单位
        right: 20, // 距离右边 20 个单位
    },
    item: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#d4d4d4',
    },
    noResults: {
        padding: 15,
        textAlign: 'center',
        color: '#888',
    },
});
