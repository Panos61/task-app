import type { Task } from './task.model.js';
export declare class TaskService {
    createTask(task: Task): Promise<Task>;
    getTasks(projectID: string): Promise<Task[]>;
    getAssignedTasks(assigneeID: string): Promise<Task[]>;
}
