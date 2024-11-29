"use client";

import { useForm } from "react-hook-form";
import axios from 'axios'
import * as z from 'zod'
import qs from 'query-string'
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { ChannelType } from "@prisma/client";
import { useEffect } from "react";

import { Dialog,DialogContent,DialogFooter,DialogHeader,DialogTitle } from "@/components/ui/dialog";
import {Form,FormControl,FormField,FormLabel,FormItem,FormMessage} from "@/components/ui/form"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/useModalStore";
import { Select,SelectItem,SelectTrigger,SelectContent,SelectValue } from "@/components/ui/select";

const formSchema = z.object({
    name: z.string().min(1,{message: "Channel Name is Required"}).max(20).refine((name)=>name!== 'general',{message: "Channel Name cannot be general"}),
    type: z.nativeEnum(ChannelType)
})

const EditChannelModal = () => {
    const {isOpen,onClose,type,data}=useModal()
    const router = useRouter()
    const isModalOpen=isOpen && type === 'editChannel';
    const {server,channel} = data;


    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues:{
            name: '',
            type: channel?.type || ChannelType.TEXT
        }
    })

    useEffect(()=>{
            if(channel)
            {
                form.setValue('type',channel.type)
                form.setValue('name',channel.name)
            }
        }
    ,[form,channel])

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        // console.log(data)
        try{
            const url = qs.stringifyUrl({
                url: `/api/channels/${channel?.id}`,
                query: {
                    serverId: server?.id
                }
            })
            await axios.patch(url,data)
            form.reset()
            router.refresh()
            onClose()
        }catch(error){
            console.log(error);
            
        }
    }

    const handleClose = () => {
        onClose()
        form.reset()
    }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
        <DialogContent className="bg-white text-black p-0 overflow-hidden">
            <DialogHeader className="pt-8 px-6">
            <DialogTitle className="text-2xl text-center font-bold">Edit Your Channel</DialogTitle>
            </DialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="space-y-8 px-6">
                        <FormField control={form.control} name='name' render={({field})=>{
                            return (
                                <FormItem>
                                    <FormLabel className="uppercase text-xs text-zinc-500 dark:text-secondary/70">
                                        Channel Name
                                    </FormLabel>
                                    <FormControl>
                                        <Input disabled={isLoading} className=" bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0" placeholder="Enter Channel Name" {...field}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )
                        }}/>
                        <FormField control={form.control} name="type" render={({field})=>{
                            return (
                            <FormItem>
                                <FormLabel>Channel Type</FormLabel>
                                <Select disabled={isLoading} onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="bg-zinc-300/50 border-0 focus:ring-0 text-black ring-offset-0 focus:ring-offset-0 capitalize outline-none">
                                            <SelectValue  placeholder="Select a Channel Type"/>
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {Object.values(ChannelType).map((type)=>(
                                            <SelectItem key={type} value={type}>
                                                {type.toLowerCase()}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormItem>
                            )
                        }}/>
                    </div>
                    <DialogFooter className=" bg-gray-100 px-6 py-4">
                        <Button variant='primary' disabled={isLoading}>Save</Button>
                    </DialogFooter>
                </form>
            </Form>
        </DialogContent>
    </Dialog>
  )
}

export default EditChannelModal 