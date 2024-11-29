import { redirectToSignIn } from "@clerk/nextjs";
import { ChannelType } from "@prisma/client";
import { redirect } from "next/navigation";

import { CurrentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

import { MediaRoom } from "@/components/MediaRoom";
import ChatHeader from "@/components/chat/ChatHeader";
import { ChatInput } from "@/components/chat/ChatInput";
import ChatMessages from "@/components/chat/ChatMessages";

interface ChannelIdPageProps {
  params: {
    serverId: string;
    channelId: string
  }
}

const ChannelIdPage = async ({params}: ChannelIdPageProps) => {
  const profile = await CurrentProfile();
  if(!profile)return redirectToSignIn();
  const channel = await db.channel.findUnique({
    where:{
      id: params.channelId
    },
  })
  const member = await db.member.findFirst({
    where:{
      serverId: params.serverId,
      profileId: profile.id
    },
  })

  if(!member || !channel)return redirect('/');
  // console.log(params);
  return (
    <div className=" bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader serverId={params.serverId} name={channel.name} type={"channel"} />
      {channel.type===ChannelType.TEXT && (
        <>
          <ChatMessages member={member} name={channel.name} type="channel" apiUrl="/api/messages" socketUrl="/api/socket/messages" socketQuery={{
            channelId: params.channelId,
            serverId: params.serverId
          }} paramKey="channelId" paramValue={channel.id} chatId={channel.id}/>
          <ChatInput name={channel.name} type="channel" apiUrl="/api/socket/messages" query={{
            serverId: params.serverId,
            channelId: params.channelId
          }}/>
        </>
      )}
      {channel.type===ChannelType.AUDIO && (
        <MediaRoom chatId={channel.id} video={false} audio/>
      )}
      {channel.type===ChannelType.VIDEO && (
        <MediaRoom chatId={channel.id} video audio/>
      )}
      </div>
  ) 
}

export default ChannelIdPage