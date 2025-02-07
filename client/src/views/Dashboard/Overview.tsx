import { useEffect, useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Button, Divider, Input } from '@mantine/core';
import { GET_ME } from '@graphql/user/queries';
import { JOIN_PROJECT } from '@graphql/project/mutations';

export const Overview = () => {
  const [date, setDate] = useState(new Date());
  const [invitation, setInvitation] = useState('');
  
  const { data } = useQuery(GET_ME);
  const meData = data?.me;

  const [joinProject, { loading, error }] = useMutation(JOIN_PROJECT);

  useEffect(() => {
    const interval = setInterval(() => {
      setDate(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleJoinProject = () => {
    joinProject({ variables: { invitation } });
  };

  const cardCls =
    'flex flex-col items-center gap-12 w-[500px] p-20 border border-gray-400/20 rounded-12';

  return (
    <div className='flex flex-col items-center gap-32 h-full'>
      <div className='flex flex-col items-center gap-12 mt-48'>
        <span className='text-xl font-bold'>{date.toDateString()}</span>
        <span className='text-3xl font-bold'>
          Welcome, {meData?.username} 👋
        </span>
        <div className='flex gap-8 p-20 rounded-3xl bg-gray-700/40'>
          <div className='flex gap-8'>
            <span className='text-lg font-bold'>Tasks Assigned</span>
            <span className='text-lg font-bold text-text-primary'>2</span>
          </div>
          <Divider orientation='vertical' />
          <div className='flex gap-8'>
            <span className='text-lg font-bold'>Tasks Completed</span>
            <span className='text-lg font-bold text-text-primary'>0</span>
          </div>
          <Divider orientation='vertical' />
          <div className='flex gap-8'>
            <span className='text-lg font-bold'>Collaborators</span>
            <span className='text-lg font-bold text-text-primary'>3</span>
          </div>
        </div>
      </div>
      <div className={cardCls}>
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
      <div className={cardCls}>
        <div className='flex flex-col items-center gap-8'>
          <span className='text-lg font-bold'>My Tasks</span>
          <span className='text-lg font-bold text-text-primary'>2</span>
        </div>
      </div>
    </div>
  );
};
