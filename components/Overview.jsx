import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Overview = ({ data }) => {
    const getYear = () => {
        if (data.first_air_date) return new Date(data.first_air_date).getFullYear()
        if (data.release_date) return new Date(data.release_date).getFullYear()
        return ''
    }
    const convertedYear = getYear()

    const convertedRating = (typeof data.vote_average === 'number')
        ? data.vote_average.toFixed(1)
        : "N/A"

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.text} numberOfLines={1}>
                    {data.original_name || data.original_title || "Titlu necunoscut"}
                </Text>
            </View>

            <View style={styles.content}>
                <Text style={styles.text} numberOfLines={1}>
                    {convertedYear}
                </Text>
            </View>

            <View style={styles.content}>
                <Text style={styles.text} numberOfLines={1}>
                    {convertedRating !== "N/A" ? (convertedRating + " din 10") : " - "}
                </Text>
            </View>
        </View>
    );
};

export default Overview;

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 20,
        minHeight: 40,
        backgroundColor: '#2a3547',
        borderWidth: 1,
        borderColor: '#414e62',
        borderRadius: 8,
    },
    content: {
        flex: 1,
    },
    text: {
        textAlign: 'center',
        fontSize: 12,
        color: '#d4dbe0',
    }
});