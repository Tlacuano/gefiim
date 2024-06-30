import { UseCase } from "../../../kernel/contracts";
import { State } from "../model/state";
import { StateRepository } from "./ports/state.repository";
import { MESSAGES } from "../../../utils/messages/response_messages";

export class GetStateById implements UseCase<number, State[]> {
    constructor(private repository: StateRepository) {}

    execute(payload: number): Promise<State[]> {
        if (!payload) 
            throw new Error(MESSAGES.BAD_REQUEST.DEFAULT);

        if (!(Number.isInteger(payload) || payload <= 0)) 
            throw new Error(MESSAGES.BAD_REQUEST.DEFAULT);

        return this.repository.getStateById(payload);
    }
}