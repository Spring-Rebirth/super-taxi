import React from 'react';
import { Redirect, Slot, Stack } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';

export default function AuthLayout() {
    const { isSignedIn } = useAuth();

    if (isSignedIn) {
        return <Redirect href="/home" />;
    }

    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name='index' options={{ headerShown: false }} />
            <Stack.Screen name='sign-in' options={{ headerShown: false }} />
            <Stack.Screen name='sign-up' options={{ headerShown: false }} />
        </Stack>
    );
}
