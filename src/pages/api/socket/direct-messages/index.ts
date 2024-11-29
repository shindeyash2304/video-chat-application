import { NextApiRequest } from "next";

import { CurrentProfilePages } from "@/lib/current-profile-pages";
import { db } from "@/lib/db";


export default async function handler(req: NextApiRequest, res: NextApiResponseSocketIo) {
    if(req.method !== 'POST')
    {
        res.status(405).json({message: 'Method not allowed'});
        return;
    }
    try {
        const profile = await CurrentProfilePages(req);
        const {content,fileUrl} = req.body;
        const {conversationId} = req.query;
        if(!profile)
        {
            return res.status(401).json({message: 'Not authenticated'});
        }

        if(!conversationId)
        {
            return res.status(401).json({message: 'Conversation id is missing'});
        }

        const conversation = await db.conversation.findFirst({
            where: {
                id: conversationId as string,
                OR: [
                    {memberOne: {profileId: profile.id}},
                    {memberTwo: {profileId: profile.id}}
                ]
            },
            include: {
                memberOne: {
                    include: {
                        profile: true
                    }
                },
                memberTwo: {
                    include: {
                        profile: true
                    }
                }
            }
        });

        if(!conversation)
        {
            return res.status(404).json({message: 'Conversation not found'});
        }

        const member= conversation?.memberOne?.profileId === profile.id ? conversation?.memberOne : conversation?.memberTwo;

        if(!member)
        {
            return res.status(404).json({message: 'Member Unauthorized'});
        }
        console.log(member.id,conversationId);
        
        const message = await  db.directMessage.create({
            data: {
                content: content as string,
                fileUrl: fileUrl? fileUrl : null,
                memberId: member.id as string || "",
                conversationId: conversationId as string,
            },
            include: {
                member: {
                    include: {
                        profile: true
                    }
                }
            }
    })
    console.log(message);
    

    const channelKey = `chat:${conversationId}:messages`;

    res?.socket?.server?.io?.emit(channelKey,message);
    return res.status(200).json(message);

    } catch (error) {
        console.log("[DIRECT_MESSAGES_POST]",error);
        return res.status(500).json({message: 'Internal server error'});
    }
}