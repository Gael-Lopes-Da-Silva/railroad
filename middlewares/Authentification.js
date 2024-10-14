import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv/config"; // populate process.end with what's inside .env

export function authentification(request, response, next) {
    let token = "";
    
    // we try to read token from headers with and without Bearer in front
    if (request.headers.authorization && request.headers.authorization.split(' ')[0] === 'Bearer') {
        token = request.headers.authorization.split(' ')[1]; // remove Bearer and read the token
    } else {
        token = request.headers.authorization; // read the token
    }

    if (token == "" || token == null) {
        return response.status(401).json({
            message: "Something went wrong while checking authorizations !",
            error: 1,
            error_message: "A token is needed !",
        });
    }

    // we get the secret key from .env
    const secret = process.env.SECRET;

    jsonwebtoken.verify(token, secret, (error, user) => {
        if (error) return response.status(401).json({
            message: "Something went wrong while checking authorizations !",
            error: 1,
            error_message: error,
        });

        request.user = user; // after verifying the token, we put the user id inside request.user
        next(); // the we continue
    });
}