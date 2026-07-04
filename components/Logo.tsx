import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import { Image } from "expo-image";

const Logo = () => {
    return (
        <View style={styles.logo}>
            <View style={styles.logoBackground}>
                <Image source={require('@/assets/logo.svg')} style={styles.logoImage} />
            </View>
            <Text style={styles.logoText}>CINENAME  </Text>
        </View>
    );
};

export default Logo;

const styles = StyleSheet.create({
    logo: {
        flexDirection: "row",
        gap: "20",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 28,
    },
    logoText: {
        color: "#91a9b2",
        fontSize: 20,
        fontFamily: "Rubik_600SemiBold",
        fontWeight: 600,
    },
    logoBackground: {
        backgroundColor: "#57e88b",
        padding: 10,
        borderRadius: 6,
    },
    logoImage: {
        height: 20,
        width: 20,
        color: "white"
    }
})