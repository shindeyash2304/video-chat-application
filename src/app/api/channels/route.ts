import {NextResponse,NextRequest} from 'next/server';
import { MemberRole } from '@prisma/client';

import { CurrentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';

export async function POST(req: NextRequest){
    try{
        const profile = await CurrentProfile();
        const {name,type} = await req.json();
        const {searchParams} = new URL(req.url);
        const serverId = searchParams.get("serverId");

        if(!profile){
            return new NextResponse("Unauthorized", {status: 401});
        }
        if(!serverId){
            return new NextResponse("Missing Server Id", {status: 400});
        }
        if(name==='general'){
            return new NextResponse("Channel Name cannot be 'general'", {status: 400});
        }

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
                    create: {
                        profileId: profile.id,
                        name,
                        type
                    }
                }
            },
        })

        return NextResponse.json(server);
    }
    catch(err){
        console.log("CHANNELS POST ERROR",err);
        return new NextResponse("Internal Server Error", {status: 500});
    }
}