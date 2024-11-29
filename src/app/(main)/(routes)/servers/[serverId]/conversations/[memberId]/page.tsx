import { redirectToSignIn } from "@clerk/nextjs"
import { redirect } from "next/navigation"

import { CurrentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db"

import { MediaRoom } from "@/components/MediaRoom"
import ChatHeader from "@/components/chat/ChatHeader"
import { ChatInput } from "@/components/chat/ChatInput"
import ChatMessages from "@/components/chat/ChatMessages"
import { getOrCreateConversation } from "@/lib/conversation"

interface MemberIdProps {
  params: {
    serverId: string
    memberId: string
  },
  searchParams: {
    video?: boolean
  }
}

const page = async ({ params, searchParams }: MemberIdProps) => {
  const profile = await CurrentProfile();
  if (!profile) return redirectToSignIn();

  const currentMember = await db.member.findFirst({
    where: {
      serverId: params.serverId,
      profileId: profile.id,
    },
    include: {
      profile: true,
    },
  })
  if (!currentMember) return redirect('/');

  const conversation = await getOrCreateConversation(currentMember.id, params.memberId);

  if (!conversation) return redirect(`/servers/${params.serverId}}`);

  const { memberOne, memberTwo } = conversation;
  const otherMember = memberOne.profileId === profile.id ? memberTwo : memberOne;

  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader serverId={params.serverId} name={otherMember.profile.name} type={"conversation"} imageUrl={otherMember.profile.imageUrl} />
      {!searchParams.video && (
        <>
          <ChatMessages
            member={currentMember}
            name={otherMember.profile.name}
            chatId={conversation.id}
            type={"conversation"}
            apiUrl="/api/direct-messages"
            paramKey="conversationId"
            paramValue={conversation.id}
            socketUrl="/api/socket/direct-messages"
            socketQuery={{
              conversationId: conversation.id,
            }} />
          <ChatInput
            name={otherMember.profile.name}
            type={"conversation"}
            apiUrl="/api/socket/direct-messages"
            query={{
              conversationId: conversation.id,
            }} />
        </>
      )}
      {searchParams.video && (
        <MediaRoom
          chatId={conversation.id}
          video
          audio
        />
      )}
    </div>
  )
}

export default page