import type { Project } from '../project/project.model.js';
import type { Task } from '../task/task.model.js';

export interface User {
  id: string;
  username: string;
  password: string;
  createdAt: string;
}

export interface Overview {
  id: string;
  projectCount: number;
  tasksCompleted: number;
  tasksAssigned: number;
  collaborators: number;
  projects: Project[];
  tasks: Task[];
}

export interface RegisterInput {
  username: string;
  password: string;
}

export interface LoginInput {
  username: string;
  password: string;
}

export interface AuthPayload {
  token: string;
  user: User;
}
