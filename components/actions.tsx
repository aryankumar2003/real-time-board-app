"use client";

import { DropdownMenuContentProps } from "@radix-ui/react-dropdown-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Link2, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { api } from "@/convex/_generated/api";
import { ConfirmModal } from "./confirm-model";
import { Button } from "./ui/button";
import { useRenameModal } from "@/store/use-rename-modal";

interface ActionProps {
  children: React.ReactNode;
  side?: DropdownMenuContentProps["side"];
  sideOffset?: DropdownMenuContentProps["sideOffset"];
  id: string;
  title: string;
}

export const Actions = ({
  children,
  side,
  sideOffset,
  id,
  title,
}: ActionProps) => {
  const { onOpen } = useRenameModal();
  const { mutate, pending } = useApiMutation(api.board.remove);

  const onDelete = () => {
    mutate({ id })
      .then(() => toast.success("Board deleted"))
      .catch(() => toast.error("Failed to delete the board"));
  };

  const onCopyLink = () => {
    navigator.clipboard
      .writeText(`${window.location.origin}/board/${id}`)
      .then(() => toast.success("Link copied"))
      .catch(() => toast.error("Failed to copy link"));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent
        side={side}
        sideOffset={sideOffset}
        onClick={(e) => e.stopPropagation()}
        className="w-60 rounded-xl backdrop-blur-md bg-white/70 dark:bg-black/20 border border-white/20 dark:border-white/10 shadow-xl p-1"
      >
        <DropdownMenuItem
          onClick={onCopyLink}
          className="p-3 rounded-md hover:bg-white/70 dark:hover:bg-white/10 cursor-pointer transition text-gray-600 dark:text-gray-200"
        >
          <Link2 className="h-4 w-4 mr-2 opacity-80" />
          <span className="text-sm font-medium">Copy board link</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => onOpen(id, title)}
          className="p-3 rounded-md hover:bg-white/70 dark:hover:bg-white/10 cursor-pointer transition text-gray-600 dark:text-gray-200"
        >
          <Pencil className="h-4 w-4 mr-2 opacity-80" />
          <span className="text-sm font-medium">Rename</span>
        </DropdownMenuItem>

        <ConfirmModal
          header="Delete board?"
          description="This will permanently delete the board."
          disabled={pending}
          onConfirm={onDelete}
        >
          <Button
            variant="ghost"
            className="p-3 w-full justify-start font-normal rounded-md hover:bg-red-500/10 text-red-500 transition"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </ConfirmModal>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
