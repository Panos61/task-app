import { useState, useEffect, useMemo } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { useLocation } from 'react-router';
import { Formik, FormikProvider } from 'formik';
import {
  useSensors,
  useSensor,
  PointerSensor,
  DndContext,
  closestCorners,
  DragEndEvent,
  DragStartEvent,
  DragOverEvent,
  DragOverlay,
  DropAnimation,
  defaultDropAnimation,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { Divider, Skeleton } from '@mantine/core';
import { useClipboard } from '@mantine/hooks';
import { CopyIcon } from 'lucide-react';

import { GET_TASKS } from '@graphql/task/queries';
import { GET_PROJECT } from '@graphql/project/queries';
import { UPDATE_TASK } from '@graphql/task/mutations';

import {
  findBoardSectionContainer,
  initializeBoard,
  BoardSections as BoardSectionsType,
  getTaskById,
} from './utils';
import BoardSection from './BoardSection';
import TaskItem from './TaskItem';

const BoardSectionList = () => {
  const { pathname } = useLocation();
  const projectID = pathname.split('/')[3];

  const clipboard = useClipboard({ timeout: 500 });

  const { data, loading: tasksLoading } = useQuery(GET_TASKS, {
    variables: { projectID },
  });

  const tasks = useMemo(() => data?.tasks || [], [data]);
  const initialBoardSections = initializeBoard(tasks);

  const [activeTaskId, setActiveTaskId] = useState<null | string>(null);
  const [boardSections, setBoardSections] =
    useState<BoardSectionsType>(initialBoardSections);

  // Initialize and set each board section with the api task data
  useEffect(() => {
    setBoardSections(initializeBoard(tasks));
  }, [tasks]);

  const backlogTasks = boardSections['backlog'].filter(
    (task) => task.status === 'backlog'
  );
  const inProgressTasks = boardSections['inprogress'].filter(
    (task) => task.status === 'inprogress'
  );
  const doneTasks = boardSections['done'].filter(
    (task) => task.status === 'done'
  );

  const sectionTaskCount = useMemo(() => {
    return {
      backlog: backlogTasks.length,
      inprogress: inProgressTasks.length,
      done: doneTasks.length,
    };
  }, [backlogTasks, inProgressTasks, doneTasks]);

  const { data: projectData, loading: projectLoading } = useQuery(GET_PROJECT, {
    variables: { projectID },
  });
  const project = projectData?.project;

  const [updateTask] = useMutation(UPDATE_TASK);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 200,
        distance: 10,
      },
    })
  );

  const handleDragStart = ({ active }: DragStartEvent) => {
    setActiveTaskId(active.id as string);
  };

  const handleDragOver = ({ active, over }: DragOverEvent) => {
    // Find the containers
    const activeContainer = findBoardSectionContainer(
      boardSections,
      active.id as string
    );
    const overContainer = findBoardSectionContainer(
      boardSections,
      over?.id as string
    );

    if (
      !activeContainer ||
      !overContainer ||
      activeContainer === overContainer
    ) {
      return;
    }

    setBoardSections((boardSection) => {
      const activeItems = boardSection[activeContainer];
      const overItems = boardSection[overContainer];

      // Find the indexes for the items
      const activeIndex = activeItems.findIndex(
        (item) => item.id === active.id
      );
      const overIndex = overItems.findIndex((item) => item.id !== over?.id);

      return {
        ...boardSection,
        [activeContainer]: [
          ...boardSection[activeContainer].filter(
            (item) => item.id !== active.id
          ),
        ],
        [overContainer]: [
          ...boardSection[overContainer].slice(0, overIndex),
          boardSections[activeContainer][activeIndex],
          ...boardSection[overContainer].slice(
            overIndex,
            boardSection[overContainer].length
          ),
        ],
      };
    });
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    const activeContainer = findBoardSectionContainer(
      boardSections,
      active.id as string
    );
    const overContainer = findBoardSectionContainer(
      boardSections,
      over?.id as string
    );

    if (
      !activeContainer ||
      !overContainer ||
      activeContainer !== overContainer
    ) {
      return;
    }

    const activeIndex = boardSections[activeContainer].findIndex(
      (task) => task.id === active.id
    );
    const overIndex = boardSections[overContainer].findIndex(
      (task) => task.id === over?.id
    );

    if (activeIndex !== overIndex && task) {
      setBoardSections((boardSection) => ({
        ...boardSection,
        [overContainer]: arrayMove(
          boardSection[overContainer],
          activeIndex,
          overIndex
        ),
      }));

      const input = {
        id: parseInt(task.id),
        title: task.title,
        status: overContainer,
        projectID,
      };
      updateTask({ variables: { input } });
    }

    setActiveTaskId(null);
  };

  const task = activeTaskId ? getTaskById(tasks, activeTaskId) : null;

  const dropAnimation: DropAnimation = {
    ...defaultDropAnimation,
  };

  if (projectLoading)
    return <Skeleton height={12} mt={12} ml={72} width='16%' radius='xl' />;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className='flex items-center gap-12 mb-[10px] ml-72'>
        <div className='flex gap-8 items-center'>
          <div
            className='size-16 rounded-4'
            style={{ backgroundColor: project?.color }}
          />
          <span className='text-xl font-bold'>{project?.name}</span>
        </div>
        <div
          className='flex gap-8 items-center cursor-pointer'
          onClick={() => {
            clipboard.copy(project?.invitation);
          }}
        >
          {clipboard.copied ? (
            <span className='text-sm text-gray-400/95'>Copied</span>
          ) : (
            <>
              <span className='text-sm text-gray-400/95'>
                {project?.invitation}
              </span>
              <CopyIcon size={16} className='text-gray-400/95' />
            </>
          )}
        </div>
        <Divider orientation='vertical' />
        <div className='flex gap-4 text-sm text-gray-400/95'>
          <span>Collaborators:</span>
          <span className='font-bold text-text-primary'>{project?.collaborators}</span>
        </div>
      </div>
      <Divider className='mb-12' />
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
          {task && (
            <Formik
              initialValues={{
                title: task.title,
                status: task.status,
                description: task.description,
                priority: task.priority,
                assigneeID: task.assigneeID,
              }}
              // validationSchema={taskValidationSchema}
              enableReinitialize
              onSubmit={() => {}}
            >
              {(formikProps) => (
                <FormikProvider value={formikProps}>
                  <TaskItem id={task.id} task={task} />
                </FormikProvider>
              )}
            </Formik>
          )}
        </DragOverlay>
      </div>
    </DndContext>
  );
};

export default BoardSectionList;
