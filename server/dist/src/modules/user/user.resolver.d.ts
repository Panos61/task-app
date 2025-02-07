import type { Context } from '@/index.js';
import type { LoginInput, RegisterInput } from './user.model.js';
export declare const userResolvers: {
    Query: {
        me: (_: never, __: never, context: Context) => Promise<import("./user.model.js").User>;
        users: (_: never, { projectID }: {
            projectID: string;
        }, context: Context) => Promise<import("./user.model.js").User[]>;
    };
    Mutation: {
        register: (_: any, { input }: {
            input: RegisterInput;
        }) => Promise<{
            user: import("./user.model.js").User;
            token: string;
        }>;
        login: (_: any, { input }: {
            input: LoginInput;
        }) => Promise<{
            user: import("./user.model.js").User;
            token: string;
        }>;
        logout: (_: any, __: any) => Promise<boolean>;
        deleteAccount: (_: any, __: any, context: Context) => Promise<boolean>;
    };
};
