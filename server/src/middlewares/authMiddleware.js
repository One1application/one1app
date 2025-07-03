import jwt from 'jsonwebtoken';
import prisma from "../db/dbClient.js";


 

export const authMiddleware = async(req, res, next) => {
    const token = req.header('Authorization');
    
    if(!token){
        console.log('1');
        
        return res.status(401).json({
            message: "Token not found, Access Denied!"
        })
    }
    try {
        const incomingToken = token.replace('Bearer ', '');

       
        const decodedToken = jwt.verify(incomingToken, process.env.JWT_SECRET); 
        if(!decodedToken){
            return res.status(401).json({
                message:"Invalid Token"
            })
        }
        
        
         
        req.user = decodedToken;
        next();
    } catch (error) {
        console.error("Error verifying token", error);
        res.status(500).json({message: "Error verifying token",error})
    }
}

export const loggedMiddleware = (req, res, next) => {
    const token = req.header('Authorization');
    
    if(token){
        try {
            const incomingToken = token.replace('Bearer ', '');
            const decodedToken = jwt.verify(incomingToken, process.env.JWT_SECRET); 
            if(!decodedToken){
                return res.status(401).json({
                    message:"Invalid Token"
                })
            }
            req.user = decodedToken;
        } catch (error) {
            console.error("Error verifying token", error);
            res.status(500).json({message: "Error verifying token",error})
        }
    }
    next()
    
}