import { GraphQLError } from 'graphql';
import pool from '@/utils/database.js';
import { generateInvitationCode } from '@/utils/invitation.js';
export class ProjectService {
    async createProject(name, color, ownerID) {
        const invitationCode = generateInvitationCode();
        const result = await pool.query('INSERT INTO projects (name, color, owner_id, invitation) VALUES ($1, $2, $3, $4) RETURNING *', [name, color, ownerID, invitationCode]);
        const project = result.rows[0];
        if (!project) {
            throw new GraphQLError('Failed to create project', {
                extensions: { code: 'BAD_REQUEST', http: { status: 400 } },
            });
        }
        return project;
    }
    async getProjects(ownerID) {
        const result = await pool.query('SELECT * FROM projects WHERE owner_id=$1', [ownerID]);
        return result.rows;
    }
}
