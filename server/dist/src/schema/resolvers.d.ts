export declare const resolvers: {
    Query: {
        getTasks: (_: any, { projectID }: {
            projectID: string;
        }) => Promise<import("../modules/task/task.model.js").Task[]>;
        getAssignedTasks: (_: any, { assigneeID }: {
            assigneeID: string;
        }) => Promise<import("../modules/task/task.model.js").Task[]>;
        getProjects: (_: never, { ownerID }: {
            ownerID: string;
        }) => Promise<import("../modules/project/project.model.js").Project[]>;
        me: (_: never, __: never, context: import("../index.js").Context) => Promise<import("../modules/user/user.model.js").User>;
    };
    Mutation: {
        createTask: (_: any, { input }: {
            input: import("../modules/task/task.model.js").Task;
        }) => Promise<import("../modules/task/task.model.js").Task>;
        createProject: (_: any, { input }: {
            input: import("../modules/project/project.model.js").Project;
        }, context: import("../index.js").Context) => Promise<import("../modules/project/project.model.js").Project>;
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
};
