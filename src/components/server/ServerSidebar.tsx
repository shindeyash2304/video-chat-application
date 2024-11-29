import { redirect } from "next/navigation";
import { ChannelType, MemberRole } from "@prisma/client";

import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from "lucide-react";

import { CurrentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { ServerHeader } from "@/components/server/ServerHeader";
import { ScrollArea } from "@/components/ui/scroll-area";
import ServerSearch from "@/components/server/ServerSearch";
import { Separator } from "@/components/ui/separator";
import ServerSection from "@/components/server/ServerSection";
import ServerChannel from "@/components/server/ServerChannel";
import ServerMember from "@/components/server/ServerMember";

const IconMap={
    [ChannelType.TEXT]: <Hash className=" mr-2 h-4 w-4"/>,
    [ChannelType.AUDIO]: <Mic className="mr-2 h-4 w-4"/>,
    [ChannelType.VIDEO]: <Video className="mr-2 h-4 w-4"/>
}

const RoleIconMap={
    [MemberRole.GUEST]: null,
    [MemberRole.MODERATOR]: <ShieldCheck className="h-4 w-4 mr-2 text-indigo-500"/>,
    [MemberRole.ADMIN]: <ShieldAlert className="h-4 w-4 mr-2 text-rose-500"/>,
}

interface ServerSidebarProps {
    serverId: string;
}

const ServerSidebar = async ({serverId}: ServerSidebarProps) => {
    const profile = await CurrentProfile();
    if(!profile){
        return redirect('/');
    }

    const server=await db.server.findFirst({
        where:{
            id: serverId,
        },
        include:{
            channels:{
                orderBy: {
                    createdAt: 'asc'
                }
            },
            members: {
                include:{
                    profile: true
                },
                orderBy: {
                    createdAt: 'asc'
                }

            }
        }
    })

    if(!server){
        return redirect('/')
    }

    const textChannels = server ?.channels.filter(channel => channel.type === ChannelType.TEXT);
    const audioChannels = server ?.channels.filter(channel => channel.type === ChannelType.AUDIO);
    const videoChannels = server ?.channels.filter(channel => channel.type === ChannelType.VIDEO);
    const members= server ?.members.filter(member => member.profileId !== profile.id);
    // console.log(members);
    
    const role= server ?.members.find(member => member.profileId === profile.id)?.role;
  return (
    <div className="flex flex-col h-full text-primary w-full dark:bg-[#2b2d31] bg-[#f2f3f5]">
        <ServerHeader server={server} role={role?role:"GUEST"}/>
        <ScrollArea className=" flex-1 px-3">
            <div className=" mt-2">
                <ServerSearch data={[
                    {
                        label: "Text Channels",
                        type: "Channel",
                        data: textChannels?.map(channel => ({
                            id: channel.id,
                            name: channel.name,
                            Icon: IconMap[channel.type]
                        }))
                    },
                    {
                        label: "Audio Channels",
                        type: "Channel",
                        data: audioChannels?.map(channel => ({
                            id: channel.id,
                            name: channel.name,
                            Icon: IconMap[channel.type]
                        }))
                    },
                    {
                        label: "Video Channels",
                        type: "Channel",
                        data: videoChannels?.map(channel => ({
                            id: channel.id,
                            name: channel.name,
                            Icon: IconMap[channel.type]
                        }))
                    },
                    {
                        label: "Members",
                        type: "Member",
                        data: members?.map(member => ({
                            id: member.id,
                            name: member.profile.name,
                            Icon: RoleIconMap[member.role]
                        }))
                    }
                ]}/>
            </div>
        <Separator className=" bg-zinc-200 dark:bg-zinc-700 rounded-md my-2"/>
        {textChannels.length>0 && (
            <div className="mb-2">
                <ServerSection SectionType="Channel" channelType={ChannelType.TEXT} role={role} label="Text Channels"/>
                <div className=" space-y-[2px]">
                {textChannels.map(channel => (
                    <ServerChannel key={channel.id} Channel={channel} server={server} role={role}/>
                    ))}
                </div>
            </div>
        )}
        {audioChannels.length>0 && (
            <div className="mb-2">
                <Separator className=" bg-zinc-200 dark:bg-zinc-700 rounded-md my-2"/>
                <ServerSection SectionType="Channel" channelType={ChannelType.AUDIO} role={role} label="Audio Channels"/>
                <div className=" space-y-[2px]">
                {audioChannels.map(channel => (
                    <ServerChannel key={channel.id} Channel={channel} server={server} role={role}/>
                ))}
                </div>
            </div>
        )}
        {videoChannels.length>0 && (
            <div className="mb-2">
                <Separator className=" bg-zinc-200 dark:bg-zinc-700 rounded-md my-2"/>
                <ServerSection SectionType="Channel" channelType={ChannelType.VIDEO} role={role} label="Video Channels"/>
                <div className=" space-y-[2px]">
                {videoChannels.map(channel => (
                    <ServerChannel key={channel.id} Channel={channel} server={server} role={role}/>
                    ))}
                </div>
            </div>
        )}
        {members.length>0 && (
            <div className="mb-2">
                <Separator className=" bg-zinc-200 dark:bg-zinc-700 rounded-md my-2"/>
                <ServerSection SectionType="Member" server={server} role={role} label="Members"/>
                <div className=" space-y-[2px]">
                {members.map(member => (
                    <ServerMember key={member.id} server={server} member={member}/>
                ))}
                </div>
            </div>
        )}
        </ScrollArea>
    </div>
  )
}

export {ServerSidebar}