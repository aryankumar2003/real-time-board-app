import {Liveblocks} from "@liveblocks/node";
import { ConvexHttpClient } from "convex/browser";

import {api} from "@/convex/_generated/api";
import { auth, currentUser } from "@clerk/nextjs/server";

const convex=new ConvexHttpClient(
    process.env.NEXT_PUBLIC_CONVEX_URL!);

const liveblocks=new Liveblocks({
    secret:"sk_dev_uTg7d0KbBCOcUb_7g_9SYKxMAj-KeQ_llNpOY882CeVhwZ3pcuLRcBBcW_L7GHYt"
});

export async function POST(required:Request){
    const authorization=await auth();
    const user=await currentUser();

    console.log("Auth_info",{
        authorization,
        user,
    })
    if(!authorization ||!user){
        return new Response("unauthorized",{status:403});
    }

    const {room}=await required.json();
    const board =await convex.query(api.board.get,{id:room});

    if(board?.orgId!=authorization.orgId){
        return new Response("Unauthorized",{status:403});
    }

    const userInfo={
        name:user.firstName ||"Anonymous",
        picture:user.imageUrl,
    };

    console.log("UserInfo:",userInfo);
    const session=liveblocks.prepareSession(
        user.id,
        {userInfo}
    );

    if(room){
        session.allow(room,session.FULL_ACCESS);
    }
    const {status,body}=await session.authorize();
    return new Response(body,{status});

};