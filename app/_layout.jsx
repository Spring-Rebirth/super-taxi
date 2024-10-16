import { Redirect, Slot, SplashScreen } from "expo-router";
import { ClerkProvider, ClerkLoaded, SignedIn, SignedOut } from '@clerk/clerk-expo';
import { tokenCache } from '../lib/clerk/auth'
import { LogBox } from "react-native";
import { useEffect } from "react";

// 防止自动隐藏启动屏幕
SplashScreen.preventAutoHideAsync();

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

if (!publishableKey) {
	throw new Error(
		'Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env',
	);
}

// 忽略特定的日志
LogBox.ignoreLogs(["Clerk:"]);

export default function RootLayout() {
	// 直接在组件挂载后隐藏启动屏幕
	useEffect(() => {
		SplashScreen.hideAsync();
	}, []);

	return (
		<ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
			<ClerkLoaded>
				<Slot />
			</ClerkLoaded>
		</ClerkProvider>
	);
}
