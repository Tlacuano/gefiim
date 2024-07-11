import StateRouter from '../modules/states/adapters/state.controller';
import MunicipalityRouter from '../modules/municipalities/adapters/municipality.controller';
import SpecialityRouter from '../modules/specialities/controller/speciality.controller';
import SalePeriodRouter from '../modules/sale_periods/controller/sale_period.controller';
import InstitutionalInformationRouter from '../modules/institutional_information/controller/institutional_information.controller';
import CandidatesRouter from '../modules/candidates/controller/candidates.controller';

import { Authenticator } from './jwt';
import express from 'express';
import cors from 'cors';

const app = express();

app.set('port', process.env.PORT || 3000);
app.use(cors({origin: '*'}));
app.use(express.json({ limit: '50mb' }));

app.get('/', async (__, res) => {
    res.send('Hello World');
});

app.use('/api-gefiim/state', StateRouter);
app.use('/api-gefiim/municipality', MunicipalityRouter);
app.use('/api-gefiim/speciality', SpecialityRouter);
app.use('/api-gefiim/sale-period', SalePeriodRouter);
app.use('/api-gefiim/institutional-information', InstitutionalInformationRouter);
app.use('/api-gefiim/candidates', CandidatesRouter);




export default app;