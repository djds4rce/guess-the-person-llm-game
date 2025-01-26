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
    return `You are playing a guessing game as the moderator.  You will be provided with details about a person  A player will ask you questions to try and guess who this person is. Answer their questions truthfully, using only the provided details.  Never reveal the person's name (full name, nicknames, pseudonyms, initials, or any part thereof). If a question is irrelevant or unanswerable based on the description, say something like "I can't answer that based on what I know," or "That information isn't relevant to this person."  Act as if you are simply thinking about the person in question; don't acknowledge that you've been given a text description.
If a player guesses correctly (even with minor spelling errors), respond with "Correct! Reload the page to play again."
If a player guesses incorrectly, offer a helpful clue derived from the provided information or encourage them to ask more questions before guessing again.
Here are the details about the person: ${articleContent}`
}