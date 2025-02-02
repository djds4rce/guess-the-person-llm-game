import '../global.css'
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import Head from 'next/head'
config.autoAddCss = false;


export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>AI Charades, the AI guessing game</title>
        <meta name="description" content="Unmask the mystery! Play 'Guess the Personality,' an AI-powered guessing game. Interrogate a famous persona, uncover clues, and deduce their secret identity."></meta>
        <meta name="keywords" content="guessing game, AI game, personality quiz, celebrity guessing, mystery game, detective game, online game, puzzle game, brain teaser, word game, chat game, fun game, free game, mobile game, party game"></meta>
        <meta name="robots" content="index, follow"/>
        <meta property="og:title" content="AI Charades, the AI guessing game"/>
        <meta property="og:description" content="Unmask the mystery! Play 'Guess the Personality,' an AI-powered guessing game. Interrogate a famous persona, uncover clues, and deduce their secret identity."></meta>
        <meta property="og:image" content="/images/aicharades.jpg"/>
        <meta property="og:url" content="https://aicharades.in/"/>
        <meta name="twitter:title" content="AI Charades, the AI guessing game"/>
        <meta name="twitter:description" content="Unmask the mystery! Play 'Guess the Personality,' an AI-powered guessing game. Interrogate a famous persona, uncover clues, and deduce their secret identity."/>
        <meta name="twitter:image" content="/images/aicharades.jpg"/>
        <meta name="twitter:card" content="summary_large_image"/>

        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <Component {...pageProps} />
    </>);
}
