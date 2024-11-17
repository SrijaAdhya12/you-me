import { cn } from '@/libs/utils'

const Button = ({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
	return (
		<button
			className={cn(
				'flex w-full items-center justify-center gap-2 rounded-md bg-blue-500 px-3 py-2 font-semibold text-white transition-colors hover:bg-blue-600 active:bg-blue-600 disabled:bg-blue-300',
				className
			)}
			{...props}
		/>
	)
}

export default Button
