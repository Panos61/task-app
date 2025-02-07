import type { Project } from './project.model.js';
export declare class ProjectService {
    createProject(name: string, color: string, ownerID: string): Promise<Project>;
    getProjects(ownerID: string): Promise<Project[]>;
}
