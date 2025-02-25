import type { Project } from '@graphql/project/types';
import type { Task } from '@graphql/task/types';

export interface User {
  id: string;
  username: string;
  password: string;
  created_at: string;
}

export interface Overview {
  id: string;
  projectCount: number;
  taskCount: number;
  tasksCompleted: number;
  tasksAssigned: number;
  collaborators: number;
  projects: Project[];
  tasks: Task[];
}