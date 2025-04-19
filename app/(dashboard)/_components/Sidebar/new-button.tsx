"use client";
import { Plus } from "lucide-react";
import { CreateOrganization } from "@clerk/nextjs";

import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Hint } from "@/components/hint";

export const NewButton = () => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className="aspect-square">
                    <Hint
                        label="Create organization"
                        side="right"
                        align="start"
                        sideOffset={10}>
                        
                        <button className="bg-white/35 h-full w-full rounded-md flex
                    items-center justify-center opacity-50
                    hover:opacity-100 transition">
                            <Plus className="text-white" />
                        </button>
                    </Hint>
                </div>
            </DialogTrigger>
            <DialogContent className="p-0  border-none ">
                <CreateOrganization />
            </DialogContent>
        </Dialog>
    );
};