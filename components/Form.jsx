import React from 'react';
import {View, Text, TouchableOpacity, TextInput, StyleSheet, ScrollView} from 'react-native';
import Question from "./Question";

const Form = ({ data, setData, handleSubmit }) => {
    return (
        <ScrollView style={styles.container}>
            <View style={styles.content}>
                <Question id={1}/>
                <TextInput
                    style={styles.textarea}
                    multiline
                    numberOfLines={4}
                    placeholder={"Cars 3, pentru că..."}
                    placeholderTextColor="#91a9b2"
                    value={data.favMovie}
                    onChangeText={text => setData({ ...data, favMovie: text })}
                />

                <Question id={2}/>
                <TextInput
                    style={styles.textarea}
                    multiline
                    numberOfLines={4}
                    placeholder={"Prefer cele vechi..."}
                    placeholderTextColor="#91a9b2"
                    value={data.favReleaseDate}
                    onChangeText={text => setData({ ...data, favReleaseDate: text })}
                />

                <Question id={3}/>
                <TextInput
                    style={styles.textarea}
                    multiline
                    numberOfLines={4}
                    placeholder={"Aș vrea să mă amuz..."}
                    placeholderTextColor="#91a9b2"
                    value={data.genreMovie}
                    onChangeText={text => setData({ ...data, genreMovie: text })}
                />
                <TouchableOpacity
                    activeOpacity={0.8}
                    style={styles.button}
                    onPress={handleSubmit}
                >
                    <Text style={styles.buttonText} >CAUTĂ</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

export default Form;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1d2838',
        height: '100%',
        borderTopLeftRadius: 60,
    },
    content: {
        flex: 1,
        padding: 40,
    },
    textarea: {
        width: '100%',
        minHeight: 100,
        marginVertical: 32,
        padding: 12,
        backgroundColor: '#2a3547',
        borderWidth: 1,
        borderColor: '#414e62',
        borderRadius: 10,
        fontSize: 16,
        fontFamily: 'Rubik_400Regular',
        color: "white",
        textAlignVertical: 'top',
    },
    button: {
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