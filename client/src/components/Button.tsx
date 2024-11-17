import { cn } from "@/libs/utils"

const Button = ({className, ...props}: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
    return (
        <button
        className={cn('flex items-center justify-center gap-2 rounded-md bg-blue-500 px-3 py-2 text-white font-semibold transition-colors hover:bg-blue-600 active:bg-blue-600 disabled:bg-blue-300 w-full', className)}    {...props} />
  )
}

export default Button