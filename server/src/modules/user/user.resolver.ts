import { GraphQLError } from 'graphql';
import type { Context } from '@/index.js';
import type { LoginInput, RegisterInput } from './user.model.js';
import { UserService } from './user.service.js';

const userService = new UserService();

export const userResolvers = {
  Query: {
    me: async (_: never, __: never, context: Context) => {
      if (!context.user) {
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'UNAUTHENTICATED', http: { status: 401 } },
        });
      }
      return await userService.me(context.user.id);
    },
    users: async (_: never, { projectID }: { projectID: string }, context: Context) => {
      if (!context.user) {
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'UNAUTHENTICATED', http: { status: 401 } },
        });
      }

      return await userService.getUsers(projectID);
    },
  },
  Mutation: {
    register: async (_: any, { input }: { input: RegisterInput }) => {
      return await userService.register(input.username, input.password);
    },
    login: async (_: any, { input }: { input: LoginInput }) => {
      return await userService.login(input.username, input.password);
    },
    logout: async (_: any, __: any) => {
      return await userService.logout();
    },
    deleteAccount: async (_: any, __: any, context: Context) => {
      if (!context.user) {
        throw new Error('Unauthorized');
      }

      return await userService.deleteAccount(context.user.id);
    },
  },
};
