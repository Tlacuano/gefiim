import { UseCase } from "../../../kernel/contracts";
import { Municipality } from "../model/municipality";
import { MunicipalityRepository } from "./ports/municipality.repository";
import { MESSAGES } from "../../../utils/messages/response_messages";

export class GetMunicipalitiesByStateId implements UseCase<number, Municipality[]> {
    constructor(private repository: MunicipalityRepository) {}

    execute(payload: number): Promise<Municipality[]> {
        if (!payload) 
            throw new Error(MESSAGES.BAD_REQUEST.DEFAULT);

        if (!(Number.isInteger(payload) || payload <= 0)) 
            throw new Error(MESSAGES.BAD_REQUEST.DEFAULT);

        return this.repository.getMunicipalitiesByStateId(payload);
    }
}