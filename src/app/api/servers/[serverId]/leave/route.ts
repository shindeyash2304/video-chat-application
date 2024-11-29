import { NextRequest, NextResponse } from "next/server";

import { CurrentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";


export async function PATCH(req: NextRequest,{params}: {params: {serverId: string}}) {
    try{
        const profile = await CurrentProfile();
        const serverId = params?.serverId;

        if(!profile){
            return new NextResponse("Not Authorized", {status: 401});
        }

        if(!serverId){
            return new NextResponse("Server Id Missing", {status: 400});
        }

        const server = await  db.server.update({
            where: {
                id: serverId,
                profileId: {
                    not: profile.id
                },
                members: {
                    some: {
                        profileId: profile.id
                    }
                }
            },
            data: {
                members: {
                    deleteMany: {
                        profileId: profile.id
                    }
                }
            }
        })
        return NextResponse.json(server);
    }
    catch(err){
        console.log(err);
        return new NextResponse("Internal Server Error", {status: 500});
    }
}
