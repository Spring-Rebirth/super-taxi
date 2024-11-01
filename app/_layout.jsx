import Constants from 'expo-constants';
import { Slot, SplashScreen, useNavigationContainerRef } from "expo-router";
import { ClerkProvider, ClerkLoaded } from '@clerk/clerk-expo';
import { tokenCache } from '../lib/clerk/auth'
import { useEffect, useState } from "react";
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
	const [isUpdating, setIsUpdating] = useState(false);
	const [canNavigate, setCanNavigate] = useState(false);

	// Capture the NavigationContainer ref and register it with the instrumentation.
	const ref = useNavigationContainerRef();


	useEffect(() => {
		async function checkForUpdates() {
			try {
				console.log('Checking for updates...');
				const update = await Updates.checkForUpdateAsync();
				console.log('Update available:', update.isAvailable);

				if (update.isAvailable) {
					console.log('Fetching update...');
					setIsUpdating(true);
					await Updates.fetchUpdateAsync();
					console.log('Update fetched.');

					Alert.alert(
						'Update Available',
						'A new update has been downloaded. Would you like to restart the app now?',
						[
							{
								text: 'Later',
								onPress: () => {
									setIsUpdating(false);
									setCanNavigate(true);
								},
								style: 'cancel',
							},
							{
								text: 'Restart Now',
								onPress: async () => {
									console.log('Reloading app...');
									await Updates.reloadAsync();
								},
							},
						],
						{ cancelable: false }
					);

				} else {
					console.log('No updates available.');
					setCanNavigate(true);
				}
			} catch (e) {
				console.log('Error checking for updates:', e);
				setCanNavigate(true);
			}
		}


		checkForUpdates();
	}, []);

	useEffect(() => {
		if (ref) {
			routingInstrumentation.registerNavigationContainer(ref);
		}
	}, [ref]);

	useEffect(() => {
		if (canNavigate && !isUpdating) {
			SplashScreen.hideAsync();
		}
	}, [canNavigate, isUpdating]);


	if (isUpdating || !canNavigate) {
		return null;
	}

	return (
		<ClerkProvider publishableKey={clerkPublishableKey} tokenCache={tokenCache}>
			<ClerkLoaded>
				<Slot />
			</ClerkLoaded>
		</ClerkProvider>
	);
}

export default Sentry.wrap(RootLayout);
