import { withFilter } from 'graphql-subscriptions';
import { TaskService } from './task.service.js';
import { pubsub } from '@/utils/pubsub.js';
import { EVENTS } from '@/utils/pubsub.js';
const taskService = new TaskService();
export const taskResolvers = {
    Query: {
        task: async (_, { id }) => {
            return await taskService.getTask(id);
        },
        tasks: async (_, { projectID }) => {
            return await taskService.getTasks(projectID);
        },
        getAssignedTasks: async (_, { assigneeID }) => {
            return await taskService.getAssignedTasks(assigneeID);
        },
    },
    Mutation: {
        createTask: async (_, { input }) => {
            return await taskService.createTask(input);
        },
        updateTask: async (_, { input }) => {
            return await taskService.updateTask(input);
        },
        deleteTask: async (_, { taskID }) => {
            return await taskService.deleteTask(taskID);
        },
    },
    Subscription: {
        taskCreated: {
            subscribe: withFilter(() => pubsub.asyncIterableIterator([EVENTS.TASK_CREATED]), (payload, variables) => {
                return payload.taskCreated.projectID === variables.projectID;
            }),
        },
        taskUpdated: {
            subscribe: withFilter(() => pubsub.asyncIterableIterator([EVENTS.TASK_UPDATED]), (payload, variables) => {
                return payload.taskUpdated.projectID === variables.projectID;
            }),
        },
        taskDeleted: {
            subscribe: withFilter(() => pubsub.asyncIterableIterator([EVENTS.TASK_DELETED]), (payload, variables) => {
                return payload.id === variables.id;
            }),
        },
    },
};
