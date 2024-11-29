"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import * as z from 'zod'
import { useForm } from "react-hook-form";

import { useModal } from "@/hooks/useModalStore"

import { MobileToggleOnboarding } from "@/components/mobile-toggle-onboarding"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { DialogFooter } from "@/components/ui/dialog";

interface OnboardingPageProps {
    name: string;
}

const formSchema = z.object({
    url: z.string().min(1, { message: "Invite Code is Required" })
})

export const OnboardingPage = ({ name }: OnboardingPageProps) => {
    const router = useRouter()
    const { onOpen, onClose, isOpen } = useModal()
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            url: ""
        }
    })

    const isLoading = form.formState.isSubmitting;

    const handleJoin = async (data: z.infer<typeof formSchema>) => {
        router.push(data.url)
    }
    return (
        <div className=" bg-white dark:bg-[#313338] flex flex-col h-full">
            <div className="text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2">
                <MobileToggleOnboarding />
            </div>
            <div className=' text-7xl dark:text-white ml-5 mt-5 mb-20 justify-center flex'>Welcome {name}</div>
            <div className=' flex flex-row justify-between h-full'>
                <div className='flex flex-col items-center justify-center h-full w-6/12'>
                    <div className='text-2xl'>
                        Create Your Server
                    </div>
                    <div className='flex w-full h-full justify-center items-center'>
                        <Button variant={"primary"} onClick={() => onOpen("initialModal")}>Create</Button>
                    </div>
                </div>
                <div className='flex flex-col justify-center items-center h-full w-6/12'>
                    <div className='text-2xl'>Join a Server</div>
                    <div className='flex w-full h-full justify-center items-center'>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(handleJoin)}>
                                <div className="flex flex-col items-center justify-center w-full">

                                    <FormField control={form.control} name="url" render={({ field }) => {
                                        return (
                                            <FormItem>
                                                <FormLabel className="uppercase text-xs text-zinc-500 dark:text-zinc-400">
                                                    Server Invite Link
                                                </FormLabel>
                                                <FormControl>
                                                    <Input placeholder='Invite Link' className=' mr-3' {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )
                                    }} />
                                    <DialogFooter className="mt-3">
                                        <Button variant='primary' disabled={isLoading}>Join</Button>
                                    </DialogFooter>
                                </div>
                            </form>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    )
}