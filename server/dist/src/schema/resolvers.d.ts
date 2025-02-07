export declare const resolvers: {
    Query: {
        task: (_: any, { id }: {
            id: string;
        }) => Promise<import("../modules/task/task.model.js").Task>;
        tasks: (_: any, { projectID }: {
            projectID: string;
        }) => Promise<import("../modules/task/task.model.js").Task[]>;
        getAssignedTasks: (_: any, { assigneeID }: {
            assigneeID: string;
        }) => Promise<import("../modules/task/task.model.js").Task[]>;
        project: (_: never, { projectID }: {
            projectID: string;
        }) => Promise<import("../modules/project/project.model.js").Project>;
        projects: (_: never, { ownerID }: {
            ownerID: string;
        }) => Promise<import("../modules/project/project.model.js").Project[]>;
        me: (_: never, __: never, context: import("../index.js").Context) => Promise<import("../modules/user/user.model.js").User>;
        users: (_: never, { projectID }: {
            projectID: string;
        }, context: import("../index.js").Context) => Promise<import("../modules/user/user.model.js").User[]>;
    };
    Mutation: {
        createTask: (_: any, { input }: {
            input: import("../modules/task/task.model.js").Task;
        }) => Promise<import("../modules/task/task.model.js").Task>;
        updateTask: (_: any, { input }: {
            input: import("../modules/task/task.model.js").Task;
        }) => Promise<import("../modules/task/task.model.js").Task>;
        deleteTask: (_: any, { taskID }: {
            taskID: string;
        }) => Promise<boolean>;
        createProject: (_: any, { input }: {
            input: import("../modules/project/project.model.js").Project;
        }, context: import("../index.js").Context) => Promise<import("../modules/project/project.model.js").Project>;
        joinProject: (_: any, { invitation }: {
            invitation: string;
        }, context: import("../index.js").Context) => Promise<import("../modules/project/project.model.js").Project>;
        deleteProject: (_: any, { projectID }: {
            projectID: string;
        }, context: import("../index.js").Context) => Promise<boolean>;
        register: (_: any, { input }: {
            input: import("../modules/user/user.model.js").RegisterInput;
        }) => Promise<{
            user: import("../modules/user/user.model.js").User;
            token: string;
        }>;
        login: (_: any, { input }: {
            input: import("../modules/user/user.model.js").LoginInput;
        }) => Promise<{
            user: import("../modules/user/user.model.js").User;
            token: string;
        }>;
        logout: (_: any, __: any) => Promise<boolean>;
        deleteAccount: (_: any, __: any, context: import("../index.js").Context) => Promise<boolean>;
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
