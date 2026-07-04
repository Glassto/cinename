import { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Text } from 'react-native';
import Form from "@/components/Form";
import Loading from "@/components/Loading";
import Suggestion from "@/components/Suggestion";
import { openai, tmdb } from "@/config";

const Main = () => {
    const [data, setData] = useState({
        favMovie: '',
        favReleaseDate: '',
        genreMovie: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [movieData, setMovieData] = useState(null);
    const [error, setError] = useState(null);

    async function getSuggestion() {
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
- Respond with ONLY the movie or TV Show title, nothing else.
- Output exactly 1 title.
- Do not include numbering, bullet points, dashes, or any symbols.
- Do not include release years, explanations, descriptions, greetings, or any additional text.
- Do not repeat the movie the user mentioned as their favorite.
- Do not include any text before or after the title.
- Use the official, original movie title as it would appear in a movie database (this is critical, since the output will be used to query the TMDB API directly).
- If a title is ambiguous (e.g., same name used for multiple movies), prefer the most well-known / highest-rated version.
- Always use the English title as listed on TMDB (the "title" field, not "original_title").
- If no official English title exists, use the most widely recognized international title.
- YOU CAN SUGGEST ONLY 1 TITLE!!

Example of a valid response:
Inception`
            },
            {
                role: "user",
                content: `
1. Their favorite movie, and why they like it: ${data.favMovie}
2. Whether they prefer newer releases or more classic movies: ${data.favReleaseDate}
3. Whether they want something funny or something more serious: ${data.genreMovie}
                `
            }
        ];

        const response = await openai.chat.completions.create({
            model: "gpt-4.1-nano",
            messages,
        });

        const title = response.choices?.[0]?.message?.content?.trim();
        if (!title) {
            throw new Error("No suggestion returned from OpenAI");
        }
        return title;
    }

    async function handleSubmit() {
        setIsLoading(true);
        setError(null);

        try {
            const title = await getSuggestion();
            const results = await tmdb(title);

            const movie = results?.[0];

            if (!movie?.id) {
                throw new Error(`No TMDB result found for "${title}"`);
            }

            setMovieData(movie);
        } catch (e) {
            console.error(e);
            setError("Nu am putut genera o recomandare. Încearcă din nou.");
        } finally {
            setIsLoading(false);
        }
    }

    function reset() {
        setIsLoading(false);
        setMovieData(null);
        setError(null);
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
            <View style={styles.container}>
                {isLoading ? (
                    <Loading />
                ) : movieData?.id ? (
                    <Suggestion data={movieData} reset={reset} />
                ) : (
                    <>
                        {error ? <Text style={styles.error}>{error}</Text> : null}
                        <Form data={data} setData={setData} handleSubmit={handleSubmit} />
                    </>
                )}
            </View>
        </KeyboardAvoidingView>
    );
};

export default Main;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1d2838',
        height: '100%',
        borderTopLeftRadius: 60,
    },
    error: {
        color: '#ff6b6b',
        fontSize: 12,
        fontFamily: 'Rubik_700Bold',
        textAlign: 'center',
        marginLeft: 40,
        // marginBottom: 12,
        paddingVertical: 8,
        paddingHorizontal: 8,
    },
});