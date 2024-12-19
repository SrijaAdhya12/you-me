import { useCall } from "@stream-io/video-react-sdk"

export const useStreamCall = () => {
    const call = useCall()
    if (!call) {
        throw new Error("Call not found")
    }
    return call
}
