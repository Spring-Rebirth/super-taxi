import { View, Alert, Image, Text } from 'react-native'
import React, { useState } from 'react'
import CustomButton from './CustomButton'
import { useStripe } from '@stripe/stripe-react-native'
import { useLocationStore } from '../store';
import { fetchAPI } from '../lib/fetch';
import { useAuth } from '@clerk/clerk-expo';
import ReactNativeModal from 'react-native-modal';
import checkIcon from '../assets/images/check.png'
import { router } from 'expo-router';


export default function Payment({ fullName, email, amount, driverId, rideTime }) {
    const { initPaymentSheet, presentPaymentSheet } = useStripe();
    const [success, setSuccess] = useState(false);
    const { userId } = useAuth();
    const {
        userAddress,
        userLongitude,
        userLatitude,
        destinationLongitude,
        destinationLatitude,
        destinationAddress
    } = useLocationStore();

    const confirmHandler = async (paymentMethod, intentCreationCallBack) => {
        const { paymentIntent, customer } = await fetchAPI(
            "/(api)/(stripe)/create",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: fullName || email.split("@")[0],
                    email: email,
                    amount: amount,
                    paymentMethodId: paymentMethod.id
                })
            }
        );

        if (paymentIntent.client_secret) {
            const { result } = await fetchAPI("/(api)/(stripe)/pay", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    payment_method_id: paymentMethod.id,
                    payment_intent_id: paymentIntent.id,
                    customer_id: customer
                }),
            });

            if (result.client_secret) {
                try {
                    await fetchAPI("/(api)/ride/create", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            origin_address: userAddress || "Unknown",  // 确保有值
                            destination_address: destinationAddress || "Unknown",
                            origin_latitude: userLatitude,
                            origin_longitude: userLongitude,
                            destination_latitude: destinationLatitude,
                            destination_longitude: destinationLongitude,
                            ride_time: rideTime ? rideTime.toFixed(0) : 0,  // 确保 rideTime 有效
                            fare_price: parseInt(amount) * 100 || 0,  // 确保 amount 是数字
                            payment_status: "paid",
                            driver_id: driverId,
                            user_id: userId,
                        })
                    });
                } catch (error) {
                    console.error("Error creating ride:", error);
                }

                intentCreationCallBack({
                    clientSecret: result.client_secret
                });
            }
        }
    }

    const initializePaymentSheet = async () => {
        const { error } = await initPaymentSheet({
            merchantDisplayName: "Ride Inc.",
            intentConfiguration: {
                mode: {
                    amount: parseInt(amount) * 100,
                    currencyCode: "USD",
                },
                confirmHandler: confirmHandler
            },
            returnURL: "myapp://book-ride"
        });
        if (error) {
            console.log(error);
        }
    }

    const openPaymentSheet = async () => {
        await initializePaymentSheet();

        const { error } = await presentPaymentSheet();

        if (error) {
            Alert.alert(`Error code: ${error.code}`, error.message);
        } else {
            Alert.alert('Success', 'Your payment method is successfully set up for future payments!');
            setSuccess(true);
        }
    };


    return (
        <>
            <View className='my-10'>
                <CustomButton
                    onPress={openPaymentSheet}
                    title={'Confirm Ride'}
                />
            </View>

            <ReactNativeModal isVisible={success} onBackdropPress={() => setSuccess(false)}>
                <View className='justify-center items-center bg-white p-7 rounded-2xl'>
                    <Image
                        className='w-28 h-28 mt-5'
                        source={checkIcon}
                        resizeMode={'contain'}
                    />
                    <Text className='text-2xl text-center mt-8 font-semibold'>
                        Booking placed successfully
                    </Text>
                    <Text className='text-[#858585] mt-4 text-center'>
                        Thank you for your booking! Your reservation has been successfully placed. Please proceed with your trip.
                    </Text>
                    <CustomButton
                        containerStyle={'mt-6'}
                        title={'Back Home'}
                        onPress={() => {
                            setSuccess(false);
                            router.replace('/(tabs)/home');
                        }}
                    />
                </View>
            </ReactNativeModal>
        </>
    )
}