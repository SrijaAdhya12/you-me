import { Mic, Webcam } from "lucide-react"

export default function PermissionPrompt() {
	return <div className="flex flex-col items-center gap-6">
        <div className="flex items-center gap-3">
            <Webcam size={40} />
            <Mic size={40} />
        </div>
        <p className="text-center">Please allow microphone and camera access to continue</p>
	</div>
}