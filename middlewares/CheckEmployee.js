import { getUser } from "../models/UserController.js";

export function checkEmployee(request, response, next) {
    getUser(request).then((user) => {
        if (user.role == "employee" || user.role == "admin") {
            next();
            return;
        }
    
        return response.status(403).json({
            message: "Something went wrong while checking permissions !",
            error: 1,
            error_message: "You need to be an employee to do this action !",
        });
    }).catch((error) => {
        return response.status(403).json({
            message: "Something went wrong while checking permissions !",
            error: 1,
            error_message: error,
        });
    });
}