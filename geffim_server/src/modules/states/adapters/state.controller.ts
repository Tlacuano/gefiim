import { validateError } from './../../../config/errors/error_handler';
import { ResponseApi } from './../../../kernel/types';
import { StateRepository } from './../use_cases/ports/state.repository';
import { State } from './../model/state';
import { Router, Request, Response } from "express"
import { StateStorageGateway } from './state.storage.gateway';
import { GetStatesInteractor } from '../use_cases/get-states.interactor';
import logger from '../../../config/logs/logger';
import { GetStateById } from '../use_cases/ger_state_by_id.interactor';

const StateRouter = Router();

export class StateController {
    getStates = async (__: Request, res: Response) => {
        try {
            const repository:StateRepository = new StateStorageGateway();
            const interactor = new GetStatesInteractor(repository);

            const states = await interactor.execute();

            const body:ResponseApi<State[]> = {
                data: states,
                message: 'States fetched successfully',
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

    // local methods
    static getStateById = async (payload : number) => {
        try {
            const respository:StateRepository = new StateStorageGateway();
            const interactor = new GetStateById(respository);

            const state = await interactor.execute(payload);

            return state;
        } catch (error) {
            throw error;
        }
    }
}

StateRouter.get('/get-states', new StateController().getStates);

export default StateRouter;