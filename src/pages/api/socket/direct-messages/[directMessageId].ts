import { MemberRole } from "@prisma/client";
import { NextApiRequest } from "next";

import { CurrentProfilePages } from "@/lib/current-profile-pages";
import { db } from "@/lib/db";


export default async function handler(req: NextApiRequest, res: NextApiResponseSocketIo) {
    if(req.method!=='PATCH' && req.method!=='DELETE')
    {
        return res.status(405).json({message: 'Method not allowed'});
    }
    try{
        const profile = await CurrentProfilePages(req);
        const {directMessageId,conversationId} = req.query;
        const {content,fileUrl} = req.body;
        if(!profile)
        {
            return res.status(401).json({message: 'Not authenticated'});
        }
        if(!conversationId)
        {
            return res.status(400).json({message: 'Conversation id is missing'});
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
        })
        const member = conversation?.memberOne.profileId === profile.id ? conversation.memberOne : conversation?.memberTwo;
        if(!member)
        {
            return res.status(404).json({message: 'Member not found'});
        }
        let directMessage = await db.directMessage.findFirst({
            where: {
                id: directMessageId as string,
                conversationId: conversationId as string
            },
            include: {
                member: {
                    include: {
                        profile: true
                    }
                }
            }
        });
        if(!directMessage || directMessage.deleted)
        {
            return res.status(404).json({message: 'Message not found'});
        }
        const isMessageOwner = directMessage.member.profileId === profile.id;
        const isAdmin= member.role === MemberRole.ADMIN;
        const isModerator = member.role === MemberRole.MODERATOR;
        const canModify = isMessageOwner || isAdmin || isModerator;
        if(!canModify)
        {
            return res.status(401).json({message: 'Not authorized'});
        }
        if(req.method === 'DELETE')
        {
            directMessage = await db.directMessage.update({
                where: {
                    id: directMessageId as string,
                },
                data: {
                    fileUrl: "",
                    content: "This message has been deleted.",
                    deleted: true,
                },
                include: {
                    member: {
                        include: {
                            profile: true
                        }
                    }
                }
            });
        }
        if(req.method === 'PATCH')
        {
            if(!isMessageOwner)
            {
                return res.status(401).json({message: 'Not authorized'});
            }
            directMessage = await db.directMessage.update({
                where: {
                    id: directMessageId as string,
                },
                data: {
                    content,
                },
                include: {
                    member: {
                        include: {
                            profile: true
                        }
                    }
                }
            });
        }

        const updateKey = `chat:${conversation?.id}:messages:update`;
        res?.socket?.server?.io?.emit(updateKey,directMessage);

        return res.status(200).json(directMessage);
    }
    catch(error)
    {
        console.error("MESSAGE_ID",error);
        return res.status(500).json({message: 'Internal server error'});
    }
}