import { useDroppable } from '@dnd-kit/core';

interface Props {
  id: string;
  children: React.ReactNode;
}

const DroppableContainer = ({ id, children }: Props) => {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`h-full min-h-72 mt-12 p-8 rounded-12 transition-colors ${
        isOver ? 'bg-gray-600/20' : 'bg-gray-700/5'
      }`}
    >
      {children}
    </div>
  );
};

export default DroppableContainer;
