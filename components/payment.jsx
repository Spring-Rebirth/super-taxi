import { router } from "expo-router";
import { useState, useRef } from "react";
import { Image, Text, TextInput, View } from "react-native";
import { ReactNativeModal } from "react-native-modal";
import CustomButton from "@/components/CustomButton";
import { images, icons } from "@/constants";
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet'


const Payment = () => {
    const [success, setSuccess] = useState(false);
    const bottomSheetRef = useRef(null);

    return (
        <>
            <CustomButton
                title="Confirm Ride"
                className="my-10"
                onPress={() => { }}
            />

            <BottomSheet
                ref={bottomSheetRef}
                snapPoints={["60%"]}
                index={0}
            >
                <BottomSheetView style={{ flex: 1, padding: 15 }}>
                    <View className='px-2'>
                        <Image
                            className='w-5 h-5'
                            source={icons.close}
                            resizeMode={'contain'}
                        />
                        <Text className='text-2xl font-bold mt-5'>
                            Add payment info
                        </Text>
                        <Text className='mt-4'>
                            Bank card information
                        </Text>
                        <View className='border border-gray-400 w-full h-32 mt-2'>
                            <Text className='m-2'>Card number</Text>
                            <TextInput
                                className='px-4'
                                placeholder="Enter card number"
                            />
                            <View className='bg-gray-400 h-[1px]' />
                            <Text className='m-2'>Password</Text>
                            <TextInput
                                className='px-4'
                                placeholder="Enter password"
                            />
                        </View>
                        <CustomButton
                            containerStyle={'mt-8'}
                            title='Confirm'
                        />
                    </View>
                </BottomSheetView>
            </BottomSheet>

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
                        onPress={() => {
                            setSuccess(false);
                            router.push("/(root)/(tabs)/home");
                        }}
                        className="mt-5"
                    />
                </View>
            </ReactNativeModal>
        </>
    );
};

export default Payment;