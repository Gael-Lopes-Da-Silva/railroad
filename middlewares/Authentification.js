import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv/config";

export function authentification(request, response, next) {
	const token = request.headers.authorization;
	const secret = process.env.SECRET;

	if (token == "") {
		return response.status(401).json({ error: "Token required !" });
	}
	
	jsonwebtoken.verify(token, secret, (err, user) => {
        if (err) return response.status(401).json({ error: "Invalid token !" });

        request.user = user;
        next();
    });
}