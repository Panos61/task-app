import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router';
import { Menu, Avatar } from '@mantine/core';

import type { User } from '@graphql/user/types';
import { LOGOUT } from '@graphql/user/mutations';

const UserAccount = ({ userData }: { userData: User }) => {
  const navigate = useNavigate();
  const [logout, { loading }] = useMutation(LOGOUT);

  const handleLogout = () => {
    logout({ context: { credentials: 'include' }})
      .then(() => {
        navigate('/');
      })
      .finally(() => {
        navigate('/');
      });
  };

  return (
    <Menu shadow='md' width={200}>
      <Menu.Target>
        <div className='flex items-center gap-12 p-8 rounded-8 cursor-pointer duration-300 ease-in-out hover:bg-gray-700/40'>
          <Avatar src='https://github.com/joe-p.png' />
          <span className='text-sm font-bold'>{userData?.username}</span>
        </div>
      </Menu.Target>
      <Menu.Dropdown> 
        <Menu.Item onClick={() => navigate('settings')}>Settings</Menu.Item>
        <Menu.Divider />
        <Menu.Item color='red' onClick={handleLogout}>
          {loading ? 'Logging out...' : 'Logout'}
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default UserAccount;
