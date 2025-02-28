import { GraphQLError } from 'graphql';
import type { Project } from './project.model.js';
import pool from '@/utils/database.js';
import { generateInvitationCode } from '@/utils/invitation.js';

export class ProjectService {
  async getProject(projectID: string): Promise<Project> {
    const result = await pool.query('SELECT * FROM projects WHERE id=$1', [
      projectID,
    ]);

    if (!result.rows[0]) {
      throw new GraphQLError('Project not found', {
        extensions: { code: 'BAD_REQUEST', http: { status: 400 } },
      });
    }
    
    const collaboratorsResult = await pool.query('SELECT COUNT(user_id) FROM project_users WHERE project_id = $1', [projectID]);
    const collaborators: number = collaboratorsResult.rows[0].count;

    return {
      ...result.rows[0],
      taskCount: result.rows[0].task_count,
      collaborators: collaborators,
    };
  }

  async getProjects(ownerID: string): Promise<Project[]> {
    const result = await pool.query(
      'SELECT project_id FROM project_users WHERE user_id = $1',
      [ownerID]
    );

    const projectIDs = result.rows.map((row) => row.project_id);
    if (projectIDs.length === 0) {
      return [];
    }

    const projects = await pool.query(
      'SELECT * FROM projects WHERE id = ANY($1::uuid[])',
      [projectIDs]
    );
    
    const collaboratorsResult = await pool.query(
      'SELECT project_id, COUNT(user_id) as count FROM project_users WHERE project_id = ANY($1::uuid[]) GROUP BY project_id',
      [projectIDs]
    );
    
    // Create a map of project_id to collaborator count for easier lookup
    const collaboratorMap = new Map(
      collaboratorsResult.rows.map(row => [row.project_id, parseInt(row.count) - 1])
    );
    
    return projects.rows.map(project => ({
      ...project,
      taskCount: project.task_count,
      collaborators: collaboratorMap.get(project.id) ?? 0,
    }));
  }

  async createProject(
    name: string,
    color: string,
    ownerID: string
  ): Promise<Project> {
    const invitationCode: string = generateInvitationCode();

    try {
      await pool.query('BEGIN');

      const projectResult = await pool.query(
        'INSERT INTO projects (name, color, owner_id, invitation) VALUES ($1, $2, $3, $4) RETURNING *',
        [name, color, ownerID, invitationCode]
      );

      const project = projectResult.rows[0];
      if (!project) {
        throw new GraphQLError('Failed to create project', {
          extensions: { code: 'BAD_REQUEST', http: { status: 400 } },
        });
      }

      await pool.query(
        'INSERT INTO project_users (project_id, user_id) VALUES ($1, $2)',
        [project.id, ownerID]
      );

      await pool.query('COMMIT');
      return project;
    } catch (error) {
      console.error(error);
      throw new GraphQLError('Failed to create project', {
        extensions: { code: 'BAD_REQUEST', http: { status: 400 } },
      });
    }
  }

  async joinProject(invitation: string, userID: string): Promise<Project> {
    const result = await pool.query(
      'SELECT * FROM projects WHERE invitation = $1',
      [invitation]
    );

    const project = result.rows[0];
    if (!project) {
      throw new GraphQLError('Project not found', {
        extensions: { code: 'NOT_FOUND', http: { status: 404 } },
      });
    }

    if (project.owner_id === userID) {
      throw new GraphQLError('You are the owner of this project', {
        extensions: { code: 'BAD_REQUEST', http: { status: 400 } },
      });
    }

    await pool.query(
      'INSERT INTO project_users (project_id, user_id) VALUES ($1, $2)',
      [project.id, userID]
    );

    return project;
  }

  async deleteProject(projectID: string, userID: string): Promise<boolean> {
    const ownerResult = await pool.query<{ owner_id: string }>(
      'SELECT owner_id FROM projects WHERE id=$1',
      [projectID]
    );

    if (ownerResult.rows.length === 0) {
      throw new GraphQLError('Project not found', {
        extensions: { code: 'NOT_FOUND', http: { status: 404 } },
      });
    }

    const ownerID = ownerResult.rows[0].owner_id;
    if (ownerID !== userID) {
      throw new GraphQLError('You are not the owner of this project', {
        extensions: { code: 'BAD_REQUEST', http: { status: 400 } },
      });
    } 

    try {
      await pool.query('BEGIN');

      await pool.query('DELETE FROM projects WHERE id=$1', [projectID]);
      await pool.query('DELETE FROM project_users WHERE project_id=$1', [
        projectID,
      ]);
      
      await pool.query('COMMIT');
      return true;
    } catch {
      await pool.query('ROLLBACK');
      return false;
    }
  }
}
