import type { Task } from './task.model.js';
export declare const taskResolvers: {
    Query: {
        getTasks: (_: any, { projectID }: {
            projectID: string;
        }) => Promise<Task[]>;
        getAssignedTasks: (_: any, { assigneeID }: {
            assigneeID: string;
        }) => Promise<Task[]>;
    };
    Mutation: {
        createTask: (_: any, { input }: {
            input: Task;
        }) => Promise<Task>;
    };
};
