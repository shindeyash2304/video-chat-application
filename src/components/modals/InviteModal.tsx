"use client";

import axios from 'axios'
import { useState } from "react";

import { Check, Copy, RefreshCw } from "lucide-react";

import { Dialog,DialogContent,DialogHeader,DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/useModalStore";
import { Label } from "@/components/ui/label";
import { UseOrigin } from "@/hooks/UseOrigin";

const InviteModal = () => {
    const {isOpen,onOpen,onClose,type,data}=useModal()
    const origin=UseOrigin()

    const isModalOpen=isOpen && type === 'invite';
    const {server}=data;
    const inviteUrl=`${origin}/invite/${server?.inviteCode}`;    
    const [copied,setCopied]=useState(false)
    const [isLoading,setIsLoading]=useState(false)

    const onCopy= async ()=> {
        await navigator.clipboard.writeText(inviteUrl)
        setCopied(true)

        setTimeout(()=>{
            setCopied(false)
        },1000)
    }

    const onNewInvite=async()=>{
        try{

            setIsLoading(true)
            const {data}=await axios.patch(`/api/servers/${server?.id}/invite-code`)
            onOpen("invite",{server: data});
        }
        catch(err){
            console.log(err)
        }
        finally{
            setIsLoading(false)
        }   
    }

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
        <DialogContent className="bg-white text-black p-0 overflow-hidden">
            <DialogHeader className="pt-8 px-6">
            <DialogTitle className="text-2xl text-center font-bold">Invite Friends</DialogTitle>
            </DialogHeader>
            <div className="p-6">
                <Label className=" uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                    Server Invite Link
                </Label>
                <div className="flex items-cente mt-2 gap-x-2">
                    <Input disabled className=" bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0" value={inviteUrl}/>
                    <Button disabled={isLoading} onClick={onCopy} size="icon">
                        {copied?<Check className="w-4 h-4"/>:<Copy className="h-4 w-4"/>}
                    </Button>
                </div>
                <Button onClick={onNewInvite} disabled={isLoading} variant="link" size={"sm"} className=" text-xs text-zinc-500 mt-4">
                    Generate a new Link
                    <RefreshCw className="w-4 h-4 ml-2"/>
                </Button>
            </div>
        </DialogContent>
    </Dialog>
  )
}

export default InviteModal 