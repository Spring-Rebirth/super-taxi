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
        onSearch(text); // 传递到父组件进行搜索处理
        if (text.length > 0) {
            setModalVisible(true);
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
                <Image className='w-5 h-5 absolute right-4' source={icon} resizeMode={'contain'} />
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
