import { Html, Head, Main, NextScript } from 'next/document'


export default function Document() {
    return (
        <Html>
            <Head />
            <body className='testing-analytics'>
                <Main />
                <script async src="https://www.googletagmanager.com/gtag/js?id=G-25EEJ4XQ6T" />
                <script
            dangerouslySetInnerHTML={{
              __html: `
                (function(w,d){
                    w.dataLayer = w.dataLayer || [];
                    function gtag(){w.dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', 'G-YJWRWJPWK4');
                })(window,document);
              `,
            }}
          />
                <NextScript />

            </body>
        </Html>
    )
}
