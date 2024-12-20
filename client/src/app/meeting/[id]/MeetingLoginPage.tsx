import { Button } from '@/components'
import { SignInButton } from '@clerk/nextjs'

const MeetingLoginPage = () => {
	return (
		<div className="mx-auto w-fit space-y-3">
			<h1 className="text-center text-2xl font-bold">Join Meeting</h1>
			<SignInButton>
				<Button className="w-44">Sign In</Button>
			</SignInButton>
		</div>
	)
}

export default MeetingLoginPage
