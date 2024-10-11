import { Text, TouchableOpacity } from 'react-native'
import React from 'react'

export default function CustomButton({ containerStyle, title, onPress }) {
    return (
        <TouchableOpacity
            className={`w-11/12 h-12 rounded-full bg-[#0286FF] justify-center \
             items-center ${containerStyle}`}
            onPress={onPress}
        >
            <Text className='text-white font-bold'>{title}</Text>
        </TouchableOpacity>
    )
}