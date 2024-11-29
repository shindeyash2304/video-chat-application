import { NextRequest, NextResponse } from "next/server";

import { CurrentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";


export async function PATCH(req: NextRequest,{params}: {params: {memberId: string}}){
    try{
        const profile= await CurrentProfile();
        if(!profile){
            return new NextResponse("Unauthorized", {status: 401});
        }
        const {searchParams} = new URL(req.url);
        const {role}=await req.json();
        const serverId= searchParams.get("serverId");

        if(!serverId){
            return new NextResponse("Server Id Missing", {status: 400});
        }

        if(!params.memberId){
            return new NextResponse("Member Id Missing", {status: 400});
        }

        const server = await db.server.update({
            where:{
                id: serverId,
                profileId: profile.id
            },
            data: {
                members: {
                    update: {
                        where:{
                            id: params.memberId,
                            profileId: {
                                not: profile.id
                            }
                        },
                        data: {
                            role
                        }
                    }
                }
            },
            include: {
                members: {
                    include: {
                        profile: true
                    },
                    orderBy: {
                        role: "asc"
                    }
                }
            }
        })
        return NextResponse.json(server);
    }
    catch(e){
        console.log("[MEMBER_ID_PATCH]",e);
        return new NextResponse("Internal Error", {status: 500})
    }
}

export async function DELETE(req: NextRequest,{params}: {params: {memberId: string}}){
    try{

        const profile = await CurrentProfile();
        if(!profile) return new NextResponse("Unauthorized",{status: 401});

        const {searchParams} = new URL(req.url);
        const serverId= searchParams.get("serverId");

        if(!serverId){
            return new NextResponse("Server Id Missing", {status: 400});
        }

        if(!params.memberId){
            return new NextResponse("Member Id Missing", {status: 400});
        }

        const server = await db.server.update({
            where:{
                id: serverId,
                profileId: profile.id
            },
            data: {
                members: {
                    delete: {
                        id: params.memberId,
                        profileId: {
                            not: profile.id
                        }
                    }
                }
            },
            include: {
                members: {
                    include: {
                        profile: true
                    },
                    orderBy: {
                        role: "asc"
                    }
                }
            }
        })
        return NextResponse.json(server);
    }
    catch(e){
        console.log("[MEMBER_ID_DELETE]",e);
        return new NextResponse("Internal Error", {status: 500})
    }
}