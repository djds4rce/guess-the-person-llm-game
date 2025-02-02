import { Html, Head, Main, NextScript } from 'next/document'
import { GoogleTagManager } from '@next/third-parties/google'

 
export default function Document() {
  return (
    <Html>
      <Head />
      <body>
        <GoogleTagManager gtmId="G-YJWRWJPWK4" />
        <Main />
        <NextScript />
        
      </body>
    </Html>
  )
}