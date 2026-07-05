import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';

const Loading = () => {
    const rotateAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.timing(rotateAnim, {
                toValue: 1,
                duration: 900,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        ).start();
    }, []);

    const spin = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <View style={styles.loading}>
            <Animated.View style={[styles.spinner, { transform: [{ rotate: spin }] }]} />
            <Text style={styles.loadingText}>Se încarcă...    </Text>
        </View>
    );
};

export default Loading;

const styles = StyleSheet.create({
    loading: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
    },
    spinner: {
        width: 42,
        height: 42,
        borderRadius: 16,
        borderWidth: 6,
        borderColor: 'rgba(87, 232, 139, 0.25)',
        borderTopColor: '#57e88b',
    },
    loadingText: {
        textAlign: 'center',
        fontFamily: 'Rubik_700Bold',
        width: '100%',
        color: 'white',
        fontSize: 14,
    },
});