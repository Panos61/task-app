import { GraphQLError } from 'graphql';
import type { Task } from './task.model.js';
import pool from '../../utils/database.js';

export class TaskService {
  async getTask(id: string): Promise<Task> {
    const result = await pool.query('SELECT * FROM tasks WHERE id = $1', [id]);

    if (!result.rows[0]) {
      throw new GraphQLError('Task not found', {
        extensions: { code: 'NOT_FOUND', http: { status: 404 } },
      });
    }

    // Get assignee information if assignee_id exists
    let assignee = null;
    if (result.rows[0].assignee_id) {
      const assigneeResult = await pool.query(
        'SELECT id, username, created_at FROM users WHERE id = $1',
        [result.rows[0].assignee_id]
      );
      assignee = assigneeResult.rows[0];
    }

    return {
      id: result.rows[0].id,
      title: result.rows[0].title,
      description: result.rows[0].description,
      status: result.rows[0].status,
      priority: result.rows[0].priority,
      dueDate: {
        startDate: result.rows[0].start_date,
        endDate: result.rows[0].end_date,
      },
      projectID: result.rows[0].project_id,
      assigneeID: result.rows[0].assignee_id,
      assignee,
      createdAt: result.rows[0].created_at,
      updatedAt: result.rows[0].updated_at,
    };
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

    // Get all unique assignee IDs
    const assigneeIDs = [...new Set(result.rows
      .map(row => row.assignee_id)
      .filter(id => id !== null))];

    // Fix: Query for all assignees, not just the first one
    const assigneeResult = assigneeIDs.length > 0 ? 
      await pool.query(
        'SELECT id, username, created_at FROM users WHERE id = ANY($1)',
        [assigneeIDs]
      ) : { rows: [] };

    // Create a map of assignee data
    const assigneeMap = new Map(
      assigneeResult.rows.map(row => [row.id, row])
    );

    return result.rows.map((row) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      status: row.status,
      priority: row.priority,
      dueDate: {
        startDate: row.start_date,
        endDate: row.end_date,
      },
      projectID: row.project_id,
      assigneeID: row.assignee_id,
      assignee: row.assignee_id ? assigneeMap.get(row.assignee_id) : null,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  }

  async createTask(task: Task): Promise<Task> {
    const dueDate = task.dueDate || { startDate: null, endDate: null };

    await pool.query('BEGIN');

    const result = await pool.query(
      'INSERT INTO tasks (title, description, status, priority, start_date, end_date, project_id, assignee_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [
        task.title,
        task.description,
        task.status,
        task.priority,
        dueDate.startDate || null,
        dueDate.endDate || null,
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

    // Get assignee information if assignee_id exists
    let assignee = null;
    if (createdTask.assignee_id) {
      const assigneeResult = await pool.query(
        'SELECT id, username, created_at FROM users WHERE id = $1',
        [createdTask.assignee_id]
      );
      assignee = assigneeResult.rows[0];
    }

    await pool.query('COMMIT');

    return {
      id: createdTask.id,
      title: createdTask.title,
      description: createdTask.description,
      status: createdTask.status,
      priority: createdTask.priority,
      dueDate: {
        startDate: createdTask.start_date,
        endDate: createdTask.end_date,
      },
      projectID: createdTask.project_id,
      assigneeID: createdTask.assignee_id,
      assignee,
      createdAt: createdTask.created_at,
      updatedAt: createdTask.updated_at,
    };
  }

  async updateTask(task: Task): Promise<Task> {
    // Remove parseInt since assigneeID is a UUID
    const assigneeID = task.assigneeID || null;
    const timestamp: string = new Date().toISOString();

    const dueDate = task.dueDate || { startDate: null, endDate: null };

    const result = await pool.query(
      `UPDATE tasks 
        SET title = COALESCE($1, title),
         description = COALESCE($2, description),
         status = COALESCE($3, status),
         priority = COALESCE($4, priority),
         start_date = COALESCE($5, start_date),
         end_date = COALESCE($6, end_date),
         assignee_id = COALESCE($7, assignee_id),
         project_id = COALESCE($8, project_id),
         updated_at = $9
        WHERE id = $10
       RETURNING *`,
      [
        task.title,
        task.description,
        task.status,
        task.priority,
        dueDate.startDate || null,
        dueDate.endDate || null,
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

    // Get assignee information if assignee_id exists
    let assignee = null;
    if (updatedTask.assignee_id) {
      const assigneeResult = await pool.query(
        'SELECT id, username, created_at FROM users WHERE id = $1',
        [updatedTask.assignee_id]
      );
      assignee = assigneeResult.rows[0];
    }

    return {
      id: updatedTask.id,
      title: updatedTask.title,
      description: updatedTask.description,
      status: updatedTask.status,
      priority: updatedTask.priority,
      dueDate: {
        startDate: updatedTask.start_date,
        endDate: updatedTask.end_date,
      },
      projectID: updatedTask.project_id,
      assigneeID: updatedTask.assignee_id,
      assignee,
      createdAt: updatedTask.created_at,
      updatedAt: updatedTask.updated_at,
    };
  }

  async deleteTask(taskID: string): Promise<boolean> {
    await pool.query('BEGIN');

    const taskResult = await pool.query(
      'SELECT project_id FROM tasks WHERE id = $1',
      [taskID]
    );
    
    if (!taskResult.rows[0]) {
      throw new GraphQLError('Task not found', {
        extensions: { code: 'NOT_FOUND', http: { status: 404 } },
      });
    }
    
    const projectID = taskResult.rows[0].project_id;
    
    // Delete the task
    const result = await pool.query('DELETE FROM tasks WHERE id = $1', [taskID]);

    if (!result.rowCount) {
      await pool.query('ROLLBACK');
      throw new GraphQLError('Failed to delete task', {
        extensions: { code: 'BAD_REQUEST', http: { status: 400 } },
      });
    }

    // Decrement the project's task count
    await pool.query(
      'UPDATE projects SET task_count = task_count - 1 WHERE id = $1',
      [projectID]
    );

    await pool.query('COMMIT');
    return true;
  }
}
