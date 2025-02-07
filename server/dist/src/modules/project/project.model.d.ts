import type { User } from '@/modules/user/user.model.js';
export interface Project {
    id: string;
    name: string;
    color: string;
    owner: User;
    collaborators: User[];
    createdAt: string;
}
