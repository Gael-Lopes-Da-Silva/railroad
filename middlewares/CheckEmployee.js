import { getUser } from "../controllers/UserController.js";

export function checkEmployee(request, response, next) {
    const oldId = request.params.id; // we save the curent request.params.id
    
    // we put the user id from the token inside request.params.id because getting the user read this field
    request.params.id = request.user.id;
    
    // we try to get the user with the user id inside of the token
    getUser(request).then((user) => {
        if (!user) {
            return response.status(403).json({
                message: "Something went wrong while checking permissions !",
                error: 1,
                error_message: "Token point to invalid or deleted user !",
            });	
        }
        
        // we check if the logged user have a role of "employee" or "admin"
        if (user.role != "employee" && user.role != "admin") {
            return response.status(403).json({
                message: "Something went wrong while checking permissions !",
                error: 1,
                error_message: "You need to be an employee to do this action !",
            });	
        }
    
        // we put back the old user id that was in request.params.id to not mess with the next code
        // else request.params.id would be the logged user id
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