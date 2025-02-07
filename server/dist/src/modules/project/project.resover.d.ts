import type { Project } from './project.model.js';
import type { Context } from '@/index.js';
export declare const projectResolvers: {
    Query: {
        project: (_: never, { projectID }: {
            projectID: string;
        }) => Promise<Project>;
        projects: (_: never, { ownerID }: {
            ownerID: string;
        }) => Promise<Project[]>;
    };
    Mutation: {
        createProject: (_: any, { input }: {
            input: Project;
        }, context: Context) => Promise<Project>;
        joinProject: (_: any, { invitation }: {
            invitation: string;
        }, context: Context) => Promise<Project>;
        deleteProject: (_: any, { projectID }: {
            projectID: string;
        }, context: Context) => Promise<boolean>;
    };
};
