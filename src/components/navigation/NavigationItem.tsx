"use client";

import Image from 'next/image'
import {useRouter,useParams} from 'next/navigation'

import { cn } from '@/lib/utils';
import { ActionTooltip } from '@/components/action-tooltip';

interface NavigationItemProps {
    name: string;
    id: string;
    imageUrl: string;
}

export const NavigationItem = ({ name, id, imageUrl }: NavigationItemProps) => {
    const router = useRouter();
    const params = useParams();
    const selected = params?.serverId === id;
    return (
        <ActionTooltip side="right" align="center" label={name}>
            <button
                onClick={() => {
                    router.push(`/servers/${id}`);
                }}
                className="group relative flex items-center "
            >
                <div className={cn("absolute left-0 bg-primary rounded-r-full transition-all w-[4px]",!selected && "group-hover:h-[20px]",selected?"h-[36px]":"h-[8px]")}/>
                    <div className={cn("relative group flex mx-3 h-[48px] w-full rounded-[24px] group-hover:rounded-[16px] transition—all overflow-hidden",selected && "bg-primary/10 text-primary rounded-[16px]")}>
                    <Image
                        // fill
                        src={imageUrl}
                        alt={name}
                        width={48}
                        height={48}
                    />
                </div>
            </button>
        </ActionTooltip>
    );
}