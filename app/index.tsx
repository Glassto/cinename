import { useEffect } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFonts, Rubik_400Regular, Rubik_600SemiBold, Rubik_700Bold} from "@expo-google-fonts/rubik";
import * as SplashScreen from 'expo-splash-screen'
import Logo from "../components/Logo";
import Hero from "../components/Hero"
import Main from "../components/Main"

SplashScreen.preventAutoHideAsync();

export default function Index() {
    const [loaded, error] = useFonts({
        Rubik_400Regular,
        Rubik_600SemiBold,
        Rubik_700Bold,
    })
    useEffect(() => {
        if (loaded || error) {
            SplashScreen.hideAsync();
        }
    }, [loaded, error]);
    if (!loaded && !error) {
        return null;
    }

    return (
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
            <Logo />
            <Hero />
            <Main />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#041022",
    },
})
