import { createSoundDetector, Icon, useCallStateHooks } from "@stream-io/video-react-sdk"
import { flightRouterStateSchema } from "next/dist/server/app-render/types"
import { useEffect, useState } from "react"

const AudioVolumeIndicator = () => {
    const {useMicrophoneState} = useCallStateHooks()
    const { isEnabled, mediaStream } = useMicrophoneState()
    const [audioLevel, setAudioLevel] = useState(0)

    useEffect(() => {
        if (!isEnabled || !mediaStream) return
        const disposeSoundDetector = createSoundDetector(mediaStream, ({audioLevel: al}) => {
            setAudioLevel(al),
                {detectionFrequencyInMs: 80, destroyStreamOnStop: false}
        })
        return () => { disposeSoundDetector().catch(console.error) }
    }, [isEnabled, mediaStream])
    if (!isEnabled) return null
    return <div className="flex w-72 items-center gap-3 rounded-md bg-state-900 p-4">
        <Icon icon="mic"/>
    </div>
}

export default AudioVolumeIndicator