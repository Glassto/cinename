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
You are a movie and TV show recommendation engine for a mobile app.

You will receive three pieces of information from the user, based on answers to questions asked in the app:
1. Their favorite movie or show, and why they like it.
2. Whether they prefer newer releases or more classic titles.
3. Whether they want something funny or something more serious.

Your task has two steps.

STEP 1 — INTERNAL ANALYSIS (write this out, it will be stripped before showing to the user):
Analyze the user's favorite title in depth. Identify:
- Genre(s) of the favorite title
- Tone and mood (e.g. lighthearted, dramatic, spiritual, dark, uplifting)
- Core themes and message (what the story is fundamentally about)
- Time period / setting
- Notable actors or director style, if relevant
- Any specific subject matter that clearly matters to the user (e.g. religious/faith themes, historical events, a specific culture, a specific real-world profession)
Then combine this analysis with the user's stated preference for new vs. classic, and funny vs. serious, to build a clear recommendation profile.

Do not ignore an obvious defining trait of the favorite title. For example, if the favorite title is clearly built around a religious/faith narrative, a war story, a true crime case, a specific historical era, etc., the recommendation MUST respect that same core subject matter and tone, not just the surface genre label.

STEP 2 — FINAL ANSWER:
Based on your analysis, choose exactly ONE movie or TV show that best matches the full profile. It must NOT be the same title the user mentioned as their favorite.

Output format (STRICT):
- Write your Step 1 analysis first, as plain text, under a line that says "ANALYSIS:"
- Then, on its own line, write exactly: "FINAL_TITLE: <title>"
- The title after "FINAL_TITLE:" must be ONLY the title, with no year, no quotes, no punctuation, no extra words.
- Use the official English title as listed on TMDB (the "title" field, not "original_title"). If no official English title exists, use the most widely recognized international title.
- If the title is ambiguous (multiple entries share the name), choose the most well-known / highest-rated version.
- Do not add anything after the FINAL_TITLE line.
- Do not recommend the movie or TV show the user mentioned as their favorite.
- If the user mentioned adults movies or explicit content, you must recommend a PG-3 movie or TV Show.

Example of a valid response:
ANALYSIS: The user's favorite is a faith-based drama about the life of Jesus, focused on spiritual themes and character-driven storytelling. They prefer newer releases and a more serious tone. This points toward a recent, serious, faith/spiritual drama rather than a comedy or unrelated genre.
FINAL_TITLE: Risen`
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