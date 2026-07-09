import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import { Image } from 'expo-image'
import Overview from "@/components/Overview";

const Suggestion = ({ data, reset }) => {
    const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500'
    const posterUrl = data.backdrop_path
        ? `${IMAGE_BASE_URL}${data.backdrop_path}`
        : null;

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                {posterUrl ? (
                    <Image
                        source={{ uri: posterUrl }}
                        style={styles.poster}
                        contentFit="cover"
                        transition={200}
                    />
                ) : (
                    <View style={styles.placeholder}>
                        <Text style={styles.placeholderText}>Fără imagine</Text>
                    </View>
                )}

                <View style={styles.header}>
                    <Text style={styles.title}>{data.title || data.name}</Text>
                    <View style={styles.mediaType}>
                        <Text style={styles.mediaText}>{data.media_type === 'movie' ? "Film " : "Serial  "}</Text>
                    </View>
                </View>
                <Overview data={data}/>
                <Text style={styles.overview} numberOfLines={6}>{data.overview}</Text>
            </View>
            <TouchableOpacity
                activeOpacity={0.8}
                style={styles.button}
                onPress={reset}
            >
                <Text style={styles.buttonText} >ÎNCEARCĂ DIN NOU</Text>
            </TouchableOpacity>
        </View>
    );
};

export default Suggestion;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        padding: 16
    },
    content: {
        flex: 1,
        justifyContent: 'flex-start',
    },
    poster: {
        width: "100%",
        height: 200,
        borderRadius: 8,
        borderTopLeftRadius: 44,

    },
    placeholder: {
        width: '100%',
        height: 200,
        backgroundColor: '#2a3547',
        borderWidth: 1,
        borderColor: '#414e62',
        borderRadius: 8,
        borderTopLeftRadius: 44,
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderText: {
        width: '100%',
        fontFamily: 'Rubik_700Bold',
        textAlign: 'center',
        color: '#91a9b2',
    },
    header: {
        marginVertical: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    title: {
        fontSize: 28,
        maxWidth: 260,
        fontFamily: 'Rubik_700Bold',
        color: '#fff',
    },
    mediaType: {
        backgroundColor: '#2a3547',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#414e62',
        paddingHorizontal: 12,
        paddingVertical: 4,
    },
    mediaText: {
        textAlign: 'center',
        width: '100%',
        color: '#d4dbe0',
    },
    overview: {
        paddingHorizontal: 6,
        fontSize: 14,
        fontFamily: 'Rubik_400Regular',
        color: '#aab8c0',
        lineHeight: 22
    },
    button: {
        marginBottom: 20,
        width: '100%',
        backgroundColor: '#57e88b',
        alignItems: "center",
        padding: 16,
        borderRadius: 10,
    },
    buttonText: {
        color: '#041022',
        width: '100%',
        textAlign: 'center',
        fontFamily: 'Rubik_700Bold',
        fontSize: 16,
    }
})