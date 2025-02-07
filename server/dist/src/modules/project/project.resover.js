import { ProjectService } from './project.service.js';
const projectService = new ProjectService();
export const projectResolvers = {
    Query: {
        project: async (_, { projectID }) => {
            return await projectService.getProject(projectID);
        },
        projects: async (_, { ownerID }) => {
            return await projectService.getProjects(ownerID);
        },
    },
    Mutation: {
        createProject: async (_, { input }, context) => {
            if (!context.user) {
                throw new Error('Unauthorized');
            }
            return await projectService.createProject(input.name, input.color, context.user.id);
        },
        joinProject: async (_, { invitation }, context) => {
            if (!context.user) {
                throw new Error('Unauthorized');
            }
            return await projectService.joinProject(invitation, context.user.id);
        },
        deleteProject: async (_, { projectID }, context) => {
            if (!context.user) {
                throw new Error('Unauthorized');
            }
            return await projectService.deleteProject(projectID, context.user.id);
        },
    },
};
