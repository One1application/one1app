import jwt from 'jsonwebtoken';


export const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization');
    
    if(!token){
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
        req.user = decodedToken
        
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
            req.user = { id: decodedToken.id, role: decodedToken.role }
        } catch (error) {
            console.error("Error verifying token", error);
            res.status(500).json({message: "Error verifying token",error})
        }
    }
    next()
    
}