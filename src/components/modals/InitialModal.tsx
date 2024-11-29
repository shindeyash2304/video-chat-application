"use client";

import { useForm } from "react-hook-form";
import axios from 'axios'
import * as z from 'zod'
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import { Dialog,DialogContent,DialogDescription,DialogFooter,DialogHeader,DialogTitle } from "@/components/ui/dialog";
import {Form,FormControl,FormField,FormLabel,FormItem,FormMessage} from "@/components/ui/form"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import FileUpload from "@/components/file-upload";
import { useModal } from "@/hooks/useModalStore";

const formSchema = z.object({
    name: z.string().min(1,{message: "Server Name is Required"}).max(20),
    imageUrl: z.string().min(1,{message: "Server Image is Required"})
})

const InitialModal = () => {
    const {isOpen,type,onClose} = useModal()
    const isModalOpen = isOpen && type === "initialModal";
    const router = useRouter()
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues:{
            name: "",
            imageUrl: ""
        }
    })

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        // console.log(data)
        try{
            await axios.post('/api/servers',data)
            form.reset()
            router.refresh()
            window.location.reload()
        }catch(error){
            console.log(error);
            
        }
    }

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
        <DialogContent className="bg-white text-black p-0 overflow-hidden">
            <DialogHeader className="pt-8 px-6">
            <DialogTitle className="text-2xl text-center font-bold">Customize Your Server</DialogTitle>
            <DialogDescription className="text-center text-zinc-500 ">
            {/* Lorem ipsum dolor sit amet consectetur adipisicing elit. Assumenda, natus. */}
            Give your server a personality with a name and an image. You can always change it later.
            </DialogDescription>
            </DialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="space-y-8 px-6">
                        <div className=" flex justify-center text-center">
                            <FormField control={form.control} name='imageUrl' render={(({field})=>{
                                return (
                                    <FormItem>
                                        <FormControl className="space y-8">
                                            <FileUpload endpoint='serverImage' onChange={field.onChange} value={field.value}/>
                                        </FormControl>
                                    </FormItem>
                                )
                            })}/>
                        </div>
                        <FormField control={form.control} name='name' render={({field})=>{
                            return (
                                <FormItem>
                                    <FormLabel className="uppercase text-xs text-zinc-500 dark:text-secondary/70">
                                        Server Name
                                    </FormLabel>
                                    <FormControl>
                                        <Input disabled={isLoading} className=" bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0" placeholder="Enter Server Name" {...field}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )
                        }}/>
                    </div>
                    <DialogFooter className=" bg-gray-100 px-6 py-4">
                        <Button variant='primary' disabled={isLoading}>Create</Button>
                    </DialogFooter>
                </form> 
            </Form>
        </DialogContent>
    </Dialog>
  )
}

export default InitialModal