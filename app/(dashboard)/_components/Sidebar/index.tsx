import { List } from "./list";
import { NewButton } from "./new-button";

export const Sidebar = () => {
  return (
    <aside
      className="fixed z-[1] left-0 h-full w-[60px]
      flex p-3 flex-col gap-y-4 text-amber-100
      bg-amber-600 backdrop-blur-md border-r border-white/10 shadow-lg"
    >
      <List />
      <NewButton />
    </aside>
  );
};
