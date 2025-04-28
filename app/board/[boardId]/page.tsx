import { Canvas } from "./_components/canvas";
import { Room } from "@/components/room";
import { Loading } from "./_components/loading";

interface BoardIdPageProps {
  params:Promise<{ boardId: string }>;
 
}

async function BoardIdPage({ params }: BoardIdPageProps) {
  const { boardId } = await params;

  return (
    <div>
      <Room roomId={boardId} fallback={<Loading />}>
        <Canvas boardId={boardId} />
      </Room>
    </div>
  );
}

export default BoardIdPage;
