import Constants from 'expo-constants';
import { Slot, SplashScreen, useNavigationContainerRef } from "expo-router";
import { ClerkProvider, ClerkLoaded } from '@clerk/clerk-expo';
import { tokenCache } from '../lib/clerk/auth'
import { useEffect } from "react";
import * as Sentry from '@sentry/react-native';
import { ReactNavigationInstrumentation } from '@sentry/react-native';
import * as Updates from 'expo-updates';
import { Alert } from 'react-native';

const routingInstrumentation = new ReactNavigationInstrumentation();

Sentry.init({
	dsn: 'https://344ccafd865b926c0b5b840646ea3da9@o4508196155424768.ingest.de.sentry.io/4508201520791632',
	/* If `true`, Sentry will try to print out useful debugging information if something 
	goes wrong with sending the event. Set it to `false` in production */
	debug: false,
});

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

function RootLayout() {

	// Capture the NavigationContainer ref and register it with the instrumentation.
	const ref = useNavigationContainerRef();

	useEffect(() => {
		if (ref) {
			routingInstrumentation.registerNavigationContainer(ref);
		}
	}, [ref]);
	useEffect(() => {
		const checkForUpdates = async () => {
			try {
				const update = await Updates.checkForUpdateAsync();
				if (update.isAvailable) {
					setIsUpdating(true);
					await Updates.fetchUpdateAsync();
					Alert.alert(
						'Update Available',
						'New update downloaded. Do you want to restart the app to apply the update?',
						[
							{
								text: 'Later',
								onPress: () => setIsUpdating(false),
								style: 'cancel',
							},
							{
								text: 'Restart',
								onPress: () => Updates.reloadAsync(),
							},
						],
						{ cancelable: false }
					);
				}
			} catch (error) {
				console.error('检查更新时发生错误:', error);
			} finally {
				SplashScreen.hideAsync();
			}
		};

		checkForUpdates();
	}, []);
	return (
		<ClerkProvider publishableKey={clerkPublishableKey} tokenCache={tokenCache}>
			<ClerkLoaded>
				<Slot />
			</ClerkLoaded>
		</ClerkProvider>
	);
}

export default Sentry.wrap(RootLayout);
