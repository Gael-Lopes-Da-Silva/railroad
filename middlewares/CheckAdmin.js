import UserModel from "../models/UserModel.js";

export function checkAdmin(request, response, next) {
    const user = UserModel.findById(request.user.id);

	if (user.permission == "admin") {
		next();
        return;
	}

    return response.status(403).json({
        message: "Something went wrong while checking permissions !",
        error: 1,
        error_message: "You need to be an administrator to do this action !",
    });
}