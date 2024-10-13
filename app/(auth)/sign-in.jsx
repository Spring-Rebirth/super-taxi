import { View, Text, ImageBackground, Image } from 'react-native'
import React from 'react'
import signUpCar from '../../assets/images/signup-car.png'
import CustomInputBox from '../../components/CustomInputBox'
import personIcon from '../../assets/icons/person.png'
import lockIcon from '../../assets/icons/lock.png'
import emailIcon from '../../assets/icons/email.png'
import CustomButton from '../../components/CustomButton'
import DividerWithText from '../../components/DividerWithText'
import googleIcon from '../../assets/icons/google.png'
import { TouchableOpacity } from 'react-native'
import { router } from 'expo-router'


export default function SignUp() {
    return (
        <View className='w-screen h-full bg-white'>
            <ImageBackground
                className='w-full h-40 justify-end'
                source={signUpCar}
                resizeMode={'stretch'}
            >
                <Text className='ml-4 mb-4 text-xl font-bold'>
                    Welcome 👋
                </Text>
            </ImageBackground>

            <View className='w-full h-auto items-center'>
                <CustomInputBox
                    title={'Email'}
                    icon={emailIcon}
                />
                <CustomInputBox
                    title={'Password'}
                    icon={lockIcon}
                    isSecure={true}
                />

                <CustomButton
                    title={'Log In'}
                />

                <DividerWithText />

                <View className='w-full items-center relative'>
                    <CustomButton
                        title={'Log In with Google'}
                        containerStyle={'bg-transparent border border-[#EBEBEB]'}
                        titleStyle={'text-black font-normal'}
                    />
                    <Image
                        className='w-5 h-5 absolute left-20 top-3.5'
                        source={googleIcon}
                    />
                </View>

                <View className='flex-row mt-12 space-x-2'>
                    <Text>Do not have an account ?</Text>
                    <TouchableOpacity
                        onPress={() => router.back()}
                    >
                        <Text className='text-[#0286FF]'>Sign up</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}