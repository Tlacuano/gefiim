import { queryDB } from './../../../utils/data_base/db_connection';
import { State } from "../model/state";
import { StateRepository } from "../use_cases/ports/state.repository";
import { MESSAGES } from '../../../utils/messages/response_messages';

export class StateStorageGateway implements StateRepository {
    async getStates(payload: void): Promise<State[]> {
        try {
            const response = await queryDB<State[]>('SELECT * FROM states');
            return response;
        } catch (error) {
            throw(error)
        }
    }

    async getStateById(payload: number): Promise<State[]> {
        try {
            const response = await queryDB<State[]>('SELECT * FROM states WHERE id_state = ?', [payload]);

            if (response.length === 0) {
                throw new Error(MESSAGES.BAD_REQUEST.DEFAULT);
            }

            return response;
        } catch (error) {
            throw(error)
        }
    }
}