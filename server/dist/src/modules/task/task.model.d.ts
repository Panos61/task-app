declare enum TaskStatus {
    BACKLOG = "BACKLOG",
    IN_PROGRESS = "IN_PROGRESS",
    DONE = "DONE"
}
export interface Task {
    id: string;
    projectID: string;
    assigneeID: string;
    title: string;
    description: string;
    status: TaskStatus;
    createdAt: Date;
    updatedAt: Date;
}
export {};
