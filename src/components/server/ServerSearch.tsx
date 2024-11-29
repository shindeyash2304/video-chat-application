"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Search } from "lucide-react";

import { CommandDialog, CommandInput, CommandList,CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";

interface ServerSearchProps {
    data: {
        label: string;
        type: "Channel" | "Member";
        data: {
            id: string;
            name: string;
            Icon: React.ReactNode;
        }[] | undefined;
    }[]
}

const ServerSearch = ({data}: ServerSearchProps) => {
    const [open, setOpen] = useState<boolean>(false);
    const router = useRouter()
    const params = useParams()
    useEffect(() => {
        const down=(e: KeyboardEvent)=>{
            if(e.key === 'k' && (e.ctrlKey || e.metaKey)){
                e.preventDefault()
                setOpen(open=>!open)
            }
        }
        document.addEventListener('keydown',down);
        return ()=>document.removeEventListener('keydown',down)
    }, [])

    const onClick = ({id,type}: {id: string; type: "Channel" | "Member"}) => {
        setOpen(false)
        if(type === 'Member'){
            return router.push(`/servers/${params?.serverId}/conversations/${id}`)
        }
        else if(type === 'Channel'){
            return router.push(`/servers/${params?.serverId}/channels/${id}`)
        }
    }

  return (
    <div>
        <button onClick={()=>setOpen(true)} className="px-2 py-2 rounded-md group flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition">
            <Search className="w-4 h-4 text-zinc-500 dark:text-zinc-400"/>
            <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition">
            Search
            </p>
            <kbd className=" pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground ml-auto">
                <span className=" text-xs">ctrl</span>K
            </kbd>
        </button>
        <CommandDialog open={open} onOpenChange={setOpen}>
            <CommandInput placeholder="Search All Channels"/>
            <CommandList>
                <CommandEmpty>
                    No Results Found
                </CommandEmpty>
                {data.map(({label,type,data})=>{
                    if(!data?.length)return null
                    return (
                        <CommandGroup key={label} heading={label}>
                            {data?.map(({id,name,Icon})=>(
                                <CommandItem key={id} onSelect={()=>onClick({id,type})}>
                                    {Icon}
                                        <span>{name}</span>
                                </CommandItem>
                            )
                            )}
                        </CommandGroup>
                    )
                })}
            </CommandList>
        </CommandDialog>
    </div>
  )
}

export default ServerSearch