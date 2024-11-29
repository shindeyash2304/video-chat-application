import { MemberRole } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import { CurrentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

export async function DELETE(req: NextRequest,{params}: {params: {channelId: string}}){
    try{
        const profile = await CurrentProfile();
        if(!profile) return new Response("Unauthorized",{status: 401});
        const {searchParams} = new URL(req.url) ;   
        const serverId= searchParams.get("serverId");
        if(!serverId) return new Response("Server Id Missing",{status: 400});
        if(!params.channelId) return new Response("Channel Id Missing",{status: 400});
        const server = await db.server.update({
            where: {
                id: serverId,
                members: {
                    some: {
                        profileId: profile.id,
                        role: {
                            in: [MemberRole.ADMIN, MemberRole.MODERATOR]   
                        }
                    }
                }
            },
            data: {
                channels: {
                    delete: {
                        id: params.channelId,
                        name: {
                            not: "general"
                        }
                    }
                }
            }
        
        })
        return NextResponse.json(server);
    }
    catch(e){
        console.log("[CHANNEL_ID_DELETE]",e);
        return new Response("Internal Error", {status: 500})
    }
}

export async function PATCH(req: NextRequest,{params}: {params: {channelId: string}}){
    try{
        const profile = await CurrentProfile();
        if(!profile) return new NextResponse("Unauthorized",{status: 401});
        const {searchParams} = new URL(req.url) ;   
        const serverId= searchParams.get("serverId");
        const {name,type}= await req.json();

        if(!serverId) return new NextResponse("Server Id Missing",{status: 400});
        
        if(!params.channelId) return new NextResponse("Channel Id Missing",{status: 400});
        
        if(name==='general') return new NextResponse("Cannot Rename 'general' Channel",{status: 400});
        
        const server = await db.server.update({
            where: {
                id: serverId,
                members: {
                    some: {
                        profileId: profile.id,
                        role: {
                            in: [MemberRole.ADMIN, MemberRole.MODERATOR]   
                        }
                    }
                }
            },
            data: {
                channels: {
                    update: {
                        where: {
                            id: params.channelId,
                            NOT: {
                                name: "general"
                            }
                        },
                        data: {
                            name: name,
                            type: type
                        }
                    }
                }
            }        
        })
        
        return NextResponse.json(server);
    }
    catch(e){
        console.log("[CHANNEL_ID_PATCH]",e);
        return new NextResponse("Internal Error", {status: 500})
    }
}