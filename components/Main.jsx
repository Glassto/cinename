import { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, Text } from 'react-native';
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
You are a movie/TV recommendation engine for a mobile app.

You receive: 1) the user's favorite movie/show and why, 2) newer vs. classic preference, 3) funny vs. serious preference.

STEP 1 — ANALYSIS (internal, will be stripped before showing to the user):
Briefly identify the favorite title's genre, tone, core theme/message, setting, and any defining subject matter (e.g. faith, war, true crime, specific era/culture). Respect the defining trait, not just the surface genre — e.g. a faith-based drama should get another faith-based drama, not just "any drama."
Combine this with the era and tone preferences to form a recommendation profile.

STEP 2 — FINAL ANSWER:
Pick exactly ONE movie or TV show matching the profile. Never the same as the favorite. If the favorite is adult/explicit content, recommend a PG-13 title instead.

OUTPUT FORMAT (strict):
ANALYSIS: <2-3 sentence analysis>
FINAL_TITLE: <title only — no year, quotes, or punctuation>

Use the official English TMDB "title" field (not "original_title"); if none exists, use the most recognized international title. If ambiguous, pick the most well-known/highest-rated version. Nothing after FINAL_TITLE.

Example:
ANALYSIS: Favorite is a faith-based drama about Jesus's life, spiritual and character-driven. User wants newer, serious titles.
FINAL_TITLE: Risen`
            },
            {
                role: "user",
                content: `
1. Their favorite movie, and why they like it: ${data.favMovie}; \n
2. Whether they prefer newer releases or more classic movies: ${data.favReleaseDate}; \n
3. Whether they want something funny or something more serious: ${data.genreMovie}; \n
                `
            }
        ];

        const response = await openai.chat.completions.create({
            model: "gpt-4.1-nano",
            messages,
        });

        const raw = response.choices?.[0]?.message?.content?.trim();
        if (!raw) {
            throw new Error("No suggestion returned from OpenAI");
        }

        const title = extractFinalTitle(raw);
        if (!title) {
            throw new Error(`Could not parse FINAL_TITLE from response: ${raw}`);
        }

        return title;
    }

    function extractFinalTitle(raw) {
        // Match "FINAL_TITLE:" followed by the rest of that line
        const match = raw.match(/FINAL_TITLE:\s*(.+)/i);
        if (!match) return null;

        let title = match[1].trim();

        title = title
            .replace(/^["'“”]+|["'“”]+$/g, "") // strip leading/trailing quotes
            .replace(/\.$/, "")                 // strip trailing period
            .replace(/\*\*/g, "")               // strip stray markdown bold
            .trim();

        return title || null;
    }

    async function handleSubmit() {
        if (!data.favMovie || !data.favReleaseDate || !data.genreMovie) {
            setError("Pentru a căuta, răspunde la fiecare întrebare!");
            return
        }

        setIsLoading(true);
        setError(null);


        try {
            const title = await getSuggestion();
            const results = await tmdb(title);

            const movie = results?.[0];

            if (!movie?.id) {
                setError("Nu am putut găsi un film. Încearcă din nou.");
                throw new Error(`No TMDB result found for "${title}"`);
            }

            // console.error(movie)
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
            keyboardVerticalOffset={0}
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