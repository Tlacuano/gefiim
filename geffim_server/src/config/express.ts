import StateRouter from '../modules/states/adapters/state.controller';
import MunicipalityRouter from '../modules/municipalities/adapters/municipality.controller';
import SpecialityRouter from '../modules/specialities/controller/speciality.controller';
import express from 'express';
import cors from 'cors';

const app = express();

app.set('port', process.env.PORT || 3000);
app.use(cors({origin: '*'}));
app.use(express.json());

app.get('/', async (__, res) => {
    res.send('Hello World');
});

app.use('/api-gefiim/state', StateRouter);
app.use('/api-gefiim/municipality', MunicipalityRouter);
app.use('/api-gefiim/speciality', SpecialityRouter);




export default app;