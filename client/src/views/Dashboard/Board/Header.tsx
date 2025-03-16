import { useQuery } from '@apollo/client';
import { Button, Divider, Skeleton } from '@mantine/core';
import { useClipboard } from '@mantine/hooks';
import { CopyIcon, ChartBarIcon } from 'lucide-react';

import { GET_PROJECT } from '@graphql/project/queries';

interface Props {
  projectID: string;
  renderGantt: boolean;
  setRenderGantt: (renderGantt: boolean) => void;
}

const Header = ({ projectID, renderGantt, setRenderGantt }: Props) => {
  const clipboard = useClipboard({ timeout: 500 });

  const { data: projectData, loading: projectLoading } = useQuery(GET_PROJECT, {
    variables: { projectID },
  });
  const project = projectData?.project;

  if (projectLoading)
    return <Skeleton height={12} mt={12} ml={72} width='16%' radius='xl' />;

  return (
    <div className='flex items-center gap-12 mb-[10px] ml-72'>
      <div className='flex justify-between w-full'>
        <div className='flex gap-8 items-center'>
          <div className='flex gap-8 items-center'>
            <div
              className='size-16 rounded-4'
              style={{ backgroundColor: project?.color }}
            />
            <span className='text-xl font-bold'>{project?.name}</span>
          </div>
          <div
            className='flex gap-8 items-center cursor-pointer'
            onClick={() => {
              clipboard.copy(project?.invitation);
            }}
          >
            {clipboard.copied ? (
              <span className='text-sm text-gray-400/95'>Copied</span>
            ) : (
              <>
                <span className='text-sm text-gray-400/95'>
                  {project?.invitation}
                </span>
                <CopyIcon size={16} className='text-gray-400/95' />
              </>
            )}
          </div>
          <Divider orientation='vertical' />
          <div className='flex gap-4 text-sm text-gray-400/95'>
            <span>Collaborators:</span>
            <span className='font-bold text-text-primary'>
              {project?.collaborators}
            </span>
          </div>
        </div>
        <div className='mr-24 p-0 m-0'>
          <Button
            size='xs'
            variant='light'
            onClick={() => {
              setRenderGantt(!renderGantt);
            }}
          >
            <div className='flex gap-4 items-center'>
              {renderGantt ? 'Hide Gantt Chart' : 'Display Gantt Chart'}
              <ChartBarIcon size={16} />
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Header;
