import { useEffect, useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router';
import { Button, Divider, Input, Skeleton, ScrollArea } from '@mantine/core';

import type { User, Overview as UserOverview } from '@graphql/user/types';
import type { Project } from '@graphql/project/types';
import { GET_ME, GET_OVERVIEW } from '@graphql/user/queries';
import { GET_PROJECTS } from '@graphql/project/queries';
import { JOIN_PROJECT } from '@graphql/project/mutations';

export const Overview = () => {
  const navigate = useNavigate();

  const [date, setDate] = useState(new Date());
  const [invitation, setInvitation] = useState('');

  const { data } = useQuery(GET_ME);
  const meData: User = data?.me;

  const { data: overviewData, loading: overviewLoading } =
    useQuery(GET_OVERVIEW);
  const overview: UserOverview = overviewData?.overview;
  console.log('overview', overview);

  const { data: projectsData } = useQuery(GET_PROJECTS, {
    variables: { ownerID: meData?.id },
  });
  const projects: Project[] = projectsData?.projects;

  const [joinProject, { loading, error }] = useMutation(JOIN_PROJECT);

  useEffect(() => {
    const interval = setInterval(() => {
      setDate(new Date());
    }, 900000);
    return () => clearInterval(interval);
  }, []);

  const handleJoinProject = () => {
    joinProject({ variables: { invitation } });
  };

  const cardCls = 'flex flex-col gap-12 w-[500px] h-[400px] p-20 border border-gray-400/20 rounded-12';

  return (
    <div className='flex flex-col items-center gap-32 h-full mx-24'>
      <div className='flex flex-col items-center gap-12 mt-48'>
        <span className='text-xl font-bold'>{date.toDateString()}</span>
        <span className='text-3xl font-bold'>
          Welcome {meData?.username} 👋
        </span>
        <div className='flex gap-8 p-20 rounded-3xl bg-gray-700/40'>
          <div className='flex gap-8'>
            <span className='text-lg font-bold'>Projects</span>
            <span className='text-lg font-bold text-text-primary'>
              {overview?.projectCount}
            </span>
          </div>
          <Divider orientation='vertical' />
          <div className='flex gap-8'>
            <span className='text-lg font-bold'>Tasks Assigned</span>
            <span className='text-lg font-bold text-text-primary'>
              {overview?.tasksAssigned}
            </span>
          </div>
          <Divider orientation='vertical' />
          <div className='flex gap-8'>
            <span className='text-lg font-bold'>Collaborators</span>
            <span className='text-lg font-bold text-text-primary'>
              {overview?.collaborators}
            </span>
          </div>
        </div>
      </div>
      <div className='flex items-center gap-12'>
        {overviewLoading ? (
          <Skeleton w={500} h={400} animate={false} />
        ) : (
          <div className={cardCls}>
            <div className='mb-8 text-lg font-bold'>
              My Tasks
              <span className='ml-8 font-bold text-text-primary'>
                {overview?.tasksAssigned}
              </span>
            </div>
            <ScrollArea h={320}>
              <div className='flex flex-col items-center gap-8'>
                {overview.projectCount === 0 && (
                  <span className='text-sm'>No tasks yet.</span>
                )}
                {overview?.tasks.map((task) => (
                  <div
                    key={task.id}
                    className='flex flex-col justify-start gap-12 w-full'
                    onClick={() => navigate(`/dashboard/board/${task.id}`)}
                  >
                    <div className='flex justify-between w-full'>
                      <div className='flex items-center gap-8 w-full p-8 rounded-12 bg-gray-700/20 duration-300 border border-gray-400/20 hover:bg-gray-700/40 cursor-pointer'>
                        <div className='ml-4'>{task.title}</div>
                        <Divider orientation='vertical' />
                        <div className='flex gap-4 text-sm'>
                          <span>status: </span>
                          <span className='font-bold text-green-500'>
                            {task.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
        {overviewLoading ? (
          <Skeleton w={500} h={400} animate={false} />
        ) : (
          <div className={cardCls}>
            <div className='mb-8 text-lg font-bold'>
              My Projects
              <span className='ml-8 font-bold text-text-primary'>
                {projects && projects.length}
              </span>
            </div>
            <ScrollArea h={320}>
              <div className='flex flex-col items-center gap-8'>
                {overview.projectCount === 0 && (
                  <span className='text-sm'>No projects yet.</span>
                )}
                {overview?.projects.map((project) => {
                  return (
                    <div
                      key={project.id}
                      className='flex flex-col justify-start gap-12 w-full'
                      onClick={() => navigate(`/dashboard/board/${project.id}`)}
                    >
                      <div className='flex justify-between w-full'>
                        <div className='flex items-center gap-8 w-full p-8 rounded-12 bg-gray-700/20 duration-300 border border-gray-400/20 hover:bg-gray-700/40 cursor-pointer'>
                          <div
                            className='ml-4 size-16 self-center rounded-4'
                            style={{ backgroundColor: project.color }}
                          />
                          <div>{project.name}</div>
                          <Divider orientation='vertical' />
                          <div className='flex gap-4 text-sm'>
                            <span>Tasks</span>
                            {project.taskCount}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        )}
      </div>
      <div className='flex flex-col gap-12 w-[500px] p-20 border border-gray-400/20 rounded-12'>
        <span className='text-lg font-semibold'>Collaborate in a project</span>
        <span className='text-sm'>
          Enter the project code and it will appear in your project's list.
        </span>
        <Input
          placeholder='Enter the project code..'
          value={invitation}
          onChange={(e) => setInvitation(e.target.value)}
        />
        <Button variant='filled' onClick={handleJoinProject}>
          {loading ? 'Joining project...' : 'Collaborate 💪'}
        </Button>
        {error && <span className='text-red-500'>{error.message}</span>}
      </div>
    </div>
  );
};
