import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'

export default function CustomButton() {
    return (
        <TouchableOpacity
            className='w-11/12 h-16 bg-blue-500'
        >
            <Text>Button</Text>
        </TouchableOpacity>
    )
}