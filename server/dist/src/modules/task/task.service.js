import { GraphQLError } from 'graphql';
import pool from '@/utils/database.js';
export class TaskService {
    async createTask(task) {
        const result = await pool.query('INSERT INTO tasks (title, description, status, project_id, assignee_id) VALUES ($1, $2, $3, $4, $5) RETURNING *', [
            task.title,
            task.description,
            task.status,
            task.projectID,
            task.assigneeID,
        ]);
        const createdTask = result.rows[0];
        if (!createdTask) {
            throw new GraphQLError('Failed to create task', {
                extensions: { code: 'BAD_REQUEST', http: { status: 400 } },
            });
        }
        return createdTask;
    }
    async getTasks(projectID) {
        const result = await pool.query('SELECT * FROM tasks WHERE project_id = $1', [projectID]);
        if (!result.rows) {
            throw new GraphQLError('Failed to get tasks', {
                extensions: { code: 'BAD_REQUEST', http: { status: 400 } },
            });
        }
        return result.rows;
    }
    async getAssignedTasks(assigneeID) {
        const result = await pool.query('SELECT * FROM tasks WHERE assignee_id = $1', [assigneeID]);
        if (!result.rows) {
            throw new GraphQLError('Failed to get assigned tasks', {
                extensions: { code: 'BAD_REQUEST', http: { status: 400 } },
            });
        }
        return result.rows;
    }
}
