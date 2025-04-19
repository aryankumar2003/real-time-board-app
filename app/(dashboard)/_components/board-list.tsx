"use client";

import { use } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { EmptyBoards } from "./empty-board";
import { EmptyFavorites } from "./empty-fav";
import { EmptySearch } from "./empty-search";
import { BoardCard } from "./board-card";
import { NewBoardButton } from "./new-board-button";

interface BoardListProps {
  orgId: string;
  // searchParams is still a Promise here in Next.js 15+
  query: Promise<{ search?: string; favorites?: string }>;
}

export const BoardList = ({ orgId, query }: BoardListProps) => {
  // Unwrap searchParams asynchronously:
  const { search, favorites } = use(query);

  const data = useQuery(api.boards.get, { orgId });

  // Loading state
  if (data === undefined) {
    return (
      <div>
        <h2 className="text-3xl">
          {favorites ? "favorites boards" : "Team boards"}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 mb:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5 mt-8 pb-10">
          <NewBoardButton orgId={orgId} disabled />
          {Array.from({ length: 8 }).map((_, i) => (
            <BoardCard.Skeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  // Empty states
  if (!data.length && search) {
    return <EmptySearch />;
  }
  if (!data.length && favorites) {
    return <EmptyFavorites />;
  }
  if (!data.length) {
    return <EmptyBoards />;
  }

  // Normal render
  return (
    <div>
      <h2 className="text-3xl">
        {favorites ? "favorites boards" : "Team boards"}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 mb:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5 mt-8 pb-10">
        <NewBoardButton orgId={orgId} />
        {data.map((board) => (
          <BoardCard
            key={board._id}
            id={board._id}
            title={board.title}
            imageUrl={board.imageUrl}
            authorId={board.authorId}
            authorName={board.authorName}
            createdAt={board._creationTime}
            orgId={board.orgId}
            isFavorite={false}
          />
        ))}
      </div>
    </div>
  );
};
