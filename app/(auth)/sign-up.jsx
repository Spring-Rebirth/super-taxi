import { View, Text, ImageBackground, Image, TextInput, Alert } from 'react-native'
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
import { useRouter } from 'expo-router'
import { useSignUp } from '@clerk/clerk-expo'
import CustomModal from '../../components/CustomModal'
import check from '../../assets/images/check.png'
import { api } from '../../api-mock';
import OAuth from '../../components/OAuth'
import { StatusBar } from 'expo-status-bar';

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export default function SignUp() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();
  const [username, setUsername] = React.useState('');
  const [emailAddress, setEmailAddress] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [verifySuccess, setVerifySuccess] = React.useState(false);
  const [code, setCode] = React.useState('');

  const onSignUpPress = async () => {
    if (!isLoaded) {
      return
    }

    try {
      await signUp.create({
        emailAddress,
        password,
        username
      })

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

      setPendingVerification(true)
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));

      if (err && err.errors && err.errors.length > 0) {
        // 提取第一个错误的 message
        const errorMessage = err.errors[0].message;
        Alert.alert('Registration Error', errorMessage);
      } else {
        // 如果错误格式未知，显示通用错误信息
        Alert.alert('Registration Error', 'An unknown error occurred, please try again.');
      }
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
        //  添加用户信息到本地存储
        try {
          await api.createUser({
            name: username,
            email: emailAddress,
            clerkId: completeSignUp.createdUserId
          });

        } catch (error) {
          console.error('Error creating user:', error);
          // 根据需要处理错误，例如显示错误消息或提示用户重试
        }

        setVerifySuccess(true);
        await sleep(3000);
        await setActive({ session: completeSignUp.createdSessionId });
      } else {
        console.error(JSON.stringify(completeSignUp, null, 2));
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
      Alert.alert(err);
    }
  }

  return (
    <View className='w-screen h-full bg-white'>
      <StatusBar style='dark' />
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
          containerStyle={'w-11/12'}
          title={'Sign Up'}
          onPress={onSignUpPress}
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


      <CustomModal isVisible={pendingVerification}>
        <View className='w-full h-full px-8 justify-center'>

          <View className='mb-3 -mt-4'>
            <Text className='text-2xl font-bold'>
              Verification
            </Text>
            <Text>We sent a verification code to</Text>
            <Text>{emailAddress}</Text>
          </View>

          <Text className='text-xl font-semibold'>
            Code
          </Text>

          <TextInput
            className='bg-[#F6F8FA] my-3 h-12 rounded-full border border-sky-400
                                    py-1.5 text-center'
            keyboardType={'numeric'}
            placeholder='Enter Code'
            onChangeText={text => setCode(text)}
          />

          <CustomButton
            onPress={onPressVerify}
            containerStyle={'w-full mt-6 bg-green-500'}
            title={'Verify Email'}
          />
        </View>
      </CustomModal>

      <CustomModal isVisible={verifySuccess}>
        <View className='w-full h-full px-8 items-center justify-center'>
          <Image
            className='w-[100] h-[100] mb-10'
            source={check}
          />
          <Text className='text-xl font-bold mb-2 text-center'>
            Verification Successful
          </Text>

          <Text className='text-center text-gray-500 mb-10'>
            Auto-redirect to homepage after{'\n'} 3 seconds.
          </Text>
          <CustomButton
            title={'Go Now'}
            onPress={() => router.replace('(tabs)/home')}
          />
        </View>
      </CustomModal>

    </View>
  )
}