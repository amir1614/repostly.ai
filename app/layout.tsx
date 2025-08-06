import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Repostly.ai - AI Repost Therapist',
  description: 'Analyze TikTok reposts with AI to understand what they reveal about someone emotionally and psychologically.',
  keywords: 'TikTok, repost analysis, AI, psychology, social media, personality',
  authors: [{ name: 'Repostly.ai' }],
  openGraph: {
    title: 'Repostly.ai - AI Repost Therapist',
    description: 'Analyze TikTok reposts with AI to understand what they reveal about someone emotionally and psychologically.',
    type: 'website',
    url: 'https://repostly.ai',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Repostly.ai - AI Repost Therapist',
    description: 'Analyze TikTok reposts with AI to understand what they reveal about someone emotionally and psychologically.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
