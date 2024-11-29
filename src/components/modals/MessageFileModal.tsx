"use client";

import { useForm } from "react-hook-form";
import axios from 'axios'
import * as z from 'zod'
import { useRouter } from "next/navigation";
import qs from 'query-string'
import { zodResolver } from "@hookform/resolvers/zod";

import { useModal } from "@/hooks/useModalStore";

import { Dialog,DialogContent,DialogDescription,DialogFooter,DialogHeader,DialogTitle } from "@/components/ui/dialog";
import {Form,FormControl,FormField,FormItem} from "@/components/ui/form"
import { Button } from "@/components/ui/button";
import FileUpload from "@/components/file-upload";

const formSchema = z.object({
    fileUrl: z.string().min(1,{message: "Server Image is Required"})
})

const MessageFileModal = () => {
    const router = useRouter()
    const {isOpen,onClose,type,data} = useModal();
    const {apiUrl,query} = data;
    const isModalOpen = isOpen && type === "messageFile";

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues:{
            fileUrl: ""
        }
    })

    const handleClose = () => {
        onClose()
        form.reset()
    }

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        // console.log(data)
        try{
            const url = qs.stringifyUrl({
                url: apiUrl || "",
                query
            })
            await axios.post(url,{...data,content: data.fileUrl})
            form.reset()
            router.refresh()
            onClose()
        }catch(error){
            console.log(error);
            
        }
    }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
        <DialogContent className="bg-white text-black p-0 overflow-hidden">
            <DialogHeader className="pt-8 px-6">
            <DialogTitle className="text-2xl text-center font-bold">Customize Your Server</DialogTitle>
            <DialogDescription className="text-center text-zinc-500 ">
            Send a file as a message
            </DialogDescription>
            </DialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="space-y-8 px-6">
                        <div className=" flex justify-center text-center">
                            <FormField control={form.control} name='fileUrl' render={(({field})=>{
                                return (
                                    <FormItem>
                                        <FormControl className="space y-8">
                                            <FileUpload endpoint="messageFile" onChange={field.onChange} value={field.value}/>
                                        </FormControl>
                                    </FormItem>
                                )
                            })}/>
                        </div>
                    </div>
                    <DialogFooter className=" bg-gray-100 px-6 py-4">
                        <Button variant='primary' disabled={isLoading}>Send</Button>
                    </DialogFooter>
                </form>
            </Form>
        </DialogContent>
    </Dialog>
  )
}

export default MessageFileModal