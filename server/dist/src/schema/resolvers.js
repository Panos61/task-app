import { userResolvers } from '@/modules/user/user.resolver.js';
import { projectResolvers } from '@/modules/project/project.resover.js';
import { taskResolvers } from '@/modules/task/task.resolver.js';
export const resolvers = {
    Query: {
        ...userResolvers.Query,
        ...projectResolvers.Query,
        ...taskResolvers.Query,
    },
    Mutation: {
        ...userResolvers.Mutation,
        ...projectResolvers.Mutation,
        ...taskResolvers.Mutation,
    },
    Subscription: {
        ...taskResolvers.Subscription,
    },
};
