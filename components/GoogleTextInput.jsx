import 'react-native-get-random-values'
import { View, Text, Image, TextInput } from 'react-native'
import React from 'react'
import pinIcon from '../assets/icons/pin.png'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'

export default function GoogleTextInput({ icon }) {
    return (
        <View className='flex-row bg-[#FFFFFF] items-center w-11/12 h-12 rounded-full
                            relative'>
            <Image
                className='w-5 h-5 absolute left-4'
                source={pinIcon}
                resizeMode={'contain'}
            />
            {/* <TextInput
                className='ml-14'
                placeholder='Search here'
            /> */}
            <GooglePlacesAutocomplete
                placeholder='Search here'
                fetchDetails={true}
                debounce={200}
                styles={{
                    textInputContainer: {
                        marginHorizontal: 50
                    }
                }}
            />
            <Image
                className='w-5 h-5 absolute right-4'
                source={icon}
                resizeMode={'contain'}
            />
        </View>
    )
}