import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { GraphQLError } from 'graphql';
import type { User } from './user.model.js';
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

    return result.rows;
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
