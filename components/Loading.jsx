import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Loading = () => {
    return (
        <View style={styles.loading}>
            <Text style={styles.loadingText}>Se încarcă...</Text>
        </View>
    );
};

export default Loading;

const styles = StyleSheet.create({
    loading: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    loadingText: {
        width: "100%",
        color: "white"
    }
})