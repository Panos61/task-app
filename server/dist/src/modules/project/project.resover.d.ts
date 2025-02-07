import type { Project } from './project.model.js';
import type { Context } from '@/index.js';
export declare const projectResolvers: {
    Query: {
        getProjects: (_: never, { ownerID }: {
            ownerID: string;
        }) => Promise<Project[]>;
    };
    Mutation: {
        createProject: (_: any, { input }: {
            input: Project;
        }, context: Context) => Promise<Project>;
    };
};
