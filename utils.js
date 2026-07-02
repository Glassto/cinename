/** OpenAI embeddings response */
// const query = `1. ${data.favMovie},\n 2. ${data.favReleaseDate},\n 3. ${data.genreMovie}`;
// const match = await queryEmbedding(query)
// const chatMessages = [
//     {
//         role: "system",
//         content: "You are an enthusiastic movie expert who loves recommending films to people. You will receive context containing movie details (plot summaries, genres, directors, themes) AND the user's answers to three specific preference questions:\n1. Their favorite movie and why\n2. Whether they prefer newer releases or classic films\n3. Whether they want something funny or serious\n\nYour main job is to formulate a short, personalized movie recommendation using ONLY the provided context and the user's answers. \n\n### Critical Rules:\n- **Strict Context Adherence**: Base all recommendations strictly on the provided context. If you cannot find a suitable match in the context, say, \"Sorry, I don't know the answer.\" Do not make up movies or details.\n- **Personalization**: Use the user's three answers to match movies based on themes, pacing, visual style, and emotional tone found in the context.\n- **Conciseness**: Keep answers short and focused on the user's query.\n- **No Questions**: Do not ask the user any questions. Their preferences are already provided in the input.\n- **Uncertainty**: If the context lacks sufficient information to answer, explicitly state uncertainty rather than hallucinating details."
//     }
// ]
//
// chatMessages.push({
//     role: 'user',
//     content: `Context: ${match} - The answers for those 3 questions: ${query}`
// })
// const response = await openai.chat.completions.create({
//     model: "gpt-4.1-nano",
//     messages: chatMessages,
//     frequency_penalty: 0.5
// })

/** Query vector database */
// async function queryEmbedding(query) {
//         const embedding = await openai.embeddings.create({
//             model: "text-embedding-ada-002",
//             input: query,
//         })
//
//         const { data } = await supabase.rpc("match_movies", {
//             query_embedding: embedding.data[0].embedding,
//             match_threshold: 0.5,
//             match_count: 1,
//         })
//
//         return data[0].content
//     }