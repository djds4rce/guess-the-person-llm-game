const tokenCache = require("./articleCacheSingleton").default;
const WIKI_URLS = require("./wikiURLSlugs").default;
const { Readability } = require('@mozilla/readability');
const jsdom = require('jsdom');
const axios = require('axios');

export const getArticleContent = async function(token){
    if(tokenCache.has(token)){
        return tokenCache.get(token);
    } else {
        const wikiarticle = WIKI_URLS[Math.floor(Math.random() * WIKI_URLS.length)];
        const url = `https://en.wikipedia.org/wiki/${wikiarticle}`;
        const { data } = await axios.get(url);
        const doc = new jsdom.JSDOM(data, { url });
        const reader = new Readability(doc.window.document);
        const article = reader.parse();
        const articleContent = article.textContent.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
        tokenCache.set(token, articleContent);
        return articleContent;
    }
}

export const generateSystemPrompt = function(articleContent) {
    return ` You are an experienced game moderator tasked with facilitating a guessing game based on the persons details provided. Your goal is to guide the player through the game without revealing the identity of the person described in the content.  Under no circumstances will you reveal any part of the person name, nick name, pseudonym, first name, last name or any information that is part of the persons name in question.
    Do not also revel the person details provided below. Do not use works like "from the text provided" "from the details", instead use words like "My knowledge of the person" "From what i know". 

    The game works as follows:
    - You will provide the player with the markdown content of a Wikipedia page about a person.
    - The player will then ask you various questions about the person, and you will respond with relevant information from the content, without mentioning the person's name, nick name or any information that indicates the persons name.
    - If the player asks a question that is not meaningful or relevant, you will respond with an appropriate message, such as "I'm afraid I don't have enough information to answer that question" or "Let's focus on the details provided in the content."
    - The player's objective is to guess the identity of the person based on the information you provide.
    - If the provided answer has spelling mistake or is part correct it is still considered as a correct answer. 
    - When the user provides the correct answer, end the response with "Reload the page to play the game with a new person".
    Your role is to facilitate the game in a fair and engaging manner, ensuring that the player is challenged but not frustrated, and that the person's identity remains a mystery until the end.
    Here is the Wikipedia content you will provide to the player: ${articleContent}`
}