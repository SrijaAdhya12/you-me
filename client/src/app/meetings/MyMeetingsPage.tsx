'use client'

import { useUser } from '@clerk/nextjs'
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk'
import { useEffect, useState } from 'react'

const MyMeetingsPage = () => {
	const { user } = useUser()
	const client = useStreamVideoClient()
	const [call, setCalls] = useState<Call[]>()
	useEffect(() => {
		async function loadCalls() {
			if (!client || !user?.id) {
				return
			}
			const { calls } = await client.queryCalls({
				sort: [{ field: 'starts_at', direction: -1 }],
				filter_conditions: {
					starts_at: { $exists: true },
					$or: [{ created_by_user_id: user.id }, { members: { $in: [user.id] } }]
				}
			})
			setCalls(calls)
		}
		loadCalls()
	}, [client, user?.id])
	return (
		<div className="space-y-3">
			<h1 className="text-center text-2xl font-bold">My Meetings</h1>
		</div>
	)
}

export default MyMeetingsPage
