"use client"


import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useOrganization } from "@clerk/nextjs";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const EmptyBoards=()=>{
    const router=useRouter();
    const{organization}=useOrganization();
    const {mutate,pending}=useApiMutation(api.board.create);

    const onClick=()=>{
        if(!organization) return;



        mutate({
            title:"untitled",
            orgId:organization.id

        })
        .then((id)=>{
            toast.success("Board created")
            router.push(`/board/${id}`);
        })
        .catch(()=>toast.error("Failed to create board"))
    }

    return(
        <div className="h-full flex flex-col items-center justify-center">
            <Image
            src="/note.png"
            height={120}
            width={120}
            alt="Empty"
            />

            <h2 className="text-2xl font-semibold mt-6">
                Create your first board!
            </h2>
            <p className="text-muted-foreground textg-sm mt-2">
                Start by creating a board
            </p>
            <div className="mt-6">
                <Button disabled={pending} size="lg" onClick={onClick}>
                    Create board
                </Button>
            </div>

        </div>
    )
}