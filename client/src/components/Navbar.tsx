import { UserButton, SignedIn, SignedOut, SignInButton } from '@clerk/nextjs'
import Link from "next/link";

const Navbar = () => {
  return (
		<header className="shadow">
			<div className="mx-auto flex h-14 max-w-5xl items-center justify-between p-3 font-medium">
				<Link href="/">New Meeting</Link>
			  <SignedIn>
				  <div className="flex items-center gap-5">
					  <Link href="/new-meeting">Meeting</Link>
					<UserButton />
				  </div>
			  </SignedIn>
			  <SignedOut>
				  <SignInButton />
			  </SignedOut>
			</div>
		</header>
  )
}

export default Navbar