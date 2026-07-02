import { useState } from 'react';
import {View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Text} from 'react-native';
import Form from "@/components/Form";
import Loading from "@/components/Loading";
import Suggestion from "@/components/Suggestion";
import {openai, supabase, tmdb} from "@/config";

const Main = () => {
    const [data, setData] = useState({
        favMovie: '',
        favReleaseDate: '',
        genreMovie: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [movieData, setMovieData] = useState({});

    async function getSuggestions() {
        const messages = [
            {
                role: "system",
                content: `
You are a movie recommendation engine for a mobile app. You will receive three pieces of information from the user, based on answers to these questions asked in the app:
1. Their favorite movie, and why they like it.
2. Whether they prefer newer releases or more classic movies.
3. Whether they want something funny or something more serious.

Using this information, recommend exactly 1 movie or TV Show that best match their taste, preferences, and desired tone.

STRICT OUTPUT RULES:
- Respond with ONLY the movie or TV Show titles, nothing else.
- Output exactly 1 title.
- Do not include numbering, bullet points, dashes, or any symbols.
- Do not include release years, explanations, descriptions, greetings, or any additional text.
- Do not repeat the movie the user mentioned as their favorite.
- Do not include any text before or after the list of titles.
- Use the official, original movie title as it would appear in a movie database (this is critical, since the output will be used to query the TMDB API directly).
- If a title is ambiguous (e.g., same name used for multiple movies), prefer the most well-known / highest-rated version.
- Every title MUST BE in Romanian!!

Example of a valid response:
Inception
The Grand Budapest Hotel
Parasite
La La Land
Whiplash

Any deviation from this format is not acceptable, as the output is parsed programmatically.`
            }
        ]
        messages.push(
            {
                role: "user",
                content: `
1. Their favorite movie, and why they like it: ${data.favMovie}
2. Whether they prefer newer releases or more classic movies: ${data.favReleaseDate}
3. Whether they want something funny or something more serious: ${data.genreMovie}
                `
            }
        )

        try {
            const response = await openai.chat.completions.create({
                model: "gpt-4.1-nano",
                messages,
            })

            return response.choices[0].message.content
        } catch (e) {
            console.error(`There was an error with the OpenAI response: ${e}`);
        }
    }

    async function handleSubmit() {
        setIsLoading(true);
        const suggestion = await getSuggestions();

        try {
            const tmdbResponse = await tmdb(suggestion);

            setMovieData(tmdbResponse[0]);
            setIsLoading(false);
        } catch (e) {
            console.error(`There was an error getting suggestions: ${e}`);
        } finally {
            setIsLoading(false);
        }
    }

    function reset() {
        setIsLoading(false);
        setMovieData({});
        setData({
            favMovie: '',
            favReleaseDate: '',
            genreMovie: '',
        });
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView style={styles.container}>
                <View style={styles.content}>
                    { isLoading ? (
                        <Loading />
                    ) : movieData?.id ? (
                        <Suggestion data={movieData} reset={reset} />
                    ) : (
                        <Form data={data} setData={setData} handleSubmit={handleSubmit} />
                    )}
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
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
        flex: 1
    }
})