import 'react-native-get-random-values';
import { View, Text, Image, TextInput, FlatList, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import pinIcon from '../assets/icons/pin.png';
import axios from 'axios';

export default function OSMTextInput({ icon, handlePress }) {
    const [searchResults, setSearchResults] = useState([]);
    const [query, setQuery] = useState('');

    // Nominatim Search API
    const searchLocation = async (text) => {
        setQuery(text);
        if (text.length > 2) {
            const response = await axios.get(
                `https://nominatim.openstreetmap.org/search?q=${text}&format=json&addressdetails=1&limit=5`
            );
            setSearchResults(response.data);
        } else {
            setSearchResults([]);
        }
    };

    return (
        <View className='flex-row bg-[#FFFFFF] items-center w-11/12 h-12 rounded-full relative'>
            <Image
                className='w-5 h-5 absolute left-4'
                source={pinIcon}
                resizeMode={'contain'}
            />
            <TextInput
                className='ml-14'
                placeholder='Search here'
                value={query}
                onChangeText={(text) => searchLocation(text)}
                style={{
                    flex: 1,
                    backgroundColor: 'white',
                    fontWeight: '400',
                    paddingHorizontal: 16,
                    height: '100%',
                    borderRadius: 25,
                }}
            />
            <Image
                className='w-5 h-5 absolute right-4'
                source={icon}
                resizeMode={'contain'}
            />
            {searchResults.length > 0 && (
                <FlatList
                    data={searchResults}
                    keyExtractor={(item) => item.place_id.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={() => {
                                handlePress({
                                    latitude: parseFloat(item.lat),
                                    longitude: parseFloat(item.lon),
                                });
                                setQuery(item.display_name); // Set the selected location in input
                                setSearchResults([]); // Hide results after selection
                            }}
                        >
                            <View style={{ padding: 10, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#d4d4d4' }}>
                                <Text>{item.display_name}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                    style={{
                        position: 'absolute',
                        top: 60,
                        width: '100%',
                        backgroundColor: 'white',
                        borderRadius: 10,
                        zIndex: 99,
                    }}
                />
            )}
        </View>
    );
}
