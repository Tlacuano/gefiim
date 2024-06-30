import { Router, Request, Response } from "express";
import { State } from "../../../modules/states/model/state";
import { StateBoundary } from "../../../modules/states/adapters/state.bounday";
import { MunicipalityRepository } from "../use_cases/ports/municipality.repository";
import { MunicipalityStorageGateway } from "./municipality.storage.gateway";
import { GetMunicipalitiesByStateId } from "../use_cases/get_municipalities_by_state_id.interactor";
import { Municipality } from "../model/municipality";
import { ResponseApi } from "../../../kernel/types";
import logger from "../../../config/logs/logger";
import { validateError } from "../../../config/errors/error_handler";

const MunicipalityRouter = Router();

export class MunicipalityController {
    getMunicipalitiesByStateId = async (req: Request, res: Response) => {
        try {
            const payload = req.body as unknown as State;

            await StateBoundary.getStateById(payload.id_state);

            const repository:MunicipalityRepository = new MunicipalityStorageGateway();
            const interactor = new GetMunicipalitiesByStateId(repository);
            
            const municipalities = await interactor.execute(payload.id_state);

            const body:ResponseApi<Municipality[]> = {
                data: municipalities,
                message: 'Municipalities fetched successfully',
                status: 200,
                error: false
            }

            res.status(200).json(body);
        } catch (error) {
            logger.error(error);

            const errorBody = validateError(error as Error);
            res.status(errorBody.status).json(errorBody);
        }
    }
}

MunicipalityRouter.post('/get-municipalities-by-state-id', new MunicipalityController().getMunicipalitiesByStateId);

export default MunicipalityRouter;