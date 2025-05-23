import { useQuery } from '@apollo/client';
import { useDisclosure } from '@mantine/hooks';
import { Button, Divider, Modal, Skeleton } from '@mantine/core';

import type { Overview } from '@graphql/user/types';
import { GET_ME, GET_OVERVIEW } from '@graphql/user/queries';

export const Settings = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const { data } = useQuery(GET_ME, {
    fetchPolicy: 'cache-only',
  });
  const meData = data?.me;

  const { data: overviewData, loading: overviewLoading } =
    useQuery(GET_OVERVIEW);
  const overview: Overview = overviewData?.overview;

  const formatDate = (timestamp: string) => {
    const date = new Date(Number(timestamp));
    return date.toLocaleDateString('en-GB');
  };

  const renderDeletionModal = () => {
    return (
      <Modal
        opened={opened}
        onClose={close}
        title={<span className='font-bold'>Are you sure?</span>}
        centered
      >
        <div className='flex flex-col gap-8'>
          <span className='text-sm font-bold text-rose-500'>
            Data related to your user account will be deleted!
          </span>
          <Button color='red' className='w-[160px] self-center'>
            Delete Account
          </Button>
        </div>
      </Modal>
    );
  };

  return (
    <>
      {renderDeletionModal()}
      <div className='flex flex-col items-center gap-12 mt-36'>
        <div className='flex flex-col items-center justify-center h-full w-[500px] p-24 border border-gray-500/40 rounded-12'>
          <div className='flex flex-col gap-12 text-center'>
            <h3 className='text-2xl font-bold'>Settings</h3>
            <p className='text-md'>
              You can manage your account settings here.
            </p>
          </div>
          <div className='flex flex-col gap-12 w-full mt-24'>
            <span className='text-xl font-bold'>User Account</span>
            <div className='flex gap-12'>
              <span>{meData?.username}</span>
              <Divider orientation='vertical' />
              <p className='text-md'>
                Account created at{' '}
                <span className='font-bold'>
                  {formatDate(meData?.created_at)}
                </span>
                .
              </p>
            </div>
            <div>
              <Button
                type='button'
                color='red'
                className='w-auto'
                onClick={open}
              >
                Delete Account
              </Button>
            </div>
            <p className='text-xs font-bold text-red-500'>
              Warning: Deleting your user account will delete all the
              project/task data you are owner of.
            </p>
            <Divider />
            <span className='text-xl font-bold'>Basic Info</span>
            <div className='flex gap-8 text-center'>
              <span className='font-bold'>
                Your Projects:{' '}
                {overviewLoading ? (
                  <Skeleton w={36} h={8} mt={4} ml={28} />
                ) : (
                  <span className='font-bold text-green-500'>
                    {overview.projectCount}
                  </span>
                )}
              </span>
              <Divider orientation='vertical' />
              <span className='font-bold'>
                Tasks Assigned:{' '}
                {overviewLoading ? (
                  <Skeleton w={36} h={8} mt={4} ml={28} />
                ) : (
                  <span className='font-bold text-text-primary'>
                    {overview.tasksAssigned}
                  </span>
                )}
              </span>
              <Divider orientation='vertical' />
              <span className='font-bold'>
                Collaborating with:{' '}
                {overviewLoading ? (
                  <Skeleton w={36} h={8} mt={4} ml={28} />
                ) : (
                  <span className='font-bold text-yellow-500'>
                    {overview.collaborators}
                  </span>
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
