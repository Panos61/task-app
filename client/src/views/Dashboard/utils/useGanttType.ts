import type { Task } from '@graphql/task/types';
import type { Task as GanttTask } from 'gantt-task-react';

export const useGanttType = (tasks: Task[] | null): GanttTask[] => {
  if (!tasks) return [];

  const progress = (status: string) => {
    if (status === 'inprogress') return 50;
    if (status === 'done') return 100;
    return 0;
  };

  return tasks.map((task) => {
    // Set default dates if dueDate is undefined or dates are missing
    const startDate = task.dueDate?.startDate ? new Date(task.dueDate.startDate) : new Date();
    const endDate = task.dueDate?.endDate ? new Date(task.dueDate.endDate) : new Date();

    return {
      id: task.id,
      name: task.title,
      start: startDate,
      end: endDate,
      progress: progress(task.status),
      type: 'task',
      styles: {
        progressColor: '#2ECC71',
        progressSelectedColor: '#9B59B6',
        backgroundColor: '#D5D8DC',
      },
    };
  });
};
