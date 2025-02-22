import { State } from "../../model/state";

export interface StateRepository {
    getStates(payload: void) : Promise<State[]>;
    getStateById(payload: number) : Promise<State[]>;
}