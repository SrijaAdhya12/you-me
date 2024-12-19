'use client'
import { useState } from 'react'
import {
	Call,
	CallControls,
	SpeakerLayout,
	StreamCall,
	StreamTheme,
	useCall,
	useCallStateHooks,
	useStreamVideoClient
} from '@stream-io/video-react-sdk'
import { Loader2, Upload } from 'lucide-react'
import { useLoadCall } from '@/hooks/useLoadCall'
import { useUser } from '@clerk/nextjs'
import Link from 'next/link'
import { useStreamCall } from '@/hooks/useStreamCall'
import { buttonClassName } from '@/components/Button'
interface MeetingPageProps {
	id: string
}

const MeetingPage = ({ id }: MeetingPageProps) => {
	const { user, isLoaded: userLoaded } = useUser()
	const { call, callloading } = useLoadCall(id)
	if (!userLoaded || callloading) {
		return <Loader2 className="mx-auto animate-spin" />
	}
	if (!call) {
		return <p className="text-center font-bold">call not found</p>
	}

	const notAllowedToJoin =
		call.type === 'private-meeting' && (!user || !call.state.members.find((m) => m.user_id === user.id))

	if (notAllowedToJoin) {
		return <p className="text-center font-bold">You are not allowed to join this meeting</p>
	}

	return (
		<StreamCall call={call}>
			<StreamTheme>
				<MeetingScreen />
			</StreamTheme>
		</StreamCall>
	)
}

export default MeetingPage

const MeetingScreen = () => {
	const { useCallEndedAt, useCallStartsAt } = useCallStateHooks()
	const callEndedAt = useCallEndedAt()
	const callStartsAt = useCallStartsAt()
	const callIsInFuture = callStartsAt && new Date(callStartsAt) > new Date()
	const callHasEnded = !!callEndedAt
	if (callHasEnded) {
		return <MeetingEndedScreen />
	}
	if (callIsInFuture) {
		return <UpcomingMeetingScreen />
	}
	return <div>call ui</div>
}

interface SetupUIProps {
	onSetupComplete: () => void
}

const SetupUI = ({ onSetupComplete }: SetupUIProps) => {
}
const UpcomingMeetingScreen = () => {
	const call = useStreamCall()
	return (
		<div className="flex flex-col items-center gap-6">
		<p>
		Meeting starts in <span className="font-bold text-2xl">
		{call.state.startsAt?.toLocaleString()}
		</span>
	</p>
			{call.state.custom.description && <p>
				Description: {" "}
				<span className="font-bold">
					{call.state.custom.description}
				</span>
			</p>}
		<Link href="/" className={buttonClassName}>	
			Go Home
		</Link>
	</div>)
}

const MeetingEndedScreen = () => {
	return <div className="flex flex-col items-center gap-6">
		<p className="font-bold">Meeting Ended</p>
		<Link href="/" className={buttonClassName}>
			Go Home
		</Link>
	</div>
}
