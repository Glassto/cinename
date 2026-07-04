import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Hero = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.heroTitle}>Găsește filmul preferat</Text>
            <Text style={styles.heroSubTitle}>Nu mai pierde timpul căutând...</Text>
        </View>
    );
};

export default Hero;

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 20,
        marginVertical: 50,
    },
    heroTitle: {
        fontSize: 24,
        fontFamily: 'Rubik_700Bold',
        color: "white",
    },
    heroSubTitle: {
        fontSize: 16,
        fontFamily: 'Rubik_400Regular',
        color: "#718896",
        marginTop: 6,
    }
})