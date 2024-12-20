import { Metadata } from 'next'
import MeetingPage from './MeetingPage'
import { currentUser } from '@clerk/nextjs/server'
import MeetingLoginPage from './MeetingLoginPage'

type PageProps = {
	params: Promise<{ id: string }> & { id: string }
	searchParams: Promise<{ [key: string]: string | string[] | undefined }> & {
		[key: string]: string | string[] | undefined
	}
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
	const { id } = await props.params
	return {
		title: `Meeting ${id}`
	}
}

export default async function Page(props: PageProps) {
	const user = await currentUser()
	if (!user) {
		return <MeetingLoginPage />
	}
	const { id } = await props.params
	return <MeetingPage id={id} />
}
