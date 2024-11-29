import { NextRequest, NextResponse } from "next/server";

import {CurrentProfile} from "@/lib/current-profile";
import { db } from "@/lib/db";

export async function PATCH(req: NextRequest,{params}: {params: {serverId: string}}){
    const {name,imageUrl} = await req.json();
    try{
        const profile = await CurrentProfile();
        if(!profile) return new Response("Unauthorized",{status: 401});

        const server= await db.server.update({
            where: {
                id: params.serverId,
                profileId: profile.id
            },
            data: {
                name,
                imageUrl
            }
        });
        return NextResponse.json(server);
    }
    catch(e){
        console.log("[SERVER_ID_PATCH]",e);
        return new NextResponse("Internal Error", {status: 500})
    }

} ;

export async function DELETE(req: Request,{params}: {params: {serverId: string}}){
    try{
        const profile = await CurrentProfile();
        if(!profile) return new NextResponse("Unauthorized",{status: 401});
        if(!params.serverId) return new NextResponse("Server Id Missing",{status: 400});    
        const server = await db.server.delete({
            where: {
                id: params.serverId,
                profileId: profile.id
            }
        });
        return NextResponse.json(server);
    }
    catch(e){
        console.log("[SERVER_ID_DELETE]",e);
        return new NextResponse("Internal Error", {status: 500})
    }
}