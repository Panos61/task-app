const enum Status {
  BACKLOG = 'BACKLOG',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

const enum Priority {
  Low = 'low',
  Medium = 'medium',
  High = 'high',
}

export interface Task {
  id: string;
  projectID: string;
  assigneeID: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  dueDate: {
    startDate: string;
    endDate: string;
  };
  createdAt: string;
  updatedAt: string;
}