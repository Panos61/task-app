import { useNavigate } from 'react-router';
import { Button, Divider } from '@mantine/core';
import { GitBranchIcon } from 'lucide-react';

export const Home = () => {
  const navigate = useNavigate();

  const handleRegisterCTA = () => {
    navigate('/auth', { state: { isRegistering: true } });
  };

  return (
    <div className='flex flex-col items-center justify-center h-screen bg-cover bg-fixed'>
      <p className='text-2xl font-bold mb-24'>Welcome to Task Management App</p>

      <div className='flex flex-col items-center gap-12 w-[500px] p-24 border bg-custom-bg border-gray-400 rounded-12'>
        <div className='flex flex-col items-center gap-8'>
          <p className='text-xs text-text-primary'>
            Start managing your task board.
          </p>
          <Button onClick={() => navigate('/auth')}>
            Proceed To Dashboard
          </Button>
          <p className='text-xs'>
            You will be asked to authorize your account.
          </p>

          <span className='text-xs'>
            Don't have an account?{' '}
            <a
              className='underline text-text-primary cursor-pointer'
              onClick={handleRegisterCTA}
            >
              Register
            </a>
          </span>
        </div>
        <Divider className='w-full opacity-40' />
        <div className='flex items-center gap-4 ease-in-out duration-300 hover:text-gray-400'>
          <a
            className='text-sm underline'
            href='https://github.com/Panos61'
            target='_blank'
          >
            Github Repository
          </a>
          <GitBranchIcon size={16} />
        </div>
      </div>
    </div>
  );
};
