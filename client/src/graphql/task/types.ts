export interface Task {
  id: string;
  projectID: string;
  assigneeID: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}