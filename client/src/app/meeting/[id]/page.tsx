import { Metadata } from 'next'
import MeetingPage from './MeetingPage'

type SearchParams = { [key: string]: string | string[] | undefined }

interface Props {
	params: { id: string }
	searchParams: SearchParams
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	return {
		title: `Meeting ${params.id}`
	}
}

export default function Page({ params }: Props) {
	return <MeetingPage id={params.id} />
}
