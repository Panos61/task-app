import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { useFormikContext } from 'formik';
import classNames from 'classnames';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Avatar, Badge, Drawer } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Check, Trash2Icon } from 'lucide-react';

import type { Task } from '@graphql/task/types';
import { UPDATE_TASK, DELETE_TASK } from '@graphql/task/mutations';

import { useDebounce } from '../utils/useDebounce';
import Celebration from '../components/Celebration';
import TaskDrawer from './TaskDrawer';

interface Props {
  id: string;
  task: Task;
}

const TaskItem = ({ id, task }: Props) => {
  const { assignee, assigneeID, projectID, dueDate, priority, status } = task;
  const { startDate, endDate } = dueDate;

  const [opened, { open, close }] = useDisclosure(false);
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const [displayInput, setDisplayInput] = useState(true);
  const [showCelebration, setShowCelebration] = useState(false);

  const { values, setFieldValue } = useFormikContext<Task>();

  const [updateTask] = useMutation(UPDATE_TASK);
  
  const [deleteTask] = useMutation(DELETE_TASK, {
    update(cache) {
      cache.modify({
        fields: {
          tasks(existingTasks = []) {
            return existingTasks.filter((taskRef: { __ref: string }) => {
              const taskId = cache.identify({
                id: task?.id,
                __typename: 'Task',
              });
              return taskRef.__ref !== taskId;
            });
          },
        },
      });
      
      cache.modify({
        id: cache.identify({ __typename: 'Project', id: projectID }),
        fields: {
          taskCount(existingCount) {
            return existingCount - 1;
          },
        },
      });
    },
  });
  
  const debouncedUpdate = useDebounce((updates: Partial<Task>) => {
    updateTask({
      variables: {
        input: {
          id: parseInt(task.id),
          ...updates,
        },
      },
    });
  }, 500);

  const handleTitleChange = (value: string) => {
    setFieldValue('title', value);
    debouncedUpdate({ title: value });
  };

  const handleCheck = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    debouncedUpdate({ status: 'done' });
    setShowCelebration(true);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    deleteTask({ variables: { taskID: parseInt(task.id) } });
  };

  const checkStyle = classNames(
    'relative top-4 text-center size-16 rounded-full border border-gray-400/95 duration-300 hover:border-green-700 cursor-pointer',
    {
      'border-green-700': status === 'done',
      'bg-green-800': status === 'done',
      'opacity-65': status === 'done',
    }
  );

  const setPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low':
        return 'blue';
      case 'medium':
        return 'yellow';
      case 'high':
        return 'orange';
      default:
        return '';
    }
  };

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <>
      <Drawer
        size='lg'
        position='right'
        withCloseButton={false}
        opened={opened}
        onClose={close}
      >
        <TaskDrawer task={task} />
      </Drawer>
      <div
        ref={setNodeRef}
        style={{
          ...style,
          zIndex: transform ? 999 : 'auto',
        }}
        className={`relative ${status === 'done' && 'opacity-65'}`}
        onClick={open}
        {...attributes}
        {...listeners}
      >
        <div className='flex flex-col justify-center gap-12 py-12 my-8 mx-4 border border-gray-500/20 rounded-12 cursor-grab active:cursor-grabbing duration-300 hover:border-gray-600/60'>
          <div className='flex flex-col gap-4 ml-16'>
            <div className='flex gap-8 mr-12'>
              <div className={checkStyle} onClick={handleCheck}>
                <Check
                  size={16}
                  className='relative inset-0 m-auto size-full text-gray-400/95 duration-300 hover:!text-green-700'
                />
              </div>
              <div className='flex-1' onClick={() => setDisplayInput(true)}>
                {displayInput ? (
                  <textarea
                    rows={1}
                    placeholder='Write a task name'
                    value={values.title}
                    className='basis-full w-full h-auto mr-1 resize-none outline-none overflow-hidden bg-transparent'
                    autoFocus
                    onChange={(e) => {
                      handleTitleChange(e.target.value);
                      e.target.style.height = 'auto';
                      e.target.style.height = e.target.scrollHeight + 'px';
                    }}
                  />
                ) : (
                  <h3>{values.title}</h3>
                )}
                {values.title === '' && (
                  <p className='text-[13px] text-yellow-300'>Untitled</p>
                )}
              </div>
              <div className='mt-4'>
                <Trash2Icon
                  size={16}
                  className='cursor-pointer duration-150 hover:text-red-500'
                  onClick={handleDelete}
                />
              </div>
            </div>
            <div className='flex gap-8'>
              {priority && (
                <Badge
                  variant='light'
                  radius='sm'
                  color={setPriorityColor(priority)}
                  className='mb-8'
                >
                  {priority.toUpperCase()}
                </Badge>
              )}
              {(startDate || endDate) && (
                <Badge
                  variant='light'
                  radius='sm'
                  color='gray'
                  className='mb-8'
                >
                  <span className='text-green-500'>{startDate}</span>
                  {endDate && (
                    <>
                      <span className='text-gray-400/95'> - </span>
                      <span className='text-red-500'>{endDate}</span>
                    </>
                  )}
                </Badge>
              )}
            </div>
            {assigneeID && (
              <Avatar size={24} color='cyan' radius='xl'>
                {assignee?.username.slice(0, 2).toUpperCase()}
              </Avatar>
            )}
          </div>
        </div>
        <Celebration
          isVisible={showCelebration}
          onAnimationComplete={() => setShowCelebration(false)}
        />
      </div>
    </>
  );
};

export default TaskItem;
