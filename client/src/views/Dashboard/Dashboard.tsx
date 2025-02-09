import { useQuery } from '@apollo/client';
import { Outlet, useNavigate } from 'react-router';
import {
  AppShell,
  Burger,
  Group,
  ScrollArea,
  Divider,
  Button,
  Skeleton,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { LayoutDashboardIcon, PlusIcon } from 'lucide-react';

import { GET_ME } from '@graphql/user/queries';
import { GET_PROJECTS } from '@graphql/project/queries';
import { ProjectList, UserAccount } from './components';

export const Dashboard = () => {
  const navigate = useNavigate();
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(false);

  const { data } = useQuery(GET_ME);
  const meData = data?.me;

  const { data: projectsData, loading: projectsLoading } = useQuery(GET_PROJECTS, {
    variables: { ownerID: meData?.id },
  });
  const projects = projectsData?.projects;

  const renderProjectList = () => {
    if (projectsLoading)
      return Array(15)
        .fill(0)
        .map((_, index) => (
          <Skeleton key={index} h={28} mt='sm' animate={false} />
        ));

    if (projects && projects.length > 0) {
      return <ProjectList projects={projects} />;
    }

    return <span className='text-xs font-semibold'>No projects yet.</span>;
  };

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
      }}
      padding='md'
    >
      <AppShell.Header>
        <Group h='100%' px='md'>
          <Burger
            opened={mobileOpened}
            size='sm'
            hiddenFrom='sm'
            onClick={toggleMobile}
          />
          <Burger
            opened={desktopOpened}
            size='sm'
            visibleFrom='sm'
            onClick={toggleDesktop}
          />
          <div className='flex items-center gap-4'>
            <h1
              className='text-xl font-bold text-text-primary cursor-pointer'
              onClick={() => navigate('/dashboard')}
            >
              Dashboard
            </h1>
            <LayoutDashboardIcon size={20} className='text-text-primary' />
          </div>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p='md' className='flex flex-col justify-between'>
        <AppShell.Section component={ScrollArea}>
          <div className='flex flex-col gap-8'>
            <div className='flex items-center gap-12'>
              <span className='font-bold'>Projects</span>
              <Button
                variant='outline'
                size='xs'
                radius='xl'
                onClick={() => navigate('create-project')}
              >
                <div className='flex items-center gap-4'>
                  Create New
                  <PlusIcon size={16} />
                </div>
              </Button>
            </div>
            <Divider />
          </div>
          <div className='flex flex-col gap-4 mt-16'>{renderProjectList()}</div>
        </AppShell.Section>
        <AppShell.Section>
          <div className='flex flex-col gap-12 mt-12'>
            <Divider />
            <UserAccount userData={meData} />
          </div>
        </AppShell.Section>
      </AppShell.Navbar>
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
};
