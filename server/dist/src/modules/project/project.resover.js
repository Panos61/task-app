import { ProjectService } from './project.service.js';
const projectService = new ProjectService();
export const projectResolvers = {
    Query: {
        getProjects: async (_, { ownerID }) => {
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
    },
};
