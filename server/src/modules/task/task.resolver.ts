import type { Task } from './task.model.js';
import { TaskService } from './task.service.js';

const taskService = new TaskService();

export const taskResolvers = {
  Query: {
    task: async (_: any, { id }: { id: string }) => {
      return await taskService.getTask(id);
    },
    tasks: async (_: any, { projectID }: { projectID: string }) => {
      return await taskService.getTasks(projectID);
    },
  },
  Mutation: {
    createTask: async (_: any, { input }: { input: Task }) => {
      return await taskService.createTask(input);
    },
    updateTask: async (_: any, { input }: { input: Task }) => {
      return await taskService.updateTask(input);
    },
    deleteTask: async (_: any, { taskID }: { taskID: string }) => {
      return await taskService.deleteTask(taskID);
    },
  },
};
