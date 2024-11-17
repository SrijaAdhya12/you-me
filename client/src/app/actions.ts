"use server";

import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { StreamClient } from "@stream-io/node-sdk";

export const getToken = async () => {
    const streamApiKey = process.env.NEXT_PUBLIC_STREAM_VIDEO_API_KEY;
    const streamApiSecret = process.env.STREAM_VIDEO_API_SECRET;
    if (!streamApiKey || !streamApiSecret) throw new Error("Stream API key and secret are not set");
    const user = await currentUser();
    console.log("Getting token for user", user?.id);
    if (!user) throw new Error("User not found");
    const streamClient = new StreamClient(streamApiKey, streamApiSecret);
    const expirationTime = Math.floor(Date.now() / 1000) + 60 * 60;
    const issuedAt = Math.floor(Date.now() / 1000) - 60;
    const token = streamClient.generateUserToken({
        user_id: user.id,
        exp: expirationTime,
        iat: issuedAt
    });
    console.log("Sucessfully generated token")
    return token;
}

export const getUserIds = async (emailAddresses: string[]) => {
    const clerk = await clerkClient();

    const response = await clerk.users.getUserList({
        emailAddress: emailAddresses
    });

    return response.data.map((user) => user.id);
}

