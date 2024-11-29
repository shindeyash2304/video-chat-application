import { redirect } from "next/navigation"

import { db } from "@/lib/db"
import { InitialProfile } from "@/lib/initial-profile"

const SetupPage = async () => {
    const profile = await InitialProfile()
    const server= await db.server.findFirst({
        where: {
            members: {
                some: {
                    profileId: profile.id
                }
            }
        }
    })

    if(server){
        return redirect(`/servers/${server.id}`)
    }

    return redirect(`/onboarding`)
}

export default SetupPage