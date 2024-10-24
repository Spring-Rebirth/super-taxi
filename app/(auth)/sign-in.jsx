import { View, Text, ImageBackground, Image } from 'react-native'
import React, { } from 'react'
import signUpCar from '../../assets/images/signup-car.png'
import CustomInputBox from '../../components/CustomInputBox'
import lockIcon from '../../assets/icons/lock.png'
import emailIcon from '../../assets/icons/email.png'
import CustomButton from '../../components/CustomButton'
import DividerWithText from '../../components/DividerWithText'
import googleIcon from '../../assets/icons/google.png'
import { TouchableOpacity } from 'react-native'
import { useRouter } from 'expo-router'
import { useSignIn } from '@clerk/clerk-expo'
import OAuth from '../../components/OAuth'


export default function SignIn() {
    const { signIn, setActive, isLoaded } = useSignIn()
    const router = useRouter()

    const [emailAddress, setEmailAddress] = React.useState('')
    const [password, setPassword] = React.useState('')

    const onSignInPress = React.useCallback(async () => {
        if (!isLoaded) {
            return
        }

        try {
            const signInAttempt = await signIn.create({
                identifier: emailAddress,
                password,
            })

            if (signInAttempt.status === 'complete') {
                await setActive({ session: signInAttempt.createdSessionId })
                router.replace('/')
            } else {
                // See https://clerk.com/docs/custom-flows/error-handling
                // for more info on error handling
                console.error(JSON.stringify(signInAttempt, null, 2))
            }
        } catch (err) {
            console.error(JSON.stringify(err, null, 2))
        }
    }, [isLoaded, emailAddress, password])

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
                    onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
                />
                <CustomInputBox
                    title={'Password'}
                    icon={lockIcon}
                    isSecure={true}
                    onChangeText={(password) => setPassword(password)}
                />

                <CustomButton
                    containerStyle={'w-11/12'}
                    title={'Log In'}
                    onPress={onSignInPress}
                />

                <DividerWithText />

                <View className='w-full items-center relative'>
                    <OAuth />
                    <Image
                        className='w-5 h-5 absolute left-20 top-3.5'
                        source={googleIcon}
                    />
                </View>

                <View className='flex-row mt-12 space-x-2'>
                    <Text>Do not have an account ?</Text>
                    <TouchableOpacity
                        onPress={() => router.navigate('/(auth)/sign-up')}
                    >
                        <Text className='text-[#0286FF]'>Sign up</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}