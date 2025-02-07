// import { GraphQLError } from 'graphql';
import type { Project } from './project.model.js';
import type { Context } from '@/index.js';
import { ProjectService } from './project.service.js';

const projectService = new ProjectService();

export const projectResolvers = {
  Query: {
    project: async (_: never, { projectID }: { projectID: string }) => {
      return await projectService.getProject(projectID);
    },
    getOwnProjects: async (_: never, { ownerID }: { ownerID: string }) => {
      return await projectService.getOwnProjects(ownerID);
    },
    getProjects: async (_: never, __: any, context: Context) => {
      if (!context.user) {
        throw new Error('Unauthorized');
      }

      return await projectService.getProjects(context.user.id);
    },
  },
  Mutation: {
    createProject: async (
      _: any,
      { input }: { input: Project },
      context: Context
    ) => {
      if (!context.user) {
        throw new Error('Unauthorized');
      }

      return await projectService.createProject(
        input.name,
        input.color,
        context.user.id
      );
    },
    joinProject: async (
      _: any,
      { invitation }: { invitation: string },
      context: Context
    ) => {
      if (!context.user) {
        throw new Error('Unauthorized');
      }

      return await projectService.joinProject(invitation, context.user.id);
    },
    deleteProject: async (_: any, { projectID }: { projectID: string }, context: Context) => {
      if (!context.user) {
        throw new Error('Unauthorized');
      }

      return await projectService.deleteProject(projectID, context.user.id);
    },
  },
};
