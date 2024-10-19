import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo'
import { Link } from 'expo-router'
import { FlatList, Text, View } from 'react-native'
import { ridesMock } from '../../constants/MockRides'
import TaxiTripCard from '../../components/TaxiTripCard'
import CustomMap from '../../components/CustomMap'
import { useEffect, useState } from 'react'
import * as Location from 'expo-location'
import { useLocationStore } from '../../store/index'
import GoogleTextInput from '../../components/GoogleTextInput'
import searchIcon from '../../assets/icons/search.png'

export default function Home() {
    const { user } = useUser(); // console.log('user:', JSON.stringify(user, null, 2));
    const { setUserLocation, setDestinationLocation } = useLocationStore();
    const [locationPermissions, setLocationPermissions] = useState(false);

    useEffect(() => {
        async function requestLocation() {
            let { status } = await Location.requestForegroundPermissionsAsync();

            if (status !== 'granted') {
                setLocationPermissions(false);
                return;
            }

            let location = await Location.getCurrentPositionAsync();

            const address = await Location.reverseGeocodeAsync({
                latitude: location.coords?.latitude,
                longitude: location.coords?.longitude
            });

            setUserLocation({
                // latitude: location.coords?.latitude,
                // longitude: location.coords?.longitude,
                latitude: 37.78825,
                longitude: -122.4324,
                address: `${address[0].name}, ${address[0].region}`
            });
        }

        requestLocation();
    }, [])

    return (
        <View className='my-8 bg-[#F6F8FA] h-screen'>
            <SignedIn>
                <View className='my-2 px-4'>
                    <Text className='text-xl my-4 font-semibold'>
                        Hello {user?.emailAddresses[0].emailAddress}
                    </Text>
                </View>

                <FlatList
                    style={{ marginBottom: 100 }}
                    data={ridesMock}
                    ListHeaderComponent={() => (
                        <>
                            <View className='items-center'>
                                <GoogleTextInput
                                    icon={searchIcon}
                                />
                            </View>


                            <Text className='text-xl font-semibold ml-4 my-5'>
                                Your current location
                            </Text>
                            <View className='h-[300px] bg-transparent mx-4'>
                                <CustomMap />
                            </View>

                            <Text className='text-xl font-semibold ml-4 my-5'>
                                Recent Rides
                            </Text>
                        </>
                    )}
                    renderItem={({ item }) => (
                        <TaxiTripCard
                            data={item}
                        />
                    )}
                />

            </SignedIn>
            <SignedOut>
                <Link href="/sign-in">
                    <Text>Sign In</Text>
                </Link>
                <Link href="/sign-up">
                    <Text>Sign Up</Text>
                </Link>
            </SignedOut>
        </View>
    )
}