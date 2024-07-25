import { RequestToAuth } from "../model/requestToAuth";
import { queryDB } from "../../../utils/data_base/db_connection";


export class AuthStorageGateway {
    async findUserOnCandidateTable(payload: RequestToAuth){
        try {
            const response = await queryDB<{username : string, password : string, id_candidate: number, email: string, verification_code:string}[]>(`select * from candidates where username = ?`, [payload.username]);
            return response[0];            
        } catch (error) {
            throw error;
        }
    }

    async findUserOnAdminTable(payload: RequestToAuth){
        try {
            const response = await queryDB<{username : string, password : string, id_candidate: number, email: string, verification_code:string }[]>(`select * from admins where username = ?  AND status = 1`, [payload.username]);
            return response[0];            
        } catch (error) {
            throw error;
        }
    }

    async setVerificationCodeCandidate (payload: {username: string, code: string}){
        try {
            await queryDB(`UPDATE candidates SET verification_code = ? WHERE username = ?`, [payload.code, payload.username]);
        } catch (error) {
            throw error;
        }
    }

    async setVerificationCodeAdmin (payload: {username: string, code: string}){
        try {
            await queryDB(`UPDATE admins SET verification_code = ? WHERE username = ?`, [payload.code, payload.username]);
        } catch (error) {
            throw error;
        }
    }

    async updatePasswordCandidate(username: string, newPassword: string) {
        try {
            await queryDB(`UPDATE candidates SET password = ? WHERE username = ?`, [newPassword, username]);
        } catch (error) {
            throw error;
        }
    }

    async updatePasswordAdmin(username: string, newPassword: string) {
        try {
            await queryDB(`UPDATE admins SET password = ? WHERE username = ?`, [newPassword, username]);
        } catch (error) {
            throw error;
        }
    }
}