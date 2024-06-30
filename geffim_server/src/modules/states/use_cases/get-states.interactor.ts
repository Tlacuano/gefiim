import { State } from "../model/state";
import { UseCase } from "./../../../kernel/contracts";
import { StateRepository } from "./ports/state.repository";


export class GetStatesInteractor implements UseCase<void, State[]> {
    constructor(private stateRepository: StateRepository) { }

    execute(payload: void): Promise<State[]> {
        return this.stateRepository.getStates(payload);
    }
}