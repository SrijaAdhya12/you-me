"use client"

import useLoadRecordings from "@/hooks/useLoadRecordings"
import { useStreamCall } from "@/hooks/useStreamCall"
import { useUser } from "@clerk/nextjs"
import { Loader2 } from "lucide-react"
import Link from "next/link"

const RecordingList = () => {
    const call = useStreamCall()
    const { recordings, recordingsLoading } = useLoadRecordings(call)
    const { user, isLoaded: userLoaded } = useUser()
    if (userLoaded && !user) {
        return <p className="text-center">You must be logged in to view recordings</p>
    }
    if (recordingsLoading) return <Loader2 className="animate-spin" />
    return <div className="space-y-3 text-center">
        {recordings.length === 0 && <p>No recordings for this meeting</p>}
        <ul className="list-inside list-disc">
            {recordings
            .sort((a, b) => b.end_time.localeCompare(a.end_time))
                .map(recording => (
                    <li key={recording.url}>
                        <Link href={recording.url} target="_blank" className="hover:underline">
                            {new Date(recording.end_time).toLocaleString()}
                        </Link>
                </li>
            ))   
           }
        </ul>
        <p className="text-sm text-gray-500">
            Note: It can take upto 1 minutes before new recordings are available.
            <br />
            You can refresh the page to see the latest recordings.
        </p>
    </div>
}

export default RecordingList