import { buttonClassName } from '@/components/Button'
import { cn } from '@/libs/utils'
import Link from 'next/link'

type PageProps = {
	params: Promise<{ id: string }> & { id: string }
	searchParams: Promise<{ [key: string]: string | string[] | undefined }> & {
		[key: string]: string | string[] | undefined
	}
}

export default async function Page(props: PageProps) {
	const { id } = await props.params 
	const searchParams = await props.searchParams 
	return (
		<div className="flex flex-col items-center gap-3">
			<p className="font-bold">You left the meeting</p>
			<Link href={`/meeting/${id}`} className={cn(buttonClassName, 'bg-gray-500 hover:bg-gray-600')}>
				Rejoin
			</Link>
		</div>
	)
}
