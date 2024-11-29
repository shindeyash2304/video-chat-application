"use client";

import { ChannelType, Channel, MemberRole, Server } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";

import { Edit, Hash, Mic, Trash, Video,Lock } from "lucide-react";

import { cn } from "@/lib/utils";
import { ActionTooltip } from "@/components/action-tooltip";
import { ModalType, useModal } from "@/hooks/useModalStore";

interface ServerChannelProps {
    Channel: Channel;
    server: Server;
    role?: MemberRole;
}

const IconMap = {
    [ChannelType.TEXT]: Hash,
    [ChannelType.AUDIO]: Mic,
    [ChannelType.VIDEO]: Video
}

const ServerChannel = ({ Channel, server, role }: ServerChannelProps) => {
    const params = useParams();
    const router = useRouter();
    const {onOpen} = useModal();

    const Icon = IconMap[Channel.type];

    const onClick=()=>{
        router.push(`/servers/${params?.serverId}/channels/${Channel.id}`);
    }
    const onAction=(e: React.MouseEvent,action: ModalType)=>{
        e.stopPropagation();
        onOpen(action,{server,channel: Channel});
    }
    return (
        <button onClick={onClick} className={cn("group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1", params?.channelId===Channel.id && "bg-zinc-700/20 dark:bg-zinc-700")}>
            <Icon className=" flex-shrink-0 w-5 h-5 text-zinc-500 dark:text-zinc-400" />
            <p className={cn("line-clamp-1 font-semibold text-xs text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition",params?.channelId===Channel.id && "text-primary dark:text-zinc-200 dark:group-hover:text-white")}>
                {Channel.name}
            </p>
            {Channel.name!=="general" && role!==MemberRole.GUEST && (
                <div className="ml-auto flex items-center gap-x-2">
                    <ActionTooltip label="Edit" align="center" side="right">
                        <Edit onClick={(e)=>onAction(e,"editChannel")} className="hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"/>
                    </ActionTooltip>
                    <ActionTooltip label="Delete" align="center" side="right">
                        <Trash onClick={(e)=>onAction(e,"deleteChannel")} className="hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"/>
                    </ActionTooltip>

                </div>
            )}
            {Channel.name==="general" && (
                <Lock className="ml-auto h-4 w-4 text-zinc-500 dark:text-zinc-400"/>
            )}
        </button>
    )
}

export default ServerChannel