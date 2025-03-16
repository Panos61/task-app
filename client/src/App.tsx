import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';

import { createBrowserRouter, RouterProvider } from 'react-router';
import { MantineProvider } from '@mantine/core';
import { theme } from './theme';
import { Auth, Home, Dashboard } from './views';
import {
  CreateProject,
  Overview,
  Settings,
} from '@views/Dashboard';
import BoardSectionList from '@views/Dashboard/Board/BroadSectionList'

/**
 * @file App.tsx
 * @description Defines the routing structure for the application using React Router.
 */

const App = () => {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Home />,
    },
    {
      path: '/auth',
      element: <Auth />,
    },
    {
      path: '/dashboard',
      element: <Dashboard />,
      children: [
        {
          index: true,
          element: <Overview />,
        },
        { path: 'create-project', element: <CreateProject /> },
        { path: 'board/:id', element: <BoardSectionList /> },
        { path: 'settings', element: <Settings /> },
      ],
    },
  ]);

  return (
    <MantineProvider theme={theme} defaultColorScheme='dark'>
      <RouterProvider router={router} />
    </MantineProvider>
  );
};

export default App;
