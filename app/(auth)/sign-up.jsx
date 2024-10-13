import { View, Text, ImageBackground, Image } from 'react-native'
import React, { useState } from 'react'
import signUpCar from '../../assets/images/signup-car.png'
import CustomInputBox from '../../components/CustomInputBox'
import personIcon from '../../assets/icons/person.png'
import lockIcon from '../../assets/icons/lock.png'
import emailIcon from '../../assets/icons/email.png'
import CustomButton from '../../components/CustomButton'
import DividerWithText from '../../components/DividerWithText'
import googleIcon from '../../assets/icons/google.png'
import { TouchableOpacity } from 'react-native'
import { useRouter } from 'expo-router'
import { useSignUp } from '@clerk/clerk-expo'
import CustomModal from '../../components/CustomModal'

export default function SignUp() {
    const { isLoaded, signUp, setActive } = useSignUp();
    const router = useRouter();

    const [username, setUsername] = useState('');
    const [emailAddress, setEmailAddress] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [pendingVerification, setPendingVerification] = React.useState(true); //临时
    const [code, setCode] = React.useState('');

    const onSignUpPress = async () => {
        if (!isLoaded) {
            return
        }

        try {
            await signUp.create({
                emailAddress,
                password,
            })

            await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

            setPendingVerification(true)
        } catch (err) {
            // See https://clerk.com/docs/custom-flows/error-handling
            // for more info on error handling
            console.error(JSON.stringify(err, null, 2))
        }
    }

    const onPressVerify = async () => {
        if (!isLoaded) {
            return
        }

        try {
            const completeSignUp = await signUp.attemptEmailAddressVerification({
                code,
            })

            if (completeSignUp.status === 'complete') {
                await setActive({ session: completeSignUp.createdSessionId })
                router.replace('/')
            } else {
                console.error(JSON.stringify(completeSignUp, null, 2))
            }
        } catch (err) {
            // See https://clerk.com/docs/custom-flows/error-handling
            // for more info on error handling
            console.error(JSON.stringify(err, null, 2))
        }
    }


    return (
        <View className='w-screen h-full bg-white'>
            <ImageBackground
                className='w-full h-40 justify-end'
                source={signUpCar}
                resizeMode={'stretch'}
            >
                <Text className='ml-4 mb-4 text-xl font-bold'>
                    Create Your  Account
                </Text>
            </ImageBackground>

            <View className='w-full h-auto items-center'>
                <CustomInputBox
                    title={'Name'}
                    icon={personIcon}
                    onChangeText={text => setUsername(text)}
                />
                <CustomInputBox
                    title={'Email'}
                    icon={emailIcon}
                    onChangeText={text => setEmailAddress(text)}
                />
                <CustomInputBox
                    title={'Password'}
                    icon={lockIcon}
                    isSecure={true}
                    onChangeText={text => setPassword(text)}
                />

                <CustomButton
                    title={'Sign Up'}
                    onPress={onSignUpPress}
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
                    <Text className='text-[#858585]'>
                        Already have an account ?
                    </Text>
                    <TouchableOpacity
                        onPress={() => router.push('/sign-in')}
                    >
                        <Text className='text-[#0286FF]'>Log in</Text>
                    </TouchableOpacity>
                </View>
            </View>


            <CustomModal
                isVisible={pendingVerification}
            >

            </CustomModal>

        </View>
    )
}