import {
  DndContext,
  DragOverlay,
  useSensors,
  useSensor,
  PointerSensor,
  closestCorners,
  DropAnimation,
  defaultDropAnimation,
} from '@dnd-kit/core';
import { Skeleton } from '@mantine/core';
import { Formik, FormikProvider } from 'formik';

import type {
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import type { Task } from '@graphql/task/types';

import BoardSection from './BoardSection';
import TaskItem from './TaskItem';
import type { BoardSections as BoardSectionsType } from './utils';

interface TaskBoardProps {
  tasks: Task[];
  boardSections: BoardSectionsType;
  setBoardSections: React.Dispatch<React.SetStateAction<BoardSectionsType>>;
  activeTask: Task | null | undefined;
  tasksLoading: boolean;
  sectionTaskCount: { backlog: number; inprogress: number; done: number };
  handleDragStart: (event: DragStartEvent) => void;
  handleDragOver: (event: DragOverEvent) => void;
  handleDragEnd: (event: DragEndEvent) => void;
}

const TaskBoard = ({
  boardSections,
  setBoardSections,
  activeTask,
  tasksLoading,
  sectionTaskCount,
  handleDragStart,
  handleDragOver,
  handleDragEnd,
}: TaskBoardProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 200,
        distance: 10,
      },
    })
  );

  const dropAnimation: DropAnimation = {
    ...defaultDropAnimation,
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className='grid grid-cols-3 gap-4 ml-68'>
        {Object.keys(boardSections).map((boardSectionKey) => (
          <div className='w-[400px]' key={boardSectionKey}>
            {tasksLoading ? (
              Array(4)
                .fill(0)
                .map((_, index) => (
                  <Skeleton key={index} h={116} mt='sm' animate />
                ))
            ) : (
              <BoardSection
                id={boardSectionKey}
                title={boardSectionKey}
                tasks={boardSections[boardSectionKey]}
                setBoardSections={setBoardSections}
                sectionTaskCount={sectionTaskCount}
              />
            )}
          </div>
        ))}
        <DragOverlay dropAnimation={dropAnimation}>
          {activeTask && (
            <Formik
              initialValues={{
                title: activeTask.title,
                status: activeTask.status,
                description: activeTask.description,
                priority: activeTask.priority,
                dueDate: {
                  startDate: activeTask.dueDate?.startDate,
                  endDate: activeTask.dueDate?.endDate,
                },
                assigneeID: activeTask.assigneeID,
              }}
              enableReinitialize
              onSubmit={() => {}}
            >
              {(formikProps) => (
                <FormikProvider value={formikProps}>
                  <TaskItem id={activeTask.id} task={activeTask} />
                </FormikProvider>
              )}
            </Formik>
          )}
        </DragOverlay>
      </div>
    </DndContext>
  );
};

export default TaskBoard;
