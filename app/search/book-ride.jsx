import { useUser } from "@clerk/clerk-expo";
import { Image, Text, View } from "react-native";
import { icons } from "@/constants";
import { formatTime } from "@/lib/utils";
import { useDriverStore, useLocationStore } from "@/store";
import Payment from "../../components/payment";

const BookRide = () => {
    const { user } = useUser();
    const { userAddress, destinationAddress } = useLocationStore();
    const { drivers, selectedDriver } = useDriverStore();

    const driverDetails = drivers?.filter(
        (driver) => +driver.id === selectedDriver,
    )[0];

    return (
        <>
            <Text className="text-xl font-semibold mb-3">
                Ride Information
            </Text>

            <View className="flex flex-col w-full items-center justify-center mt-10">
                <Image
                    source={{ uri: driverDetails?.profile_image_url }}
                    className="w-28 h-28 rounded-full"
                />

                <View className="flex flex-row items-center justify-center mt-5 space-x-2">
                    <Text className="text-lg font-semibold">
                        {driverDetails?.title}
                    </Text>

                    <View className="flex flex-row items-center space-x-0.5">
                        <Image
                            source={icons.star}
                            className="w-5 h-5"
                            resizeMode="contain"
                        />
                        <Text className="text-lg">
                            {driverDetails?.rating}
                        </Text>
                    </View>
                </View>
            </View>

            <View
                className="flex flex-col w-full items-start justify-center py-3 px-5 rounded-3xl bg-general-600 mt-5">
                <View className="flex flex-row items-center justify-between w-full border-b border-white py-3">
                    <Text className="text-lg">Ride Price</Text>
                    <Text className="text-lg text-[#0CC25F]">
                        ${driverDetails?.price || 999}
                    </Text>
                </View>

                <View className="flex flex-row items-center justify-between w-full border-b border-white py-3">
                    <Text className="text-lg">Trip Duration</Text>
                    <Text className="text-lg">
                        {formatTime(parseInt(`${driverDetails?.time}`))}
                    </Text>
                </View>

                <View className="flex flex-row items-center justify-between w-full py-3">
                    <Text className="text-lg ">Car Seats</Text>
                    <Text className="text-lg ">
                        {driverDetails?.car_seats}
                    </Text>
                </View>
            </View>

            <View className="flex flex-col w-full items-start justify-center mt-5">
                <View
                    className="flex flex-row items-center justify-start mt-3 border-t border-b border-general-700 w-full py-3">
                    <Image source={icons.to} className="w-6 h-6" />
                    <Text className="text-lg font-JakartaRegular mx-6">
                        {userAddress}
                    </Text>
                </View>

                <View className="flex flex-row items-center justify-start border-b border-general-700 w-full py-3">
                    <Image source={icons.point} className="w-6 h-6" />
                    <Text className="text-lg mx-6">
                        {destinationAddress}
                    </Text>
                </View>
            </View>

            <Payment
                fullName={user?.fullName}
                email={user?.emailAddresses[0].emailAddress}
                amount={driverDetails?.price}
                driverId={driverDetails?.id}
                rideTime={driverDetails?.time}
            />
        </>
    );
};

export default BookRide;