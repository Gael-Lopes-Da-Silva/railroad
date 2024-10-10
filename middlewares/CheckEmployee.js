import UserModel from "../models/UserModel.js";

export function checkEmployee(request, response, next) {
    const user = UserModel.findById(request.user.id, { deletedAt: null });

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

    next();
}