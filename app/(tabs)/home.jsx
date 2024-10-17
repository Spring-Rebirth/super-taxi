import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo'
import { Link } from 'expo-router'
import { FlatList, Text, View } from 'react-native'
import { ridesMock } from '../../constants/MockRides'
import TaxiTripCard from '../../components/TaxiTripCard'

export default function Home() {
    const { user } = useUser();
    console.log('user:', JSON.stringify(user, null, 2));

    return (
        <View className='my-8 bg-[#F6F8FA] h-screen'>
            <SignedIn>
                <View className='my-2 px-4'>
                    <Text className='text-xl mt-4'>
                        Hello {user?.emailAddresses[0].emailAddress}
                    </Text>
                </View>

                <FlatList
                    data={ridesMock}
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