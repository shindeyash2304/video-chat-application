"use client";

import { useEffect, useState } from "react";

import CreateServerModal from "@/components/modals/CreateServerModal";
import EditServerModal from "@/components/modals/EditServerModal";
import InviteModal from "@/components/modals/InviteModal";
import MembersModal from "@/components/modals/MembersModal";
import CreateChannelModal from "@/components/modals/CreateChannelModal";
import LeaveServerModal from "@/components/modals/LeaveServerModal";
import DeleteServerModal from "@/components/modals/DeleteServerModal";
import DeleteChannelModal from "@/components/modals/DeleteChannelModal";
import EditChannelModal from "@/components/modals/EditChannelModal";
import MessageFileModal from "@/components/modals/MessageFileModal";
import DeleteMessageModal from "@/components/modals/DeleteMessageModal";
import InitialModal from "@/components/modals/InitialModal";

export const ModalProvider=()=>{
    const [mounted,setMounted]=useState(false)
    useEffect(()=>{
        setMounted(true)
    }
    ,[])

    if(!mounted){
        return null
    }
    return (
        <>
            <CreateServerModal/>
            <InviteModal />
            <EditServerModal />
            <MembersModal />
            <CreateChannelModal />
            <LeaveServerModal />
            <DeleteServerModal />
            <DeleteChannelModal />
            <EditChannelModal />
            <MessageFileModal />
            <DeleteMessageModal />
            <InitialModal />
        </>
    )
}