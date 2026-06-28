import { useState } from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import Form from "@/components/Form";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { moviesData } from "@/data/movies";
import { openai, supabase } from "@/config";

const Main = () => {
    const [data, setData] = useState({
        favMovie: '',
        favReleaseDate: '',
        genreMovie: '',
    });

    async function splitText(data) {
        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 200,
            chunkOverlap: 26
        })

        const output = await splitter.createDocuments([data]);
        console.log(output);
        return output
    }
    async function createAndStoreEmbeddings() {
        const chunkData = await splitText(moviesData);
        const data = await Promise.all(
            chunkData.map(async (chunk) => {
                const embedding = await openai.embeddings.create({
                    model: "text-embedding-ada-002",
                    input: chunk.pageContent
                })

                return {
                    content: chunk.pageContent,
                    embedding: embedding.data[0].embedding
                }
            })
        )
        console.error("SUCCESS!!")
        await supabase.from('movies').insert(data)
    }


    async function handleSubmit() {
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.content}>
                <Form data={data} setData={setData} handleSubmit={handleSubmit} />
            </View>
        </ScrollView>
    );
};

export default Main;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1d2838',
        height: '100%',
        borderTopLeftRadius: 60
    },
    content: {
        flex: 1,
        marginHorizontal: 40,
        marginVertical: 40,
    },
})