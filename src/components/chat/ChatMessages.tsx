"use client";

import { Fragment,useRef,ElementRef } from "react";
import {format} from 'date-fns'
import { Member, Message, Profile } from "@prisma/client";

import { Loader2, ServerCrash } from "lucide-react";

import { useChatQuery } from "@/hooks/useChatQuery";
import { useChatSocket } from "@/hooks/useChatSocket";
import { useChatScroll } from "@/hooks/useChatScroll";

import { ChatWelcome } from "@/components/chat/ChatWelcome";
import { ChatItem } from "@/components/chat/ChatItem";

interface ChatMessagesProps {
  name: string;
  member: Member;
  chatId: string;
  apiUrl: string;
  socketUrl: string;
  socketQuery: Record<string, string>;
  paramKey: "channelId" | "conversationId";
  paramValue: string;
  type: "channel" | "conversation";
}

type MessageWithMemberWithProfile = Message & {
  member: Member & {
    profile: Profile
  };
}

const DATE_FORMAT = "dd MM yyyy, HH:mm"

const ChatMessages = ({name,member,chatId,apiUrl,socketQuery,socketUrl,paramKey,paramValue,type}: ChatMessagesProps) => {
  const queryKey = `chat:${chatId}`;
  const addKey = `chat:${chatId}:messages`;
  const updateKey = `chat:${chatId}:messages:update`;
  const chatRef = useRef<ElementRef<"div">>(null);
  const bottomRef = useRef<ElementRef<"div">>(null);
  const {data, fetchNextPage, hasNextPage, isFetchingNextPage, status} = useChatQuery({queryKey,apiUrl,paramKey,paramValue})
  useChatSocket({addKey,updateKey,queryKey});
  useChatScroll({chatRef,bottomRef,loadMore: fetchNextPage,shouldLoadMore: !isFetchingNextPage && hasNextPage,count: data?.pages?.[0]?.items?.length ?? 0})
  if(status==="pending")return (
    <div className="flex flex-1 flex-col justify-center items-center">
      <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4"/>
      <p className="text-xs text-zinc-500 dark:text-zinc-400">
        Loading Messages...
      </p>
    </div>
  )
  if(status==="error")return (
    <div className="flex flex-1 flex-col justify-center items-center">
      <ServerCrash className="h-7 w-7 text-zinc-500 my-4"/>
      <p className="text-xs text-zinc-500 dark:text-zinc-400">
        Something went wrong...
      </p>
    </div>
  )
  return (
    <div ref={chatRef} className="flex-1 flex flex-col py-4 overflow-y-auto">
      {!hasNextPage && <div className="flex-1"/>}
      {!hasNextPage && <ChatWelcome type={type} name={name}/>}
      {hasNextPage && <div className="flex justify-center">
        {isFetchingNextPage ? <Loader2 className="h-6 w-6 text-zinc-500 animate-spin my-4"/>
          : <button onClick={()=>fetchNextPage()} className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 text-xs y-4 dark:hover:text-zinc-300 transition">Load Previous Messages</button>
        }  
        </div>
      }
      <div className="flex flex-col-reverse mt-auto">
        {data?.pages.map((page, i) => (
          <Fragment key={i}>
            {page.items.map((message: MessageWithMemberWithProfile) => (
              <div key={message.id} className="">
                <ChatItem 
                  key={message.id} 
                  id={message.id} 
                  currentMember={member} 
                  content={message.content} 
                  fileUrl={message.fileUrl || ""} 
                  deleted={message.deleted} 
                  timestamp={format(new Date(message.createdAt),DATE_FORMAT)}
                  socketQuery={socketQuery}
                  socketUrl={socketUrl}
                  member={message.member}
                  isUpdated={message.updatedAt!==message.createdAt}/>
              </div>
            ))}
          </Fragment>
        ))}
      </div>
      <div ref={bottomRef}/>
    </div>
  )
}

export default ChatMessages