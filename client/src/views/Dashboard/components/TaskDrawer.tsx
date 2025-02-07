import { useEffect, useState } from 'react';
import { useMutation, useQuery, useSubscription } from '@apollo/client';
import { useLocation } from 'react-router';
import { Form, Formik, useFormikContext } from 'formik';
import * as Yup from 'yup';
import { Badge, Divider, Textarea, Skeleton, Select } from '@mantine/core';
import { Check, Trash } from 'lucide-react';

import type { User } from '@graphql/user/types';
import type { Task } from '@graphql/task/types';
import { GET_USERS } from '@graphql/user/queries';
import { UPDATE_TASK, DELETE_TASK } from '@graphql/task/mutations';
import {
  TASK_CREATED_SUBSCRIPTION,
  TASK_UPDATED_SUBSCRIPTION,
} from '@graphql/task/subscriptions';

interface TaskDrawerProps {
  task?: Task;
}

const priorityOptions = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

const taskValidationSchema = Yup.object({
  title: Yup.string().required('Title is required'),
  description: Yup.string(),
  assignee: Yup.string(),
});

const TaskDrawer = ({ task }: TaskDrawerProps) => {
  const { pathname } = useLocation();
  const projectID = pathname.split('/')[3];

  const [selectData, setSelectData] = useState<{ value: string; label: string }[]>([]);
  console.log('selectData', selectData);

  const { values, setFieldValue } = useFormikContext<Task>();
  console.log('task', task);

  const { data, loading } = useQuery(GET_USERS, {
    variables: {
      projectID,
    },
  });

  const users = data?.users;
  
  console.log('values', values);

  useEffect(() => {
    if (users) {
      setSelectData(users.map((user: User) => ({value: user.id, label: user.username})))
    }
  }, [users]);

  useSubscription(TASK_CREATED_SUBSCRIPTION, {
    variables: {
      projectID,
      title: '',
      description: '',
      status: status,
    },
    onData: ({ data }) => {
      console.log('Task created subscription data:', data);
    },
  });

  useSubscription(TASK_UPDATED_SUBSCRIPTION, {
    variables: {
      projectID,
      title: '',
      description: '',
      status: status,
    },
    onData: ({ data }) => {
      console.log('Task updated subscription data:', data);
    },
  });

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
          }
        }
      });
    }
  });

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
      console.log('Deleting task', task.id);
      deleteTask({ variables: { taskID: parseInt(task.id) } });
    }
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
            status: task?.status,
            projectID,
          },
        },
      });
    }, 500);

    return () => clearTimeout(timeoutId);
  };

  return (
    <Formik
      initialValues={{
        title: task?.title || values.title,
        description: task?.description || '',
        assignee: task?.assigneeID || '',
      }}
      validationSchema={taskValidationSchema}
      validateOnChange={true}
      onSubmit={(values) => {
        console.log(values);
      }}
    >
      {({ errors, touched }) => (
        <Form className='flex flex-col w-full'>
          <div>
            <div className='flex gap-8'>
              <div className='flex items-center gap-4 w-[120px] p-4 mb-8 text-xs font-semibold border border-gray-400/20 rounded-4 duration-300 cursor-pointer hover:bg-green-600/15 hover:border-green-600 hover:text-green-600'>
                <Check size={16} />
                Mark complete
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
                defaultValue={task?.title}
                // value={values.title}
                style={{
                  width: '100%',
                  minHeight: '40px',
                  height: 'auto',
                  resize: 'none',
                  outline: 'none',
                  fontSize: '24px',
                  fontWeight: 'bold',
                  backgroundColor: 'transparent',
                  overflow: 'hidden',
                }}
                onChange={(e) => {
                  handleTitleChange(e.target.value, setFieldValue!);
                  e.target.style.height = 'auto';
                  e.target.style.height = e.target.scrollHeight + 'px';
                }}
              />
              {errors.title && touched.title && (
                <span className='text-xs text-red-500'>{errors.title}</span>
              )}
              <div className='flex items-center gap-72 text-sm'>
                <span className='w-24'>Assignee</span>
                {loading ? (
                  <Skeleton height={30} width={300} />
                ) : (
                  <Select
                    data={selectData}
                    value={task?.assigneeID || values.assigneeID} 
                    onChange={(value) => {
                      setFieldValue('assigneeID', value);
                      updateTask({
                        variables: {
                          input: {
                            id: parseInt(task?.id || ''),
                            assigneeID: values.assigneeID,
                          },
                        },
                      });
                    }}
                    comboboxProps={{
                      transitionProps: { transition: 'pop', duration: 200 },
                    }}
                    placeholder='Select Assignee'
                    className='w-[300px]'
                  />
                )}
              </div>
              <div className='flex items-center gap-72 text-sm'>
                <span className='w-24'>Priority</span>
                <Select
                  data={priorityOptions}
                  defaultValue='medium'
                  placeholder='Select Priority'
                  className='w-[300px]'
                  renderOption={({ option }) => (
                    <div className='flex items-center gap-8'>
                      <Badge
                        color={
                          option.value === 'low'
                            ? 'blue'
                            : option.value === 'medium'
                            ? 'yellow'
                            : 'red'
                        }
                        radius='sm'
                      >
                        {option.label}
                      </Badge>
                    </div>
                  )}
                />
              </div>
              <div className='flex flex-col gap-4 text-sm'>
                <span className='text-md'>Description</span>
                <Textarea
                  autosize
                  minRows={8}
                  placeholder='What is this task about?'
                />
              </div>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default TaskDrawer;
