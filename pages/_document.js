import { Html, Head, Main, NextScript } from 'next/document'
import { GoogleTagManager } from '@next/third-parties/google'


export default function Document() {
    return (
        <Html>
            <Head />
            <body className='testing-analytics'>
                <GoogleTagManager gtmId="G-YJWRWJPWK4" />
                <Main />
                <script async src="https://www.googletagmanager.com/gtag/js?id=G-YJWRWJPWK4" />
                <script
            dangerouslySetInnerHTML={{
              __html: `
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','G-25EEJ4XQ6T');
              `,
            }}
          />
                <NextScript />

            </body>
        </Html>
    )
}
