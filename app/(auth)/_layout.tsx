import { Redirect, Stack } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";

const AuthRoutesLayout = () => {
    const { isSignedIn } = useAuth();
    if (isSignedIn) return <Redirect href={'/'} />
    return (
        <Stack screenOptions={{ headerShown: false, statusBarBackgroundColor: "black" }} />
    )
}

export default AuthRoutesLayout
