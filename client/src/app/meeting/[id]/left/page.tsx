import { buttonClassName } from "@/components/Button"
import { cn } from "@/libs/utils"
import Link from "next/link"

interface PageProps {
	params: {
		id: string
	}
}

const Page = ({ params: {id} }: PageProps) => {
    return <div className="flex flex-col items-center gap-3">
        <p className="font-bold">
            You left the meeting
        </p>
        <Link href={`/meeting/${id}`} className={cn(buttonClassName, "bg-gray-500 hover:bg-gray-600")}>Rejoin</Link>
    </div>
}

export default Page
