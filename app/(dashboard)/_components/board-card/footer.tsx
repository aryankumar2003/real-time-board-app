import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

interface FooterProps {
  title: string;
  authorLabel: string;
  createdAtLabel: string;
  isFavorite: boolean;
  onClick: () => void;
  disabled: boolean;
}

export const Footer = ({
  title,
  authorLabel,
  createdAtLabel,
  isFavorite,
  onClick,
  disabled,
}: FooterProps) => {
  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.stopPropagation();
    event.preventDefault();
    onClick();
  };

  return (
    <div className="relative bg-background p-3 border-t">
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col overflow-hidden">
          <p className="text-sm font-medium text-foreground truncate">{title}</p>
          <p
            className={cn(
              "text-xs text-muted-foreground truncate transition-opacity duration-200",
              "opacity-0 group-hover:opacity-100"
            )}
          >
            {authorLabel}, {createdAtLabel}
          </p>
        </div>

        <button
          disabled={disabled}
          onClick={handleClick}
          className={cn(
            "transition-opacity duration-200 opacity-0 group-hover:opacity-100",
            "hover:text-blue-600 text-muted-foreground",
            "absolute top-3 right-3",
            disabled && "cursor-not-allowed opacity-75"
          )}
          aria-label="Toggle Favorite"
        >
          <Star
            className={cn(
              "h-4 w-4",
              isFavorite && "fill-blue-600 text-blue-600"
            )}
          />
        </button>
      </div>
    </div>
  );
};
