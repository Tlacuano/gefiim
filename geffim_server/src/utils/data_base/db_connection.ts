import * as mysql from 'mysql2';
import 'dotenv/config';
import logger from '../../config/logs/logger';
import { MESSAGES } from '../messages/response_messages';

const connection = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
});


export const queryDB = async <T>(query:string, values?:any[]) => {
    return new Promise<T>((resolve,reject)=>{
        connection.query(query,values, (err, resultados:any, arr)=>{
            if(err){
                logger.error(err);
                reject(MESSAGES.SERVER_ERROR);
            }else{
                resolve(resultados);
            }
        });
    });
}