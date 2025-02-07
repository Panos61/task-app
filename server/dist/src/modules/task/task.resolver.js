import { TaskService } from './task.service.js';
const taskService = new TaskService();
export const taskResolvers = {
    Query: {
        getTasks: async (_, { projectID }) => {
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
    },
};
