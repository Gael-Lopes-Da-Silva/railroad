import { getUser } from "../controllers/UserController.js";

export function checkAdmin(request, response, next) {
    getUser(request.user.id).then((user) => {
        if (!user) {
            return response.status(403).json({
                message: "Something went wrong while checking permissions !",
                error: 1,
                error_message: "Token point to invalid or deleted user !",
            });	
        }
        
        if (user.role != "admin") {
            return response.status(403).json({
                message: "Something went wrong while checking permissions !",
                error: 1,
                error_message: "You need to be an admin to do this action !",
            });	
        }
    
        next();
    }).catch((error) => {
        return response.status(403).json({
            message: "Something went wrong while checking permissions !",
            error: 1,
            error_message: error,
        });	
    });
}