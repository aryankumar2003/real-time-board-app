
import { Loader } from "lucide-react";
import {  InfoSkeleton } from "./info";
import { ParticipantsSkeleten } from "./participants";
import {  ToolbarSkeleten } from "./toolbar";

export const Loading=()=>{
    return(
        <main
        className="h-full w-full  bg-neutral-100 touch-none
        flex items-center justify-center"
        >
            <Loader className="h-6 w-6 text-muted-foreground animate-spin"/>
            <InfoSkeleton/>
            <ParticipantsSkeleten/>
            <ToolbarSkeleten/>
        </main>
    )
}