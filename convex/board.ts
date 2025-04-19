import { v } from "convex/values";
import { mutation } from "./_generated/server";

const images=[
    "/placeholder/1.png",
    "/placeholder/2.avif",
    "/placeholder/3.avif",
    "/placeholder/4.avif",
    "/placeholder/5.avif",
    "/placeholder/6.avif",
    "/placeholder/7.avif",
    "/placeholder/8.avif",
    "/placeholder/9.avif",
    "/placeholder/10.avif",

];

export const create=mutation({
    args:{
        orgId:v.string(),
        title:v.string()
    },
    handler:async(ctx,args)=>{
        const identify=await ctx.auth.getUserIdentity();

        if(!identify){
            throw new Error("Unauthorized")
        }
        const randomImage=images[Math.floor(Math.random()*images.length)];

        const board=await ctx.db.insert("boards",{
            title:args.title,
            orgId:args.orgId,
            authorId:identify.subject,
            authorName:identify.name!,
            imageUrl:randomImage,
        });

        return board;
    }
})