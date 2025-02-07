import type { Task } from './task.model.js';
export declare const taskResolvers: {
    Query: {
        task: (_: any, { id }: {
            id: string;
        }) => Promise<Task>;
        tasks: (_: any, { projectID }: {
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
        updateTask: (_: any, { input }: {
            input: Task;
        }) => Promise<Task>;
        deleteTask: (_: any, { taskID }: {
            taskID: string;
        }) => Promise<boolean>;
    };
    Subscription: {
        taskCreated: {
            subscribe: import("graphql-subscriptions").IterableResolverFn<any, any, any>;
        };
        taskUpdated: {
            subscribe: import("graphql-subscriptions").IterableResolverFn<any, any, any>;
        };
        taskDeleted: {
            subscribe: import("graphql-subscriptions").IterableResolverFn<any, any, any>;
        };
    };
};
