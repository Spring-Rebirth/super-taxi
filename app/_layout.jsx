import Constants from 'expo-constants';
import { Slot, SplashScreen } from "expo-router";
import { ClerkProvider, ClerkLoaded } from '@clerk/clerk-expo';
import { tokenCache } from '../lib/clerk/auth'
import { useEffect } from "react";

const originalWarn = console.warn;
console.warn = (message) => {
	if (message.includes('Clerk')) {
		return;
	}
	originalWarn(message);
};

// 防止自动隐藏启动屏幕
SplashScreen.preventAutoHideAsync();

const clerkPublishableKey = Constants.expoConfig.extra.clerkPublishableKey;

if (!clerkPublishableKey) {
	throw new Error(
		'Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env',
	);
}

export default function RootLayout() {
	// 直接在组件挂载后隐藏启动屏幕
	useEffect(() => {
		SplashScreen.hideAsync();
	}, []);

	return (
		<ClerkProvider publishableKey={clerkPublishableKey} tokenCache={tokenCache}>
			<ClerkLoaded>
				<Slot />
			</ClerkLoaded>
		</ClerkProvider>
	);
}
