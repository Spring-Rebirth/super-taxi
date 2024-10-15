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
            {/* Render auth screens */}
            <Slot />
        </Stack>
    );
}
