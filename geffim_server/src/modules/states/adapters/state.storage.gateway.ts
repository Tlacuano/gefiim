import { queryDB } from './../../../utils/data_base/db_connection';
import { State } from "../model/state";
import { StateRepository } from "../use_cases/ports/state.repository";

export class StateStorageGateway implements StateRepository {
    getStates(payload: void): Promise<State[]> {
        try {
            const response = queryDB<State[]>('SELECT * FROM states');

            return response;
        } catch (error) {
            throw(error)
        }
    }

}