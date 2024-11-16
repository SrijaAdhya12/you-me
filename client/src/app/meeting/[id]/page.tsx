import { Metadata } from 'next'
import MeetingPage from './MeetingPage'

interface PageProps {
	params: {
		id: string
	}
}

export const generateMetadata = async ({ params }: PageProps): Promise<Metadata> => {
	return {
		title: `Meeting ${params.id}`
	}
}

const Page = ({ params }: PageProps) => {
	return <MeetingPage id={params.id} />
}

export default Page
