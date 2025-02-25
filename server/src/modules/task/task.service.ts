import { GraphQLError } from 'graphql';
import type { Task } from './task.model.js';
import pool from '@/utils/database.js';

export class TaskService {
  async getTask(id: string): Promise<Task> {
    const result = await pool.query('SELECT * FROM tasks WHERE id = $1', [id]);
    if (!result.rows) {
      throw new GraphQLError('Task not found', {
        extensions: { code: 'NOT_FOUND', http: { status: 404 } },
      });
    }

    return result.rows[0];
  }

  async getTasks(projectID: string): Promise<Task[]> {
    const result = await pool.query(
      'SELECT * FROM tasks WHERE project_id = $1',
      [projectID]
    );
    if (!result.rows) {
      throw new GraphQLError('Failed to get tasks', {
        extensions: { code: 'BAD_REQUEST', http: { status: 400 } },
      });
    }

    return result.rows;
  }

  async createTask(task: Task): Promise<Task> {
    await pool.query('BEGIN');

    const result = await pool.query(
      'INSERT INTO tasks (title, description, status, priority, project_id, assignee_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [
        task.title,
        task.description,
        task.status,
        task.priority,
        task.projectID,
        task.assigneeID || null,
      ]
    );

    const createdTask = result.rows[0];
    if (!createdTask) {
      throw new GraphQLError('Failed to create task', {
        extensions: { code: 'BAD_REQUEST', http: { status: 400 } },
      });
    }

    await pool.query(
      'UPDATE projects SET task_count = task_count + 1 WHERE id = $1',
      [task.projectID]
    );

    await pool.query('COMMIT');

    return {
      id: createdTask.id,
      title: createdTask.title,
      description: createdTask.description,
      status: createdTask.status,
      priority: createdTask.priority,
      projectID: createdTask.project_id,
      assigneeID: createdTask.assignee_id,
      createdAt: createdTask.created_at,
      updatedAt: createdTask.updated_at,
    };
  }

  async updateTask(task: Task): Promise<Task> {
    const assigneeID = task.assigneeID ? parseInt(task.assigneeID) : null;
    const timestamp: string = new Date().toISOString();

    const result = await pool.query(
      `UPDATE tasks 
        SET title = COALESCE($1, title),
         description = COALESCE($2, description),
         status = COALESCE($3, status),
         priority = COALESCE($4, priority),
         assignee_id = COALESCE($5, assignee_id),
         project_id = COALESCE($6, project_id),
         updated_at = $7
        WHERE id = $8
       RETURNING *`,
      [
        task.title,
        task.description,
        task.status,
        task.priority,
        assigneeID,
        task.projectID,
        timestamp,
        task.id,
      ]
    );

    const updatedTask = result.rows[0];
    if (!updatedTask) {
      throw new GraphQLError('Task not found', {
        extensions: { code: 'NOT_FOUND', http: { status: 404 } },
      });
    }

    return {
      id: updatedTask.id,
      title: updatedTask.title,
      description: updatedTask.description,
      status: updatedTask.status,
      priority: updatedTask.priority,
      projectID: updatedTask.project_id,
      assigneeID: updatedTask.assignee_id,
      createdAt: updatedTask.created_at,
      updatedAt: updatedTask.updated_at,
    };
  }

  async deleteTask(taskID: string): Promise<boolean> {
    const result = await pool.query('DELETE FROM tasks WHERE id = $1', [
      taskID,
    ]);

    if (!result.rowCount) {
      throw new GraphQLError('Failed to delete task', {
        extensions: { code: 'BAD_REQUEST', http: { status: 400 } },
      });
    }

    return true;
  }
}
