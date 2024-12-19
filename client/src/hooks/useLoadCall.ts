import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useEffect } from "react";
import { useState } from "react";

export const useLoadCall = (id: string) => {
    const client = useStreamVideoClient();

    const [call, setCall] = useState<Call>();
    const [callloading, setCallLoading] = useState(true);
    useEffect(() => {
        const loadCall = async () => {
            setCallLoading(true);
            if (!client) return;
            const { calls } = await client.queryCalls({
                filter_conditions: { id }
            })
            if (calls.length > 0) {
                const call = calls[0];
                await call.get();
                setCall(call);
            }
            setCallLoading(false);
        }
        loadCall();
    }, [client, id]);
    return { call, callloading };
}
