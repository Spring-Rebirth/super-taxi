import { router } from "expo-router";
import { useState, useRef } from "react";
import { ActivityIndicator, Image, Text, TextInput, View } from "react-native";
import { ReactNativeModal } from "react-native-modal";
import CustomButton from "@/components/CustomButton";
import { images } from "@/constants";
import { fetchAPI } from "../lib/fetch";
import { useLocationStore } from "../store";
import { useAuth } from "@clerk/clerk-expo";

const Payment = ({ fullName, email, amount, driverId, rideTime }) => {
    const [success, setSuccess] = useState(false);
    const bottomSheetRef = useRef(null);
    const [showCheck, setShowCheck] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);
    const { userId } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const {
        userAddress,
        userLongitude,
        userLatitude,
        destinationLatitude,
        destinationAddress,
        destinationLongitude,
    } = useLocationStore();

    const handleCreateRide = async () => {
        try {
            setIsLoading(true);
            await fetchAPI("/(api)/ride/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    origin_address: userAddress,
                    destination_address: destinationAddress,
                    origin_latitude: userLatitude,
                    origin_longitude: userLongitude,
                    destination_latitude: destinationLatitude,
                    destination_longitude: destinationLongitude,
                    ride_time: rideTime.toFixed(0),
                    fare_price: parseInt(amount) * 100,
                    payment_status: "paid",
                    driver_id: driverId,
                    user_id: userId,
                }),
            });
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            <CustomButton
                title="Confirm Ride"
                className="my-10"
                onPress={() => { setShowCheck(true) }}
                disabled={isDisabled}
            />

            <ReactNativeModal
                isVisible={showCheck}
                onBackdropPress={() => setShowCheck(false)}
            >
                <View className='flex flex-col items-center justify-center bg-white p-7 rounded-2xl'>
                    <Text className='text-2xl font-bold'>
                        Add payment info
                    </Text>
                    <Text className='mt-4'>
                        Bank card information
                    </Text>
                    <View className='border border-gray-400 w-full h-32 mt-2'>
                        <Text className='m-2'>Card Number</Text>
                        <TextInput
                            className='px-4'
                            placeholder="Enter card number"
                        />
                        <View className='bg-gray-400 h-[1px]' />
                        <Text className='m-2'>Password</Text>
                        <TextInput
                            className='px-4'
                            placeholder="Enter password"
                            secureTextEntry={true}
                        />
                    </View>
                    <View className='w-full flex-row'>
                        {isLoading && (
                            <ActivityIndicator
                                className='absolute bottom-3 right-[80] z-10'
                                size={'small'}
                                color="#fff"
                            />
                        )}

                        <CustomButton
                            containerStyle={'mt-8'}
                            title={isLoading ? 'Paying' : 'Confirm'}
                            onPress={() => {
                                setSuccess(true);
                                setShowCheck(false);
                                setIsDisabled(true);
                                handleCreateRide();
                            }}
                        />
                    </View>


                </View>

            </ReactNativeModal>

            {/* ---------------------------------------------------- */}
            <ReactNativeModal
                isVisible={success}
                onBackdropPress={() => setSuccess(false)}
            >
                <View className="flex flex-col items-center justify-center bg-white p-7 rounded-2xl">
                    <Image source={images.check} className="w-28 h-28 mt-5" />

                    <Text className="text-2xl text-center font-JakartaBold mt-5">
                        Booking placed successfully
                    </Text>

                    <Text className="text-md text-general-200 font-JakartaRegular text-center mt-3">
                        Thank you for your booking. Your reservation has been successfully
                        placed. Please proceed with your trip.
                    </Text>

                    <CustomButton
                        title="Back Home"
                        containerStyle={"mt-5"}
                        onPress={() => {
                            setSuccess(false);
                            router.navigate("/(tabs)/home");
                        }}
                    />
                </View>
            </ReactNativeModal>
        </>
    );
};

export default Payment;