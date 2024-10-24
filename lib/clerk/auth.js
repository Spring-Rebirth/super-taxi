import * as SecureStore from 'expo-secure-store';
import * as Linking from "expo-linking";
import { fetchAPI } from '../fetch';

const tokenCache = {
    async getToken(key) {
        try {
            const item = await SecureStore.getItemAsync(key);
            return item;
        } catch (error) {
            console.error('SecureStore get item error: ', error);
            await SecureStore.deleteItemAsync(key);
            return null;
        }
    },
    async saveToken(key, value) {
        try {
            return await SecureStore.setItemAsync(key, value);
        } catch (err) {
            console.error('SecureStore set item error: ', err);
        }
    },
    async clearToken(key) {
        try {
            await SecureStore.deleteItemAsync(key);
        } catch (err) {
            console.error('SecureStore delete item error: ', err);
        }
    },
};

const googleOAuth = async (startOAuthFlow) => {
    try {
        const { createdSessionId, setActive, signUp } = await startOAuthFlow({
            redirectUrl: Linking.createURL("/(tabs)/home"),
        });

        if (createdSessionId) {
            if (setActive) {
                await setActive({ session: createdSessionId });

                if (signUp.createdUserId) {
                    await fetchAPI("/(api)/user", {
                        method: "POST",
                        body: JSON.stringify({
                            name: `${signUp.firstName} ${signUp.lastName}`,
                            email: signUp.emailAddress,
                            clerkId: signUp.createdUserId,
                        }),
                    });
                }

                return {
                    success: true,
                    code: "success",
                    message: "You have successfully signed in with Google",
                };
            }
        }

        return {
            success: false,
            message: "An error occurred while signing in with Google",
        };
    } catch (err) {
        console.error(err);
        return {
            success: false,
            code: err.code,
            message: err?.errors[0]?.longMessage,
        };
    }
};

export { tokenCache, googleOAuth };
