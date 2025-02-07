import type { Project } from './project.model.js';
export declare class ProjectService {
    getProject(projectID: string): Promise<Project>;
    getProjects(ownerID: string): Promise<Project[]>;
    createProject(name: string, color: string, ownerID: string): Promise<Project>;
    joinProject(invitation: string, userID: string): Promise<Project>;
    deleteProject(projectID: string, userID: string): Promise<boolean>;
}
