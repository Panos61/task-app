import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { GraphQLError } from 'graphql';
import type { User, Overview } from './user.model.js';
import type { Task } from '@/modules/task/task.model.js';
import pool from '@/utils/database.js';

export class UserService {
  async me(userID: string): Promise<User> {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [
      userID,
    ]);

    const user = result.rows[0];
    if (!user) {
      throw new GraphQLError('User not found', {
        extensions: { code: 'NOT_FOUND', http: { status: 404 } },
      });
    }

    return user;
  }

  async getUsers(projectID: string): Promise<User[]> {
    const result = await pool.query(
      'SELECT * FROM users INNER JOIN project_users ON users.id = project_users.user_id WHERE project_users.project_id = $1',
      [projectID]
    );

    const users = result.rows;
    return users.map((user) => ({
      ...user,
      id: user.user_id,
      username: user.username,
      createdAt: user.createdAt,
    }));
  }

  async getOverview(userID: string): Promise<Overview> {
    if (!userID) {
      throw new GraphQLError('User not found', {
        extensions: { code: 'NOT_FOUND', http: { status: 404 } },
      });
    }

    const projectsResult = await pool.query(
      'SELECT projects.* FROM projects LEFT JOIN project_users ON projects.id = project_users.project_id WHERE project_users.user_id = $1',
      [userID]
    );
    const projects = projectsResult.rows;

    const tasksResult = await pool.query(
      'SELECT * FROM tasks WHERE assignee_id = $1',
      [userID]
    );
    const tasks: Task[] = tasksResult.rows;
    const taskCompleted: number = tasks.filter(
      (task: Task) => task.status === 'DONE'
    ).length;

    // const collaboratorsResult = await pool.query(
    //   'SELECT COUNT(user_id) FROM project_users WHERE EXISTS',
    //   [userID]
    // );
    // const collaborators: number = collaboratorsResult.rows[0];
    // console.log('collaborators', collaborators);

    return {
      id: userID,
      projectCount: projects.length,
      tasksCompleted: taskCompleted,
      tasksAssigned: tasks.length,
      collaborators: 0,
      projects: projects,
      tasks: tasks,
    };
  }

  async register(
    username: string,
    password: string
  ): Promise<{ user: User; token: string }> {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *',
      [username, hashedPassword]
    );

    const user = result.rows[0];

    if (!user) {
      throw new GraphQLError('Registration failed', {
        extensions: { code: 'BAD_REQUEST', http: { status: 400 } },
      });
    }

    const token = jwt.sign({ userID: user.id }, process.env.JWT_SECRET!, {
      expiresIn: '1d',
    });

    return { user, token };
  }

  async login(
    username: string,
    password: string
  ): Promise<{ user: User; token: string }> {
    const result = await pool.query('SELECT * FROM users WHERE username=$1', [
      username,
    ]);
    const user: User = result.rows[0];

    if (!user) {
      throw new Error('User not found');
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      throw new Error('Invalid password');
    }

    const token = jwt.sign({ userID: user.id }, process.env.JWT_SECRET!, {
      expiresIn: '1d',
    });

    return { user, token };
  }

  async deleteAccount(userID: string): Promise<boolean> {
    const result = await pool.query('DELETE * FROM users WHERE id=$1', [
      userID,
    ]);

    return result.rows[0];
  }

  async logout(): Promise<boolean> {
    return true;
  }
}
