"use client";

import Image from "next/image";
import Link from "next/link";
import { Overlay } from "./overlay";
import { useAuth } from "@clerk/nextjs";
import { formatDistanceToNow } from "date-fns";
import { Footer } from "./footer";
import { Skeleton } from "@/components/ui/skeleton";

import { Actions } from "@/components/actions";
import { MoreHorizontal } from "lucide-react";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";

interface BoardCardProps {
  id: string;
  title: string;
  authorName: string;
  authorId: string;
  createdAt: number;
  imageUrl: string;
  orgId: string;
  isFavorite: boolean;
}

export const BoardCard = ({
  id,
  title,
  authorId,
  authorName,
  createdAt,
  imageUrl,
  orgId,
  isFavorite,
}: BoardCardProps) => {
  const { userId } = useAuth();

  const authorLabel = userId === authorId ? "You" : authorName;

  const createdAtLabel = formatDistanceToNow(createdAt, {
    addSuffix: true,
  });

  const { mutate: onFavorite, pending: pendingFavorite } = useApiMutation(api.board.favorite);
  const { mutate: onUnfavorite, pending: pendingUnfavorite } = useApiMutation(api.board.unfavorite);

  const toggleFavorite = () => {
    if (isFavorite) {
      onUnfavorite({ id }).catch(() => toast.error("Failed to unfavorite"));
    } else {
      onFavorite({ id, orgId }).catch(() => toast.error("Failed to favorite"));
    }
  };

  return (
    <Link href={`/board/${id}`}>
      <div className="group aspect-[100/127] border rounded-xl flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-background">
        <div className="relative flex-1">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
          <Overlay />

          <Actions id={id} title={title} side="right">
            <button
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-black/60 backdrop-blur-sm rounded-md hover:bg-black/80"
            >
              <MoreHorizontal className="text-white w-5 h-5" />
            </button>
          </Actions>
        </div>

        <Footer
          isFavorite={isFavorite}
          title={title}
          authorLabel={authorLabel}
          createdAtLabel={createdAtLabel}
          onClick={toggleFavorite}
          disabled={pendingFavorite || pendingUnfavorite}
        />
      </div>
    </Link>
  );
};

BoardCard.Skeleton = function BoardCardSkeleton() {
  return (
    <div className="aspect-[100/127] rounded-xl flex flex-col justify-between overflow-hidden border bg-muted animate-pulse">
      <Skeleton className="h-full w-full" />
    </div>
  );
};
