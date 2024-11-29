import { CurrentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { DirectMessage} from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const MESSAGES_BATCH=10;

export async function GET(req: NextRequest){
    try{
        const profile = await CurrentProfile();
        if(!profile){
            return new NextResponse("Unauthorized", {status: 401});
        }
        const {searchParams} = new URL(req.nextUrl);
        const cursor = searchParams.get("cursor");
        const conversationId = searchParams.get("conversationId");
        if(!conversationId){
            return new NextResponse("Conversation ID missing", {status: 400});
        }

        let messages : DirectMessage[] = [];
        if(cursor)
        {
            messages = await db.directMessage.findMany({
                take: MESSAGES_BATCH,
                skip: 1,
                cursor: {id: cursor},
                where: {
                    conversationId: conversationId
                },
                include: {
                    member: {
                        include: {
                            profile: true
                        }
                    }
                },
                orderBy: {
                    createdAt: "desc"
                }
            });
        }
        else
        {
            messages = await db.directMessage.findMany({
                take: MESSAGES_BATCH,
                where: {
                    conversationId: conversationId
                },
                include: {
                    member: {
                        include: {
                            profile: true
                        }
                    }
                },
                orderBy: {
                    createdAt: "desc"
                }
            });
        }

        let nextCursor = null;
        if(messages.length === MESSAGES_BATCH){
            nextCursor = messages[MESSAGES_BATCH-1].id;
        }

        return NextResponse.json({items: messages, nextCursor});
    }
    catch(err){
        console.log("DIRCET_MESSAGES_ERROR",err);
        return new NextResponse("Internal Server Error", {status: 500})
    }
}