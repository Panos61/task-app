import { useState } from 'react';
import { useMutation, useSubscription } from '@apollo/client';
import { useLocation } from 'react-router';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Avatar, Drawer } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Check } from 'lucide-react';

import type { Task } from '@graphql/task/types';
import { UPDATE_TASK } from '@graphql/task/mutations';
import { TASK_CREATED_SUBSCRIPTION } from '@graphql/task/subscriptions';
import Celebration from './Celebration';
import TaskDrawer from './TaskDrawer';
import classNames from 'classnames';

interface Props {
  id: string;
  task: Task;
  values: { title: string; status: string };
  setFieldValue?: (field: string, value: string) => void;
}

const TaskItem = ({ id, task, values, setFieldValue }: Props) => {
  const { pathname } = useLocation();
  const projectID = pathname.split('/')[3];

  const [opened, { open, close }] = useDisclosure(false);
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const [displayInput, setDisplayInput] = useState(true);
  const [showCelebration, setShowCelebration] = useState(false);

  useSubscription(TASK_CREATED_SUBSCRIPTION, {
    variables: {
      projectID,
      title: '',
      description: '',
      status: task.status,
    },
    onData: ({ data }) => {
      console.log('Task created data:', data);
    },
  });

  const [updateTask] = useMutation(UPDATE_TASK);

  const handleTitleChange = (value: string) => {
    if (setFieldValue) {
      setFieldValue('title', value);
    }

    const timeoutId = setTimeout(() => {
      updateTask({
        variables: {
          input: {
            id: parseInt(task.id),
            title: task.title || '',
          },
        },
      });
    }, 500);

    return () => clearTimeout(timeoutId);
  };

  const handleCheck = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    updateTask({
      variables: {
        input: {
          id: parseInt(task.id),
          status: 'done',
        },
      },
    });
    setShowCelebration(true);
  };

  const checkStyle = classNames(
    'relative top-4 text-center size-16 rounded-full border border-gray-400/95 duration-300 hover:border-green-700 cursor-pointer',
    {
      'border-green-700': task.status === 'done',
      'bg-green-800': task.status === 'done',
      'opacity-65': task.status === 'done',
    }
  );

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <>
      <Drawer
        position='right'
        opened={opened}
        onClose={close}
        withCloseButton={false}
        size='lg'
      >
        <TaskDrawer task={task} />
      </Drawer>
      <div
        ref={setNodeRef}
        style={{
          ...style,
          position: 'relative',
          zIndex: transform ? 999 : 'auto',
        }}
        className={`${task.status === 'done' && 'opacity-65'}`}
        onClick={open}
        {...attributes}
        {...listeners}
      >
        <div className='flex flex=wrap flex-col justify-center gap-12 py-12 my-8 mx-4 border border-gray-400/20 bg-gray-700/25 rounded-12 cursor-grab active:cursor-grabbing duration-300 hover:border-gray-400/50'>
          <div className='flex flex-wrap gap-8 mx-12'>
            <div className={checkStyle} onClick={handleCheck}>
              <Check className='relative inset-0 m-auto size-full text-gray-400/95 duration-300 hover:!text-green-700' />
            </div>
            <div
              className='flex-1 flex-wrap'
              onClick={() => setDisplayInput(true)}
            >
              {displayInput ? (
                <textarea
                  rows={1}
                  placeholder='Write a task name'
                  defaultValue={task.title}
                  className='basis-full w-full h-auto mr-1 resize-none outline-none overflow-hidden bg-transparent'
                  autoFocus
                  onChange={(e) => {
                    handleTitleChange(e.target.value);
                    e.target.style.height = 'auto';
                    e.target.style.height = e.target.scrollHeight + 'px';
                  }}
                />
              ) : (
                <h3>{task.title}</h3>
              )}
            </div>
          </div>
          <Avatar color='cyan' radius='xl' className='ml-16' size={28}>
            MK
          </Avatar>
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
