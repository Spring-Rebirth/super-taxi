import { View, Text, TextInput, Image } from 'react-native'
import React, { useState } from 'react'
import eyecrosslIcon from '../assets/icons/eyecross.png'
import { TouchableOpacity } from 'react-native';

export default function CustomInputBox({ title, isSecure, icon, onChangeText }) {
    const [isFocused, setIsFocused] = useState(false);
    const [textVisible, setTextVisible] = useState(false);

    return (
        <View className={`w-full items-center mb-4`}>
            <Text className='self-start ml-5 mb-1 font-semibold'>
                {title}
            </Text>
            <View className={`w-11/12 h-[48] rounded-full bg-[#F6F8FA] justify-center px-4
                            relative ${isFocused ? 'border border-[#3B82F6]' : ''}`}>
                <Image
                    className='w-5 h-5 absolute left-4'
                    source={icon}
                    resizeMode={'contain'}
                />
                <TextInput
                    className='mx-8'
                    secureTextEntry={!textVisible}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    onChangeText={onChangeText}
                />
                {isSecure && (
                    <TouchableOpacity
                        className='absolute right-4'
                        onPress={() => {
                            setTextVisible(prev => !prev);
                        }}
                    >
                        <Image
                            className='w-5 h-5'
                            source={eyecrosslIcon}
                            resizeMode={'contain'}
                        />
                    </TouchableOpacity>
                )}
            </View>
        </View>

    )
}