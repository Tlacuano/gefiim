import { RequestToAuth } from "../model/requestToAuth";
import { queryDB } from "../../../utils/data_base/db_connection";


export class AuthStorageGateway {
    async findUserOnCandidateTable(payload: RequestToAuth){
        try {
            const response = await queryDB<{username : string, password : string}[]>(`select * from candidates where username = ?`, [payload.username]);
            return response[0];            
        } catch (error) {
            throw error;
        }
    }

    async findUserOnAdminTable(payload: RequestToAuth){
        try {
            const response = await queryDB<{username : string, password : string}[]>(`select * from admins where username = ?  AND status = 1`, [payload.username]);
            return response[0];            
        } catch (error) {
            throw error;
        }
    }
}