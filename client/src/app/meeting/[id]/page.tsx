import { Metadata } from "next"
import MeetingPage from "./MeetingPage"



interface PageProps {
	params: {
		id: string
	}
}

// export const generateMetadata = async ({ params: { id } }: PageProps): Promise<Metadata> => {
// 	return {
// 		title: `Meeting ${id}`
// 	}
// }

const Page = ({ params: { id } }: PageProps) => {
	return <MeetingPage id={id} />  
}

export default Page
