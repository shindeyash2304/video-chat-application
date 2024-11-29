import { redirect } from "next/navigation";

import { CurrentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db";
import {ServerSidebar} from "@/components/server/ServerSidebar";


const ServerIdLayout = async ({children,params}: {children: React.ReactNode,params: {serverId: string}}) =>{
    const profile=await CurrentProfile()
    if(!profile){
        return redirect('/');
    }

    const server=await db.server.findFirst({
        where:{
            id: params.serverId,
            members:{
                some:{
                    profileId: profile.id
                }
            }
        },
        include:{
            members:{
                select:{
                    profileId:true
                }
            }
        }
    })
    if(!server){
        return redirect('/')
    }
    return (
    <div className=" h-full">
        <div className=" hidden md:flex h-full w-60 z-20 flex-col fixed inset-y-0">
            <ServerSidebar serverId={params.serverId}/>
        </div>
        <main className="h-full md:pl-60">
        {children}
        </main>
    </div>
    )
} 

export default ServerIdLayout