import { Metadata } from 'next'
import MyMeetingsPage from './MyMeetingsPage'

export const metadata: Metadata = {
	title: 'My Meetings'
}

const page = () => {
	return <MyMeetingsPage />
}

export default page
