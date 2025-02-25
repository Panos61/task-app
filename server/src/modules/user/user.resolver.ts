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
    users: async (
      _: never,
      { projectID }: { projectID: string },
      context: Context
    ) => {
      if (!context.user) {
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'UNAUTHENTICATED', http: { status: 401 } },
        });
      }

      return await userService.getUsers(projectID);
    },
    overview: async (_: never, __: never, context: Context) => {
      if (!context.user) {
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'UNAUTHENTICATED', http: { status: 401 } },
        });
      }

      return await userService.getOverview(context.user.id);
    },
  },
  Mutation: {
    register: async (
      _: any,
      { input }: { input: RegisterInput },
      { res }: Context
    ) => {
      return await userService.register(input.username, input.password, res);
    },
    login: async (
      _: any,
      { input }: { input: LoginInput },
      { res }: Context
    ) => {
      return await userService.login(input.username, input.password, res);
    },
    logout: async (_: any, __: any, { res }: Context) => {
      return await userService.logout(res);
    },
    deleteAccount: async (_: any, __: any, context: Context) => {
      if (!context.user) {
        throw new Error('Unauthorized');
      }

      return await userService.deleteAccount(context.user.id);
    },
  },
};
