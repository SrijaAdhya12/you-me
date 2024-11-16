import { Metadata } from 'next'
import MeetingPage from './MeetingPage'

const Page = ({ params }: { params: { id: string } }) => {
	return <MeetingPage id={params.id} />
}

export const generateMetadata = async ({ params }: { params: { id: string } }): Promise<Metadata> => {
	return {
		title: `Meeting ${params.id}`
	}
}

export default Page
