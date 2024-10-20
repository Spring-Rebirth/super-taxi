import 'react-native-get-random-values'
import { View, Text, Image, TextInput } from 'react-native'
import React from 'react'
import pinIcon from '../assets/icons/pin.png'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'

export default function GoogleTextInput({ icon, handlePress }) {
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
                onPress={(data, detail = null) => {
                    handlePress({
                        latitude: detail?.geometry.location.lat,
                        longitude: detail?.geometry.location.lng
                    })
                }}
                styles={{
                    textInputContainer: {
                        marginHorizontal: 50,
                        shadowColor: '#d4d4d4',
                        position: 'relative'
                    },
                    textInput: {
                        backgroundColor: 'white',
                        marginTop: 4,
                        fontWeight: '400',
                    },
                    listView: {
                        backgroundColor: 'white',
                        position: 'relative',
                        top: 0,
                        width: '100%',
                        borderRadius: 10,
                        shadowColor: '#d4d4d4',
                        zIndex: 99
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