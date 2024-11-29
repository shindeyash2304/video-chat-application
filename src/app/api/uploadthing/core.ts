import { createUploadthing, type FileRouter } from "uploadthing/next";
import {auth} from "@clerk/nextjs"
 
const f = createUploadthing();
 
const handleAuth=()=>{
    const user=auth();
    if(!user){
        throw new Error("Unauthorized");
    }
    return {userId:user.userId};
    
}
// const auth = (req: Request) => ({ id: "fakeId" }); // Fake auth function
 
// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
    serverImage: f({image: {maxFileSize: '4MB',maxFileCount: 1}})
        .middleware(()=>handleAuth())
        .onUploadComplete(()=>{}),
    messageFile: f({image:{maxFileSize: '4MB',maxFileCount: 1},pdf: {maxFileSize: '4MB',maxFileCount: 1}})
        .middleware(()=>handleAuth())
        .onUploadComplete(()=>{})
} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter;