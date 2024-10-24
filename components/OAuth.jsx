import { useOAuth } from "@clerk/clerk-expo";
import { router } from "expo-router";
import { Alert, Image, Text, View } from "react-native";
import CustomButton from "@/components/CustomButton";
import { googleOAuth } from "@/lib/clerk/auth";

const OAuth = () => {
    const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

    const handleGoogleSignIn = async () => {
        const result = await googleOAuth(startOAuthFlow);

        if (result.code === "session_exists") {
            Alert.alert("Success", "Session exists. Redirecting to home screen.");
            router.replace("/(tabs)/home");
        }

        Alert.alert(result.success ? "Success" : "Error", result.message);
    };

    return (
        <CustomButton
            title="Log In with Google"
            containerStyle={'bg-transparent border border-[#EBEBEB] w-11/12'}
            bgVariant="outline"
            titleStyle={'text-black font-normal'}
            onPress={handleGoogleSignIn}
        />
    );
};

export default OAuth;