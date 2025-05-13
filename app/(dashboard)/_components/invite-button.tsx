import { Plus } from "lucide-react";
import { OrganizationProfile } from "@clerk/nextjs";

import{
    Dialog,
    DialogContent,
    DialogTrigger
} from "@/components/ui/dialog";

import {Button} from "@/components/ui/button";
export const InviteButton = () => {
    const OrganizationProfilePage = () => (
      <OrganizationProfile>
        <OrganizationProfile.Page label="members" />
        <OrganizationProfile.Page label="general" />
      </OrganizationProfile>
    );
  
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Invite members
          </Button>
        </DialogTrigger>
  
        <DialogContent
          className="p-0 border-none  bg-gray-100 flex justify-center items-center"
        >
          <OrganizationProfilePage />
        </DialogContent>
      </Dialog>
    );
  };
  