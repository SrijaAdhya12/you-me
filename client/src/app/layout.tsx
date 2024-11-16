import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import '@stream-io/video-react-sdk/dist/css/styles.css'
import { ClerkProvider } from '@clerk/nextjs'
import { Navbar } from '../components'
import ClientProvider from './ClientProvider'
const geistSans = localFont({
	src: './fonts/GeistVF.woff',
	variable: '--font-geist-sans',
	weight: '100 900'
})
const geistMono = localFont({
	src: './fonts/GeistMonoVF.woff',
	variable: '--font-geist-mono',
	weight: '100 900'
})

export const metadata: Metadata = {
	title: 'You-Me',
	description: 'Video Calling App build with Next.js & Stream'
}

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<ClerkProvider>
			<html lang="en">
				<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
					<ClientProvider>
						<Navbar />
						<main className="mx-w-5xl mx-auto px-3 py-6">{children}</main>
					</ClientProvider>
				</body>
			</html>
		</ClerkProvider>
	)
}
