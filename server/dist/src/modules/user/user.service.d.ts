import type { User } from './user.model.js';
export declare class UserService {
    me(userID: string): Promise<User>;
    getUsers(projectID: string): Promise<User[]>;
    register(username: string, password: string): Promise<{
        user: User;
        token: string;
    }>;
    login(username: string, password: string): Promise<{
        user: User;
        token: string;
    }>;
    deleteAccount(userID: string): Promise<boolean>;
    logout(): Promise<boolean>;
}
