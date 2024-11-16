import { Metadata } from 'next'
import MeetingPage from './MeetingPage'

import { ResolvingMetadata } from 'next'

type PageParams = {
	id: string
}

type Props = {
	params: PageParams
	searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
	return {
		title: `Meeting ${params.id}`
	}
}

export default async function Page({ params }: Props) {
	return <MeetingPage id={params.id} />
}
