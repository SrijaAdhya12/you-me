'use client'
import { useUser } from '@clerk/nextjs'
import { Copy, Loader2 } from 'lucide-react'
import { Call, MemberRequest, useStreamVideoClient } from '@stream-io/video-react-sdk'
import { useState } from 'react'
import { getUserIds } from './actions'
import { Button } from '@/components'
import Link from 'next/link'

export const CreateMeeting = () => {
	const [descriptionInput, setDescriptionInput] = useState('')
	const [startTimeInput, setStartTimeInput] = useState('')
	const [participantInput, setParticipantInput] = useState('')
	const [call, setCall] = useState<Call>()
	const client = useStreamVideoClient()
	const { user } = useUser()
	const createMeeting = async () => {
		if (!client || !user) return
		try {
			const id = crypto.randomUUID()
			const callType = participantInput ? 'private-meeting' : 'default'
			const call = client.call(callType, id)
			const memberEmails = participantInput.split(',').map((email) => email.trim())
			const memberIds = await getUserIds(memberEmails)
			const members: MemberRequest[] = memberIds
				.map((id) => ({
					user_id: id,
					role: 'call_member'
				}))
				.concat({
					user_id: user.id,
					role: 'call_member'
				})
				.filter((v, i, a) => a.findIndex((v2) => v2.user_id === v.user_id) === i)
			const starts_at = new Date(startTimeInput || Date.now()).toISOString()
			await call.getOrCreate({
				data: {
					starts_at,
					members,
					custom: {
						description: descriptionInput
					}
				}
			})
			setCall(call)
		} catch (error) {
			console.error(error)
			alert('Something went wrong.Please try again.')
		}
	}
	if (!client || !user) {
		return <Loader2 className="mx-auto animate-spin" />
	}
	return (
		<div className="flex h-screen flex-col items-center space-y-6">
			<h1 className="text-center text-2xl font-bold">Welcome {user?.username}</h1>
			<div className="mx-auto w-80 space-y-6 rounded-md bg-slate-100 p-5">
				<h2 className="text-xl font-medium">Create a new Meeting</h2>
				<DescriptionInput value={descriptionInput} onChange={setDescriptionInput} />
				<StartTimeInput value={startTimeInput} onChange={setStartTimeInput} />
				<ParticipantInput value={participantInput} onChange={setParticipantInput} />
				<Button onClick={createMeeting} className="w-full">
					Create Meeting
				</Button>
			</div>
			{call && <MeetingLink call={call} />}
		</div>
	)
}

interface DescriptionInputProps {
	value: string
	onChange: (value: string) => void
}

const DescriptionInput = ({ value, onChange }: DescriptionInputProps) => {
	const [active, setActive] = useState(false)
	return (
		<div className="space-y-2">
			<div className="font-medium">Meeting info:</div>
			<label className="flex items-center gap-1.5">
				<input
					type="checkbox"
					checked={active}
					onChange={(e) => setActive(e.target.checked)}
					className="h-4 w-4"
				/>
				Add description
			</label>
			{active && (
				<label className="block space-y-1">
					<span className="font-medium">Description</span>
					<textarea
						value={value}
						onChange={(e) => onChange(e.target.value)}
						maxLength={500}
						className="w-full rounded-md border border-slate-300 p-2"
					/>
				</label>
			)}
		</div>
	)
}

interface StartTimeInputProps {
	value: string
	onChange: (value: string) => void
}

const StartTimeInput = ({ value, onChange }: StartTimeInputProps) => {
	const [active, setActive] = useState(false)
	const dateTimeLocalNow = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000)
		.toISOString()
		.slice(0, 16)
	return (
		<div className="space-y-2">
			<div className="font-medium">Meeting start:</div>
			<label className="flex items-center gap-1.5">
				<input
					type="radio"
					checked={!active}
					onChange={() => {
						setActive(false)
						onChange('')
					}}
				/>
				Start meeting immediately
			</label>
			<label className="flex items-center gap-1.5">
				<input
					type="radio"
					checked={active}
					onChange={() => {
						setActive(true)
						onChange(dateTimeLocalNow)
					}}
				/>
				Start meeting at date/time
			</label>
			{active && (
				<label className="block space-y-1">
					<span className="font-medium">Start time</span>
					<input
						type="datetime-local"
						value={value}
						onChange={(e) => onChange(e.target.value)}
						min={dateTimeLocalNow}
						className="w-full rounded-md border border-slate-300 p-2"
					/>
				</label>
			)}
		</div>
	)
}

interface ParticipantInput {
	value: string
	onChange: (value: string) => void
}

const ParticipantInput = ({ value, onChange }: ParticipantInput) => {
	const [active, setActive] = useState(false)
	return (
		<div className="space-y-2">
			<div className="font-medium">Participant:</div>
			<label className="flex items-center gap-1.5">
				<input
					type="radio"
					checked={!active}
					onChange={() => {
						setActive(false)
						onChange('')
					}}
				/>
				Everyone with link can join
			</label>
			<label className="flex items-center gap-1.5">
				<input
					type="radio"
					checked={active}
					onChange={() => {
						setActive(true)
					}}
				/>
				Private Meeting
			</label>
			{active && (
				<label className="block space-y-1">
					<span className="font-medium">Participant Email</span>
					<textarea
						value={value}
						onChange={(e) => onChange(e.target.value)}
						placeholder="Enter email addresses separated by commas"
						className="w-full rounded-md border border-slate-300 p-2"
					/>
				</label>
			)}
		</div>
	)
}

interface MeetingLinkProps {
	call: Call
}

const MeetingLink = ({ call }: MeetingLinkProps) => {
	const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${call.id}`
	return <div className="text-center flex flex-col items-center gap-3">
		<div className="flex items-center gap-3">
			<span>
				Invitation Link: {''}
				<Link className='font-medium' href={meetingLink} target="_blank">
					{meetingLink}
				</Link>
			</span>
			<button
				title="Copy Invitation Link"
				onClick={() => {
					navigator.clipboard.writeText(meetingLink)
					alert('Copied to clipboard')
				}}
			>
				<Copy className="h-4 w-4" />
			</button>
		</div>
		<a className="text-blue-500 hover:underline" href={getMailToLink(meetingLink, call.state.startsAt, call.state.custom.description)} target="_blank">
			Send Email Invitation
		</a>
	</div>
}

const getMailToLink = (meetingLink: string, startsAt?: Date, description?: string) => {
	const startDateFormatted = startsAt ? startsAt.toLocaleString("en-US", {
		dateStyle: "full",
		timeStyle: "short"
	}) : undefined

	const subject = "Join my meeting" + (startDateFormatted ? ` on ${startDateFormatted}` : "")
	const body = `Join my meeting at ${meetingLink}` + (startDateFormatted ? `\n\nThe meeting starts at ${startDateFormatted}` : "") +
		(description ? `\n\nDescription: ${description}` : "")
	return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}
