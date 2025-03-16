export interface Task {
  id: string;
  projectID: string;
  assigneeID: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  dueDate: {
    startDate: string;
    endDate: string;
  };
  createdAt: string;
  updatedAt: string;
}