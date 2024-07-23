import { queryDB } from "../../../utils/data_base/db_connection";
import { User } from "../model/user";



export class UserStorageGateway {
    async getTotalUsers(payload:void){
        try {
            const response = await queryDB<{ total: number }[]>('SELECT COUNT(id_admin) as total FROM admins');
            const { total } = response[0];
            return total;
        } catch (error) {
            throw(error)
        }
    }

    async getUsersPaginated(payload: { limit: number, offset: number }) {
        try {
            const response = await queryDB<User[]>("SELECT * FROM admins LIMIT ? OFFSET ? ", 
                [payload.limit, payload.offset]);
            return response;
        } catch (error) {
            throw(error)
        }
    }

    //bucar por username
    async getUserByUsername(payload: string) {
        try {
            const response = await queryDB<User[]>("SELECT * FROM admins WHERE username = ?", [payload]);
            return response;
        } catch (error) {
            throw(error)
        }
    }

    async getUserById(payload: number) {
        try {
            const response = await queryDB<User[]>("SELECT * FROM admins WHERE id_admin = ?", [payload]);
            return response;
        } catch (error) {
            throw(error)
        }
    }

    async registerUser(payload: User) {
        try {
            const response = await queryDB('INSERT INTO admins (username, password, email) VALUES (?, ?, ?)',
                [payload.username, payload.password, payload.email]);
            
            return response;
        } catch (error) {
            throw(error)
        }
    }

    async updateUser(payload: User) {
        try {
            const response = await queryDB('UPDATE admins SET username = ?, email = ? WHERE id_admin = ?',
                [payload.username, payload.email, payload.id_admin]);
            
            return response;
        } catch (error) {
            throw(error)
        }
    }

    async changeStatus(payload: { id_admin: number, status: boolean }) {
        try {
            const response = await queryDB('UPDATE admins SET status = ? WHERE id_admin = ?',
                [payload.status, payload.id_admin]);
            
            return response;
        } catch (error) {
            throw(error)
        }
    }

    async changePassword(payload: { id_admin: number, password: string }) {
        try {
            const response = await queryDB('UPDATE admins SET password = ? WHERE id_admin = ?',
                [payload.password, payload.id_admin]);
            
            return response;
        } catch (error) {
            throw(error)
        }
    }
}