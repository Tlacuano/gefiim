import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { ResponseAuthenticated } from '../modules/auth/model/responseAuthenticated';

export const generateToken = (payload: ResponseAuthenticated) => {
    return jwt.sign(payload, process.env.JWT_SECRET as string) as string;
}

export const validateToken = (token: string) => {
    return jwt.verify(token, process.env.JWT_SECRET as string) as ResponseAuthenticated;
}

export const Authenticator = (requiredRole: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const token = req.headers.authorization?.split(' ')[1];

        if(!token)
            return res.status(401).json({message: 'No autorizado'});

        try {
            const { role } = validateToken(token);

            if(requiredRole.includes(role)){
                next()
            }else{
                return res.status(401).json({message: 'No autorizado'});
            }
        }catch(error){
            return res.status(401).json({message: 'No autorizado'});
        }

        return;
    }    
}