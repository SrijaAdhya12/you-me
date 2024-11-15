'use client'
import { StreamVideo, StreamVideoClient, User } from '@stream-io/video-react-sdk'
import { useUser } from '@clerk/nextjs'
import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { nanoid } from 'nanoid'
import { getToken } from './actions'
interface ClientProviderProps {
	children: React.ReactNode
}

export default function ClientProvider({ children }: ClientProviderProps) {
	const videoClient = useInitializeVideoClient()
	if (!videoClient)
		return (
			<div className="flex h-screen items-center justify-center">
				<Loader2 className="mx-auto animate-spin" />
			</div>
		)
	return <StreamVideo client={videoClient}>{children}</StreamVideo>
}

const useInitializeVideoClient = () => {
	const { user, isLoaded: userLoaded } = useUser()
	const [videoClient, setVideoClient] = useState<StreamVideoClient | null>(null)
	useEffect(() => {
		if (!userLoaded || !user) return
		let streamUser: User
		if (user?.id) {
			streamUser = { id: user.id, name: user.username || user.id, image: user.imageUrl }
		} else {
			const id = nanoid()
			streamUser = {
				id,
				type: 'guest',
				name: `Guest ${id}`,
				image: ''
			}
		}
		const apiKey = process.env.NEXT_PUBLIC_STREAM_VIDEO_API_KEY
		if (!apiKey) throw new Error('Stream API key is not set')

		const client = new StreamVideoClient({
			apiKey,
			user: streamUser,
			tokenProvider: user?.id ? getToken : undefined
		})
		setVideoClient(client)
		return () => {
			client.disconnectUser()
			setVideoClient(null)
		}
	}, [user?.id, user?.username, user?.imageUrl, userLoaded])
	return videoClient
}
