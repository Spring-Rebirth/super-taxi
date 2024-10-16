import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo'
import { Link } from 'expo-router'
import { Text, View } from 'react-native'

export default function Home() {
    const { user } = useUser();
    console.log('user:', JSON.stringify(user, null, 2));

    return (
        <View className='my-8'>
            <SignedIn>
                <Text className='text-2xl'>
                    Hello {user?.emailAddresses[0].emailAddress}
                </Text>



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