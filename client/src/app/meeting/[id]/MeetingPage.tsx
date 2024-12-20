'use client'
import { useEffect, useState } from 'react'
import {
	Call,
	CallControls,
	CallingState,
	DeviceSettings,
	SpeakerLayout,
	StreamCall,
	StreamTheme,
	useCall,
	useCallStateHooks,
	useStreamVideoClient,
	VideoPreview
} from '@stream-io/video-react-sdk'
import { Loader2, Upload } from 'lucide-react'
import { useLoadCall } from '@/hooks/useLoadCall'
import { useUser } from '@clerk/nextjs'
import Link from 'next/link'
import { useStreamCall } from '@/hooks/useStreamCall'
import Button, { buttonClassName } from '@/components/Button'
import PermissionPrompt from '@/components/PernissionPrompt'
import { AudioVolumeIndicator, FlexibleCallLayout, RecordingList } from '@/components'
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
	const call = useStreamCall()
	const { useCallEndedAt, useCallStartsAt } = useCallStateHooks()
	const callEndedAt = useCallEndedAt()
	const callStartsAt = useCallStartsAt()
	const [setupComplete, setSetupComplete] = useState(false)
	const handleSetupComplete = async () => {
		call.join()
		setSetupComplete(true)
	}
	const callIsInFuture = callStartsAt && new Date(callStartsAt) > new Date()
	const callHasEnded = !!callEndedAt
	if (callHasEnded) {
		return <MeetingEndedScreen />
	}
	if (callIsInFuture) {
		return <UpcomingMeetingScreen />
	}
	const description = call.state.custom.description
	return (
		<div className="space-y-6">
			{description && (
				<p className="text-center">
					Meeting description: <span className="font-bold">{description}</span>
				</p>
			)}
			{setupComplete ? <CallUI /> : <SetupUI onSetupComplete={handleSetupComplete} />}
		</div>
	)
}

interface SetupUIProps {
	onSetupComplete: () => void
}

const SetupUI = ({ onSetupComplete }: SetupUIProps) => {
	const call = useStreamCall()
	const { useMicrophoneState, useCameraState } = useCallStateHooks()
	const micState = useMicrophoneState()
	const camState = useCameraState()
	const [micCamDisabled, setMicCamDisabled] = useState(false)
	useEffect(() => {
		if (micCamDisabled) {
			call.camera.disable()
			call.microphone.disable()
		} else {
			call.camera.enable()
			call.microphone.enable()
		}
	}, [micCamDisabled, call])

	if (!micState.hasBrowserPermission || !camState.hasBrowserPermission) {
		return <PermissionPrompt />
	}
	return (
		<div className="flex flex-col items-center gap-3">
			<h1 className="text-center text-2xl font-bold">Setup</h1>
			<VideoPreview />
			<div className="flex h-16 items-center justify-center">
				<AudioVolumeIndicator />
				<DeviceSettings />
			</div>
			<label className="flex items-center gap-2 font-medium">
				<input type="checkbox" checked={micCamDisabled} onChange={(e) => setMicCamDisabled(e.target.checked)} />
				Join with mic and camera off
			</label>
			<Button onClick={onSetupComplete}>Start Meeting</Button>
		</div>
	)
}

const CallUI = () => {
	const { useCallCallingState } = useCallStateHooks()
	const callingState = useCallCallingState()
	if (callingState !== CallingState.JOINED) {
		return <Loader2 className="mx-auto animate-spin" />
	}
	return <FlexibleCallLayout />
}

const UpcomingMeetingScreen = () => {
	const call = useStreamCall()
	return (
		<div className="flex flex-col items-center gap-6">
			<p>
				Meeting starts in <span className="text-2xl font-bold">{call.state.startsAt?.toLocaleString()}</span>
			</p>
			{call.state.custom.description && (
				<p>
					Description: <span className="font-bold">{call.state.custom.description}</span>
				</p>
			)}
			<Link href="/" className={buttonClassName}>
				Go Home
			</Link>
		</div>
	)
}

const MeetingEndedScreen = () => {
	return (
		<div className="flex flex-col items-center gap-6">
			<p className="font-bold">This Meeting has Ended</p>
			<Link href="/" className={buttonClassName}>
				Go Home
			</Link>
			<div className="space-y-3">
				<h2 className='text-center text-xl font-bold'>
					Recordings
				</h2>
				<RecordingList />
			</div>
		</div>
	)
}
