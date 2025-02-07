import { GraphQLError } from 'graphql';
import { UserService } from './user.service.js';
const userService = new UserService();
export const userResolvers = {
    Query: {
        me: async (_, __, context) => {
            if (!context.user) {
                throw new GraphQLError('Not authenticated', {
                    extensions: { code: 'UNAUTHENTICATED', http: { status: 401 } },
                });
            }
            return await userService.me(context.user.id);
        },
        users: async (_, { projectID }, context) => {
            if (!context.user) {
                throw new GraphQLError('Not authenticated', {
                    extensions: { code: 'UNAUTHENTICATED', http: { status: 401 } },
                });
            }
            return await userService.getUsers(projectID);
        },
    },
    Mutation: {
        register: async (_, { input }) => {
            return await userService.register(input.username, input.password);
        },
        login: async (_, { input }) => {
            return await userService.login(input.username, input.password);
        },
        logout: async (_, __) => {
            return await userService.logout();
        },
        deleteAccount: async (_, __, context) => {
            if (!context.user) {
                throw new Error('Unauthorized');
            }
            return await userService.deleteAccount(context.user.id);
        },
    },
};
