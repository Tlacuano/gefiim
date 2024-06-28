import { error, log } from 'winston';
import app from './config/express';
import logger from './config/logs/logger';


const main = () => {
    try{
        app.listen(app.get('port'), () => {
            logger.info(`Server is running in http://localhost:${app.get('port')}`);
        });
    }catch(err){
        logger.error(error);
    }
}

main();