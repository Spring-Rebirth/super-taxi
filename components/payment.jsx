import { router } from "expo-router";
import { useState, useRef } from "react";
import { ActivityIndicator, Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import { ReactNativeModal } from "react-native-modal";
import CustomButton from "@/components/CustomButton";
import { images } from "@/constants";
import { fetchAPI } from "../lib/fetch";
import { useLocationStore } from "../store";
import { useAuth } from "@clerk/clerk-expo";

const Payment = ({ fullName, email, amount, driverId, rideTime }) => {
    const [success, setSuccess] = useState(false);
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

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

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
            await sleep(1500);
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
                <View className="flex flex-col items-center justify-center bg-white p-6 rounded-3xl shadow-lg">
                    <Text className="text-xl font-bold text-gray-800">
                        Add Payment Information
                    </Text>
                    <Text className="text-sm text-gray-600 mt-2">
                        Bank Card Information
                    </Text>

                    <View className="w-full mt-4">
                        <View className="border border-gray-300 rounded-lg p-2 mb-4">
                            <Text className="text-gray-500 text-sm mb-1">Card Number</Text>
                            <TextInput
                                className="px-4 py-2 border border-gray-300 rounded-lg"
                                placeholder="Enter card number"
                                keyboardType="number-pad"
                            />
                        </View>

                        <View className="border border-gray-300 rounded-lg p-2">
                            <Text className="text-gray-500 text-sm mb-1">Password</Text>
                            <TextInput
                                className="px-4 py-2 border border-gray-300 rounded-lg"
                                placeholder="Enter password"
                                secureTextEntry={true}
                            />
                        </View>
                    </View>

                    <View className="w-full flex-row justify-center mt-6">
                        {isLoading && (
                            <ActivityIndicator
                                className="absolute bottom-2.5 right-[72] z-10"
                                size="small"
                                color="#fff"
                            />
                        )}

                        <TouchableOpacity
                            className={`w-full bg-blue-500 py-3 rounded-full mt-4 ${isLoading ? 'opacity-50' : ''}`}
                            disabled={isLoading}
                            onPress={async () => {
                                setIsDisabled(true);
                                await handleCreateRide();
                                setShowCheck(false);
                                setSuccess(true);
                            }}
                        >
                            <Text className="text-center text-white font-semibold">
                                {isLoading ? 'Processing...' : 'Confirm Payment'}
                            </Text>
                        </TouchableOpacity>
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