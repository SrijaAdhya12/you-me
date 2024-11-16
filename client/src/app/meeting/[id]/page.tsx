import { Metadata } from 'next'
import MeetingPage from './MeetingPage'

type PageProps = {
	params: Promise<{ id: string }> & { id: string }
	searchParams?: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
	const { id } = await props.params
	return {
		title: `Meeting ${id}`
	}
}

export default async function Page(props: PageProps) {
	const { id } = await props.params
	return <MeetingPage id={id} />
}
