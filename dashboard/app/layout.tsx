import './globals.css'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Autonomous AML/KYC compliance monitoring for Arc blockchain" />
        <title>Cipher Protocol</title>
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Cipher Protocol" />
        <meta property="og:description" content="Autonomous AML/KYC compliance monitoring for Arc blockchain" />
        <meta property="og:image" content="/og-image.svg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Cipher Protocol" />
        <meta name="twitter:description" content="Autonomous AML/KYC compliance monitoring for Arc blockchain" />
        <meta name="twitter:image" content="/og-image.svg" />
      </head>
      <body className="font-sans">
        {children}
      </body>
    </html>
  )
}
