import type { Task } from './task.model.js';
export declare class TaskService {
    getTask(id: string): Promise<Task>;
    getTasks(projectID: string): Promise<Task[]>;
    getAssignedTasks(assigneeID: string): Promise<Task[]>;
    createTask(task: Task): Promise<Task>;
    updateTask(task: Task): Promise<Task>;
    deleteTask(taskID: string): Promise<boolean>;
}
