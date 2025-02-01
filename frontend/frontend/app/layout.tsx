import { Metadata } from 'next';
import { Inter, Roboto } from 'next/font/google';
import '../styles/globals.css';

// ✅ Import Google Fonts
const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

const roboto = Roboto({
  variable: '--font-roboto',
  subsets: ['latin'],
  weight: ['400', '700'],
});

// ✅ Page Metadata
export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${roboto.variable}`} // ✅ Removed 'antialiased'
        style={{ fontFamily: 'var(--font-inter), var(--font-roboto)' }} // ✅ Apply fonts via inline styles
      >
        {children}
      </body>
    </html>
  );
}
