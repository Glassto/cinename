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
