import { useState, useEffect, useMemo } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { useLocation } from 'react-router';
import { DragEndEvent, DragStartEvent, DragOverEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';

import { GET_TASKS } from '@graphql/task/queries';
import { UPDATE_TASK } from '@graphql/task/mutations';

import {
  findBoardSectionContainer,
  initializeBoard,
  BoardSections as BoardSectionsType,
  getTaskById,
} from './utils';
import BoardLayout from './BoardLayout';
import TaskBoard from './TaskBoard';
import GanttView from './GanttView';

const BoardSectionList = () => {
  const { pathname } = useLocation();
  const projectID = pathname.split('/')[3];

  const { data, loading: tasksLoading } = useQuery(GET_TASKS, {
    variables: { projectID },
  });

  const tasks = useMemo(() => data?.tasks || [], [data]);
  const initialBoardSections = initializeBoard(tasks);

  const [activeTaskId, setActiveTaskId] = useState<null | string>(null);
  const [boardSections, setBoardSections] =
    useState<BoardSectionsType>(initialBoardSections);
  const [renderGantt, setRenderGantt] = useState(false);

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

  const [updateTask] = useMutation(UPDATE_TASK);

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

  return (
    <BoardLayout
      projectID={projectID}
      renderGantt={renderGantt}
      setRenderGantt={setRenderGantt}
    >
      {renderGantt ? (
        <GanttView tasks={tasks} />
      ) : (
        <TaskBoard
          tasks={tasks}
          boardSections={boardSections}
          setBoardSections={setBoardSections}
          activeTask={task}
          tasksLoading={tasksLoading}
          sectionTaskCount={sectionTaskCount}
          handleDragStart={handleDragStart}
          handleDragOver={handleDragOver}
          handleDragEnd={handleDragEnd}
        />
      )}
    </BoardLayout>
  );
};

export default BoardSectionList;
