import { useState, useRef } from 'react';
import { useMutation } from '@apollo/client';
import { useLocation } from 'react-router';
import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Formik, FormikProvider } from 'formik';
import * as Yup from 'yup';
import { useOnClickOutside } from 'usehooks-ts';
import { PlusIcon } from 'lucide-react';

import type { Task } from '@graphql/task/types';
import { GET_TASKS } from '@graphql/task/queries';
import { CREATE_TASK, DELETE_TASK } from '@graphql/task/mutations';

import { BoardSections } from './utils';
import DroppableContainer from './DroppableContainer';
import SortableTaskItem from './SortableTaskItem';
import TaskItem from './TaskItem';

interface Props {
  id: string;
  title: string;
  tasks: Task[];
  setBoardSections: React.Dispatch<React.SetStateAction<BoardSections>>;
  sectionTaskCount: { backlog: number; inprogress: number; done: number };
}

const taskValidationSchema = Yup.object({
  title: Yup.string().required('Title is required'),
  description: Yup.string(),
  assignee: Yup.string(),
});

const BoardSection = ({
  id,
  title,
  tasks,
  setBoardSections,
  sectionTaskCount,
}: Props) => {
  const [currentTaskID, setCurrentTaskID] = useState<string | null>(null);
  const taskRef = useRef(null);

  const { pathname } = useLocation();
  const projectID = pathname.split('/')[3];

  const { setNodeRef } = useDroppable({
    id,
  });

  const [createTask] = useMutation(CREATE_TASK, {
    update(cache, { data: { createTask } }) {
      setCurrentTaskID(createTask.id);
      const existingTasks = cache.readQuery<{ tasks: Task[] }>({
        query: GET_TASKS,
        variables: { projectID },
      });

      cache.writeQuery({
        query: GET_TASKS,
        variables: { projectID },
        data: {
          tasks: [...(existingTasks?.tasks || []), createTask],
        },
      });
    },
  });

  const [deleteTask] = useMutation(DELETE_TASK, {
    update(cache) {
      cache.modify({
        fields: {
          tasks(existingTasks = []) {
            return existingTasks.filter((taskRef: { __ref: string }) => {
              const taskId = cache.identify({
                id: currentTaskID,
                __typename: 'Task',
              });
              return taskRef.__ref !== taskId;
            });
          },
        },
      });
    },
    onCompleted: () => {
      setBoardSections((prev: BoardSections) => {
        const newSections = { ...prev } as BoardSections;
        Object.keys(newSections).forEach((key) => {
          newSections[key] = newSections[key].filter(
            (task) => task.id !== currentTaskID
          );
        });
        return newSections;
      });
      setCurrentTaskID(null);
    },
  });

  const handleCreateTask = () => {
    const taskStatus = id;
    createTask({
      variables: {
        input: {
          title: '',
          status: taskStatus,
          projectID: projectID,
          assigneeID: '',
        },
      },
      onCompleted: (data) => {
        setCurrentTaskID(data.createTask.id);
      },
      onError: (error) => {
        console.error('Error creating task:', error);
      },
    });
  };

  const handleTaskRemoval = () => {
    deleteTask({
      variables: { taskID: currentTaskID },
      onCompleted: () => {
        setBoardSections((prev: BoardSections) => {
          const newSections = { ...prev } as BoardSections;
          Object.keys(newSections).forEach((key) => {
            newSections[key] = newSections[key].filter(
              (task) => task.id !== currentTaskID
            );
          });

          return newSections;
        });
        setCurrentTaskID(null);
      },
    });
  };

  useOnClickOutside(taskRef, () => {
    if (currentTaskID) {
      const task = tasks.find((task) => task.id === currentTaskID);
      if (task && task.title === '') {
        handleTaskRemoval();
      }
    }
  });

  const renderTitle = (title: string) => {
    let formattedTitle: string;
    formattedTitle = title.charAt(0).toUpperCase() + title.slice(1);

    if (title === 'inprogress') formattedTitle = 'In Progress';
    return formattedTitle;
  };

  return (
    <>
      <div className='flex items-center gap-4 mb-8 ml-12'>
        <span className='text-lg font-bold'>{renderTitle(title)}</span>
        <span className='self-end text-sm text-gray-400'>
          {sectionTaskCount[id as keyof typeof sectionTaskCount]}
        </span>
        <div
          className='p-4 rounded-8 duration-150 hover:bg-gray-700/35 cursor-pointer'
          onClick={handleCreateTask}
        >
          <PlusIcon size={16} strokeWidth={3} />
        </div>
      </div>
      <DroppableContainer id={id}>
        <SortableContext
          id={id}
          items={tasks}
          strategy={verticalListSortingStrategy}
        >
          <div ref={setNodeRef}>
            {tasks.map((task) => (
              <Formik
                key={task.id}
                initialValues={{
                  title: task.title,
                  status: task.status,
                  description: task.description,
                  priority: task.priority,
                  assigneeID: task.assigneeID,
                }}
                validationSchema={taskValidationSchema}
                enableReinitialize
                onSubmit={() => {}}
              >
                {(formikProps) => (
                  <FormikProvider value={formikProps}>
                    <div ref={taskRef}>
                      <SortableTaskItem id={task.id}>
                        <TaskItem id={task.id} task={task} />
                      </SortableTaskItem>
                    </div>
                  </FormikProvider>
                )}
              </Formik>
            ))}
          </div>
        </SortableContext>
      </DroppableContainer>
    </>
  );
};

export default BoardSection;
