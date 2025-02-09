import { withFilter } from 'graphql-subscriptions';
import type { Task } from './task.model.js';
import { TaskService } from './task.service.js';
import { pubsub } from '@/utils/pubsub.js';
import { EVENTS } from '@/utils/pubsub.js';

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
  Subscription: {
    taskCreated: {
      subscribe: withFilter(
        () => pubsub.asyncIterableIterator([EVENTS.TASK_CREATED]),
        (payload, variables) => {
          return payload.taskCreated.projectID === variables.projectID;
        }
      ),
    },
    taskUpdated: {
      subscribe: withFilter(
        () => pubsub.asyncIterableIterator([EVENTS.TASK_UPDATED]),
        (payload, variables) => {
          return payload.taskUpdated.projectID === variables.projectID;
        }
      ),
    },
    taskDeleted: {
      subscribe: withFilter(
        () => pubsub.asyncIterableIterator([EVENTS.TASK_DELETED]),
        (payload, variables) => {
          return payload.id === variables.id;
        }
      ),
    },
  },
};
