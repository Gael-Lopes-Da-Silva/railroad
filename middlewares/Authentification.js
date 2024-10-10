import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv/config";

export function authentification(request, response, next) {
	const token = request.headers.authorization;
	const secret = process.env.SECRET;

	if (token == "" || token == null) {
		return response.status(401).json({
            message: "Something went wrong while checking authorizations !",
            error: 1,
            error_message: "A token is needed in headers>Authorization !",
        });
	}
	
	jsonwebtoken.verify(token, secret, (error, user) => {
        if (error) return response.status(401).json({
            message: "Something went wrong while checking authorizations !",
            error: 1,
            error_message: error,
        });

        request.user = user;
        next();
    });
}