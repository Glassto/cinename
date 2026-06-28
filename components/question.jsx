import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Question = ({ id }) => {
    const questionData = [
        {
            id: 1,
            title: "Filmul preferat, și de ce?",
            subtitle: "Cu cât mai sincer, cu atât mai bune rezultate."
        },
        {
            id: 2,
            title: "Preferi lansări mai noi, sau mai clasice?",
            subtitle: "Dacă te simți nostalgic, alege cele clasice."
        },
        {
            id: 3,
            title: "Dorești ceva amuzant sau ceva mai serios?",
            subtitle: "Alege în funcție de cum te simți."
        }
    ]

    return (
        <View style={styles.question}>
            {questionData.map((question => (
                question.id === id ? (
                    <React.Fragment key={question.id}>
                        <View style={styles.questionBackground}>
                            <Text style={styles.questionNumber}>{question.id}</Text>
                        </View>
                        <View>
                            <Text style={styles.questionTitle}>{question.title}</Text>
                            <Text style={styles.questionSubTitle}>{question.subtitle}</Text>
                        </View>
                    </React.Fragment>
                ) : null
            )))}
        </View>
    );
};

export default Question;

const styles = StyleSheet.create({
    question: {
        flexDirection: 'row',
        gap: 20,
        alignItems: 'center',
        marginRight: 10
    },
    questionBackground: {
        height: 40,
        width: 40,
        backgroundColor: '#aec0c7',
        borderRadius: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    questionNumber: {
        fontSize: 20,
        fontFamily: 'Rubik_600SemiBold',
        marginTop: 2,
    },
    questionTitle: {
        fontSize: 20,
        fontFamily: 'Rubik_600SemiBold',
        marginRight: 20,
        color: "white",
    },
    questionSubTitle: {
        margin: 0,
        fontSize: 14,
        fontFamily: 'Rubik_400Regular',
        color: "#91a9b2"
    }
})