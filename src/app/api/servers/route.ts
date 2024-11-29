import { MemberRole} from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import {v4 as uuidv4} from 'uuid';

import { db } from "@/lib/db";
import { CurrentProfile } from "@/lib/current-profile";

export async function POST(req: NextRequest){
    try{
        const {name,imageUrl} = await req.json();
        const profile = await CurrentProfile();
        if(!profile){
            return new NextResponse("Unauthorized", {status: 401});
        }
        const server=await db.server.create({
            data:{
                profileId:profile.id,
                name: name,
                imageUrl : imageUrl,
                inviteCode:uuidv4(),
                channels: {
                    create: [
                        {name: "general",profileId:profile.id},
                    ]
                },
                members: {
                    create: [
                        {profileId:profile.id,role: MemberRole.ADMIN},
                    ]
                },
                }
            },
        );
        return NextResponse.json(server);
    }catch(e){
        console.log("SERVERS_POST ",e);
        return new NextResponse("Internal Server Error", {status: 500});
    }
} 