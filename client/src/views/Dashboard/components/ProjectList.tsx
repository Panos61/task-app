import { useRef } from 'react';
import { useMutation } from '@apollo/client';
import { useNavigate, useLocation } from 'react-router';
import { useDisclosure } from '@mantine/hooks';
import { Button, Divider, Modal } from '@mantine/core';
import { useHover } from 'usehooks-ts';
import { Trash } from 'lucide-react';

import type { Project } from '@graphql/project/types';
import { DELETE_PROJECT } from '@graphql/project/mutations';

interface Props {
  project: Project;
}

const ProjectCard = ({ project }: Props) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const hoverRef = useRef(null);
  const isHover = useHover(hoverRef);
  const [opened, { open, close }] = useDisclosure(false);

  const [deleteProject, { loading }] = useMutation(DELETE_PROJECT, {
    update(cache) {
      cache.modify({
        fields: {
          projects(existingProjects = []) {
            return existingProjects.filter((projRef: { __ref: string }) => {
              const projId = cache.identify({
                id: project.id,
                __typename: 'Project',
              });
              return projRef.__ref !== projId;
            });
          },
        },
      });
    },
    onCompleted: () => {
      navigate('/dashboard');
    },
  });

  const projectID = pathname.split('/')[3];

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
            Data related to this project will be deleted!
          </span>
          <Button
            color='red'
            className='w-[160px] self-center'
            onClick={() => deleteProject({ variables: { projectID } })}
          >
            {loading ? 'Deleting Project..' : 'Delete Project'}
          </Button>
        </div>
      </Modal>
    );
  };

  return (
    <>
      {renderDeletionModal()}
      <div
        ref={hoverRef}
        className='flex items-center gap-8 p-12 my-8 border border-gray-400/20 rounded-12 cursor-pointer duration-300 hover:bg-gray-400/25'
        onClick={() => navigate(`board/${project.id}`)}
      >
        <div
          className='size-16 rounded-4'
          style={{ backgroundColor: project.color }}
        />
        <h3>{project.name}</h3>
        <Divider orientation='vertical' />
        <span className='text-xs'>
          Tasks: <span className='font-bold text-text-primary'>{project.taskCount}</span>
        </span>
        {isHover && (
          <Trash
            size={16}
            className='absolute right-24 text-red-500 z-50 duration-150 hover:text-red-600'
            onClick={open}
          />
        )}
      </div>
    </>
  );
};

const ProjectList = ({ projects }: { projects: Project[] }) => {
  return (
    <div>
      {projects &&
        projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
    </div>
  );
};

export default ProjectList;
