"use client";

import { Actions } from "@/components/actions";
import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { useRenameModal } from "@/store/use-rename-modal";
import { useQuery } from "convex/react";
import { Menu } from "lucide-react";
import { Poppins } from "next/font/google";
import Image from "next/image";
import Link from "next/link";

interface InfoProps {
  boardId: string;
}

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

const TabSeparator = () => <div className="text-gray-600 px-1.5">|</div>;

export const Info = ({ boardId }: InfoProps) => {
  const { onOpen } = useRenameModal();

  const data = useQuery(api.board.get, {
    id: boardId as Id<"boards">,
  });

  if (!data) return <InfoSkeleton />;

  return (
    <div className="absolute top-2 left-2 bg-white/70 backdrop-blur-md rounded-md px-1.5 h-12 flex items-center shadow-lg border border-white/30">
      {/* Dashboard Link */}
      <Hint label="Go to Dashboard" side="bottom" sideOffset={10}>
        <Button asChild variant="board" className="px-2">
          <Link href="/">
            <Image src="/logo.png" alt="logo" height={40} width={40} />
            <span
              className={cn("font-semibold text-xl ml-2 text-gray-600", font.className)}
            >
              Board
            </span>
          </Link>
        </Button>
      </Hint>

      <TabSeparator />

      {/* Edit Title Button */}
      <Hint label="Edit title" side="bottom" sideOffset={10}>
        <Button
          variant="board"
          className="text-base font-normal px-2 text-gray-600"
          onClick={() => onOpen(data._id, data.title)}
        >
          {data.title}
        </Button>
      </Hint>

      <TabSeparator />

      {/* Main Menu Actions */}
      <Actions id={data._id} title={data.title} side="bottom" sideOffset={10}>
        <div>
          <Hint label="Main menu" side="bottom" sideOffset={10}>
            <Button size="icon" variant="board" className="text-gray-600">
              <Menu />
            </Button>
          </Hint>
        </div>
      </Actions>
    </div>
  );
};

export const InfoSkeleton = () => (
  <div className="absolute top-2 left-2 bg-white/70 backdrop-blur-md rounded-md px-1.5 h-12 flex items-center shadow-lg border border-white/20 w-[300px]" />
);
