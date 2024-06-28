import express from 'express';
import cors from 'cors';

const app = express();

app.set('port', process.env.PORT || 3000);
app.use(cors({origin: '*'}));
app.use(express.json());

app.get('/', async (__, res) => {
    res.send('Hello World');
});

export default app;