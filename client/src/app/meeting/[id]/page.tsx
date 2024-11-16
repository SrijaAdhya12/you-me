import { Metadata } from 'next'
import MeetingPage from './MeetingPage'

type Props = {
	params: {
		id: string
	}
	searchParams: Record<string, string | string[] | undefined>
}

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
	return {
		title: `Meeting ${params.id}`
	}
}

export default function Page({ params }: Props) {
	return <MeetingPage id={params.id} />
}
