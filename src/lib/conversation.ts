import { db } from "./db"

export const getOrCreateConversation = async (memberOneId: string,memberTwoId: string) => {
    try{
        const conversation = await findConversation(memberOneId,memberTwoId) || await findConversation(memberTwoId,memberOneId)
        if(conversation){
            return conversation
        }
        else{
            const newConversation = await createNewConversation(memberOneId,memberTwoId)
            return newConversation
        }
    }
    catch(error){
        console.log(error)
    }
}

const findConversation = async (memberOneId: string,memberTwoId: string) => {
    try{
    return await db.conversation.findFirst({
        where: {
            AND: [
                { memberOneId , memberTwoId },
                {memberTwoId , memberOneId}
            ]
        },
        include: {
            memberOne: {
                include: {
                    profile: true
                }
            },
            memberTwo: {
                include: {
                    profile: true
                }
            }
        }
    })
    }
    catch(error){
        console.log(error)
    }
}

const createNewConversation = async (memberOneId: string,memberTwoId: string) => {
    try{
        return await db.conversation.create({
        data: {
            memberOneId,
                memberTwoId
            },
            include: {
                memberOne: {
                    include: {
                        profile: true
                    }
                },
                memberTwo: {
                    include: {
                        profile: true
                    }
                }
            }
        })
    }
    catch(error){
        console.log(error)
    }
}