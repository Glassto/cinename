import OpenAI from 'openai';
import { createClient } from "@supabase/supabase-js";
import {moviesData} from "@/data/movies";

/** OpenAI config */
if (!process.env.EXPO_PUBLIC_OPENAI_API_KEY) throw new Error("OpenAI API key is missing or invalid.");
export const openai = new OpenAI({
    apiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
});

/** Supabase config */
const privateKey = process.env.EXPO_PUBLIC_SUPABASE_API_KEY;
if (!privateKey) throw new Error(`Expected env var SUPABASE_API_KEY`);
const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
if (!url) throw new Error(`Expected env var SUPABASE_URL`);
export const supabase = createClient(url, privateKey);

/** TMDB config */
const apiKey = process.env.EXPO_PUBLIC_TMDB_API_KEY;
if(!apiKey) throw new Error(`Expected env var TMDB_API_KEY`);
const baseUrl = 'https://api.themoviedb.org/3'
const endpoint = ''
export const tmdb = async (query) => {
    const url = `${baseUrl}/search/multi?api_key=${apiKey}&query=${encodeURIComponent(query)}`
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const results = data.results.filter(item => item.media_type !== 'person');

        return results;
    } catch (e) {
        console.error("Fetch failed:", e.message);
    }
}

/** LangChain Splitter */
// async function splitText(data) {
//     const splitter = new RecursiveCharacterTextSplitter({
//         chunkSize: 200,
//         chunkOverlap: 26
//     })
//
//     const output = await splitter.createDocuments([data]);
//     console.log(output);
//     return output
// }

/** Vector database */
// async function createAndStoreEmbeddings() {
//     const chunkData = await splitText(moviesData);
//     const data = await Promise.all(
//         chunkData.map(async (chunk) => {
//             const embedding = await openai.embeddings.create({
//                 model: "text-embedding-ada-002",
//                 input: chunk.pageContent
//             })
//
//             return {
//                 content: chunk.pageContent,
//                 embedding: embedding.data[0].embedding
//             }
//         })
//     )
//     console.error("SUCCESS!!")
//     await supabase.from('movies').insert(data)
// }
