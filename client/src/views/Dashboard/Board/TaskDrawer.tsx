import { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { useLocation } from 'react-router';
import { useFormikContext } from 'formik';
import classNames from 'classnames';
import { Divider, Textarea, Skeleton, Select } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { Check, Trash } from 'lucide-react';

import type { User } from '@graphql/user/types';
import type { Task } from '@graphql/task/types';
import { GET_USERS } from '@graphql/user/queries';
import { UPDATE_TASK, DELETE_TASK } from '@graphql/task/mutations';
import { useDebounce } from '../utils/useDebounce';

interface Props {
  task: Task;
}

const priorityOptions = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

const TaskDrawer = ({ task }: Props) => {
  const {
    assigneeID,
    description,
    dueDate,
    priority,
    status,
    title,
    createdAt,
    updatedAt,
  } = task;
  const { startDate, endDate } = dueDate;

  const { pathname } = useLocation();
  const projectID = pathname.split('/')[3];

  const [selectData, setSelectData] = useState<
    { value: string; label: string }[]
  >([]);

  const { values, setFieldValue } = useFormikContext<Task>();

  const { data, loading } = useQuery(GET_USERS, {
    variables: {
      projectID,
    },
  });
  const users = data?.users;

  useEffect(() => {
    if (users) {
      setSelectData(
        users.map((user: User) => ({ value: user.id, label: user.username }))
      );
    }
  }, [users]);

  const [updateTask] = useMutation(UPDATE_TASK, {
    update(cache, { data: { updatedTask } }) {
      cache.modify({
        fields: {
          tasks(existingTasks = []) {
            return existingTasks.map((taskRef: { __ref: string }) => {
              if (taskRef.__ref === task?.id) {
                return { ...taskRef, updatedTask };
              }
              return taskRef;
            });
          },
        },
      });
    },
  });

  const debouncedUpdate = useDebounce((updates: Partial<Task>) => {
    if (task) {
      updateTask({
        variables: {
          input: { id: parseInt(task.id), ...updates },
        },
      });
    }
  }, 500);

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
    },
  });

  const handleDeleteTask = () => {
    if (task) {
      deleteTask({ variables: { taskID: parseInt(task.id) } });
    }
  };

  const handleCompleteTask = () => {
    setFieldValue('status', 'done');
    debouncedUpdate({ status: 'done' });
  };

  const handleTitleChange = (
    value: string,
    setFieldValue: (field: string, value: string) => void
  ) => {
    setFieldValue('title', value);

    const timeoutId = setTimeout(() => {
      updateTask({
        variables: {
          input: {
            id: parseInt(task?.id || ''),
            title: value,
          },
        },
        update(cache, { data: { updateTask } }) {
          cache.modify({
            id: cache.identify({ __typename: 'Task', id: task?.id }),
            fields: {
              title: () => updateTask.title,
            },
          });
        },
      });
    }, 500);

    return () => clearTimeout(timeoutId);
  };

  const handleAssigneeChange = (value: string | null) => {
    const parsedValue = value ? parseInt(value) : null;

    setFieldValue('assigneeID', parsedValue);
    debouncedUpdate({ assigneeID: parsedValue });
  };

  const renderAssignee = () => {
    if (assigneeID) {
      return selectData.find((user) => user.value === assigneeID)?.value;
    }
    return null;
  };

  const handleDueDateChange = (value: Date | null, isStartDate: boolean) => {
    if (!value) return;

    const dateStr = value.toISOString().split('T')[0];

    const dueDateInput = {
      startDate: isStartDate ? dateStr : startDate,
      endDate: !isStartDate ? dateStr : endDate,
    };

    setFieldValue('dueDate', dueDateInput);
    debouncedUpdate({ dueDate: dueDateInput });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(Number(timestamp));
    return date.toLocaleDateString('en-us', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const completeCls = classNames(
    'flex items-center gap-4 w-auto p-4 mb-8 text-xs font-semibold border border-gray-400/20 rounded-4 duration-300 cursor-pointer hover:bg-green-600/15 hover:border-green-600 hover:text-green-600',
    {
      'bg-green-600/15 border-green-600 text-green-600': status === 'done',
    }
  );

  return (
    <div className='flex flex-col justify-between w-full'>
      <div className='flex gap-8'>
        <div className={completeCls} onClick={handleCompleteTask}>
          <Check size={16} />
          {status === 'done' ? 'Completed' : 'Mark complete'}
        </div>
        <div
          className='flex items-center gap-4 p-4 mb-8 text-xs text-red-500 font-semibold border border-red-500 rounded-4 duration-300 cursor-pointer hover:bg-red-600/15 hover:border-red-600 hover:text-red-600'
          onClick={handleDeleteTask}
        >
          <Trash size={16} />
          Delete
        </div>
      </div>
      <Divider />
      <div className='flex flex-col gap-16 mt-8'>
        <textarea
          rows={1}
          placeholder='Task name'
          defaultValue={title}
          onChange={(e) => {
            handleTitleChange(e.target.value, setFieldValue!);
            e.target.style.height = 'auto';
            e.target.style.height = e.target.scrollHeight + 'px';
          }}
          className='w-full min-h-10 h-auto resize-none outline-none text-2xl font-bold bg-transparent overflow-hidden'
        />
        <div className='flex items-center gap-72 text-sm'>
          <span className='w-24'>Assignee</span>
          {loading ? (
            <Skeleton height={30} width={300} />
          ) : (
            <Select
              placeholder='Select Assignee'
              value={renderAssignee()}
              data={selectData}
              comboboxProps={{
                transitionProps: { transition: 'pop', duration: 200 },
              }}
              onChange={(value) => {
                handleAssigneeChange(value);
              }}
              className='w-[300px]'
            />
          )}
        </div>
        <div className='flex items-center gap-72 text-sm'>
          <span className='w-24'>Priority</span>
          <Select
            placeholder='Select Priority'
            data={priorityOptions}
            value={priority || values.priority}
            className='w-[300px]'
            onChange={(value) => {
              setFieldValue('priority', value);
              debouncedUpdate({ priority: value });
            }}
          />
        </div>
        <div className='flex gap-72 text-sm'>
          <div className='flex gap-24'>
            {loading ? (
              <Skeleton height={30} width={300} />
            ) : (
              <>
                <DateInput
                  label='Start Date'
                  placeholder='Start Date'
                  value={startDate ? new Date(startDate) : undefined}
                  onChange={(value) => {
                    handleDueDateChange(value, true);
                  }}
                />
                <DateInput
                  label='End Date'
                  placeholder='End Date'
                  value={endDate ? new Date(endDate) : undefined}
                  onChange={(value) => {
                    handleDueDateChange(value, false);
                  }}
                />
              </>
            )}
          </div>
        </div>
        <div className='flex flex-col gap-4 text-sm'>
          <span className='text-md'>Description</span>
          <Textarea
            autosize
            placeholder='What is this task about?'
            defaultValue={description}
            minRows={8}
            onChange={(e) => {
              setFieldValue('description', e.target.value);
              debouncedUpdate({ description: e.target.value });
            }}
          />
        </div>
      </div>
      <div className='flex flex-col gap-4 mt-32'>
        <span className='text-xs text-gray-400'>
          Created at {formatDate(createdAt)}.
        </span>
        <span className='text-xs text-gray-400'>
          Updated at {formatDate(updatedAt)}.
        </span>
      </div>
    </div>
  );
};

export default TaskDrawer;
