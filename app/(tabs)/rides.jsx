import { useUser } from "@clerk/clerk-expo";
import { ActivityIndicator, FlatList, Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import TaxiTripCard from "@/components/TaxiTripCard";
import { images } from "@/constants";
import { useEffect, useState } from "react";
import { api } from "../../api-mock";

const Rides = () => {
    const { user } = useUser();
    const [recentRides, setRecentRides] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecentRides = async () => {
            if (!user?.id) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const response = await api.getUserRides(user.id);
                setRecentRides(response.data);
            } catch (err) {
                console.error('Error fetching recent rides:', err);
                // 根据需要设置错误状态
            } finally {
                setLoading(false);
            }
        };

        fetchRecentRides();
    }, [user]);

    return (
        <SafeAreaView className="flex-1 bg-white">
            <FlatList
                data={recentRides}
                renderItem={({ item }) => <TaxiTripCard data={item} />}
                keyExtractor={(item, index) => index.toString()}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{
                    paddingBottom: 100,
                }}
                ListEmptyComponent={() => (
                    <View className="flex flex-col items-center justify-center">
                        {!loading ? (
                            <>
                                <Image
                                    source={images.noResult}
                                    className="w-40 h-40"
                                    alt="No recent rides found"
                                    resizeMode="contain"
                                />
                                <Text className="text-sm">No recent rides found</Text>
                            </>
                        ) : (
                            <ActivityIndicator size="small" color="#000" />
                        )}
                    </View>
                )}
                ListHeaderComponent={
                    <>
                        <Text className="text-2xl font-JakartaBold my-5 pl-5">All Rides</Text>
                    </>
                }
            />
        </SafeAreaView>
    );
};

export default Rides;