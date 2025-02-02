import { GoogleTagManager } from '@next/third-parties/google'
 
export default function RootLayout({
  children,
}) {
  return (
    <html lang="en">
      <GoogleTagManager gtmId="G-YJWRWJPWK4" />
      <body className='testing-analytics'>{children}</body>
    </html>
  )
}