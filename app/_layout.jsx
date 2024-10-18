import { Slot, SplashScreen } from "expo-router";
import { ClerkProvider, ClerkLoaded } from '@clerk/clerk-expo';
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
LogBox.ignoreLogs([
	"Clerk: Clerk has been loaded with development keys. Development instances have strict usage limits and should not be used when deploying your application to production. Learn more: https://clerk.com/docs/deployments/overview [Component Stack]"
]);

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
