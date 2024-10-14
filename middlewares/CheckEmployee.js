import { getUser } from "../controllers/UserController.js";

export function checkEmployee(request, response, next) {
    const oldId = request.params.id;
    
    request.params.id = request.user.id;
    
    getUser(request).then((user) => {
        if (!user) {
            return response.status(403).json({
                message: "Something went wrong while checking permissions !",
                error: 1,
                error_message: "Token point to invalid or deleted user !",
            });	
        }
        
        if (user.role != "employee" && user.role != "admin") {
            return response.status(403).json({
                message: "Something went wrong while checking permissions !",
                error: 1,
                error_message: "You need to be an employee to do this action !",
            });	
        }
    
        request.params.id = oldId;
        next();
    }).catch((error) => {
        return response.status(403).json({
            message: "Something went wrong while checking permissions !",
            error: 1,
            error_message: error,
        });	
    });
}