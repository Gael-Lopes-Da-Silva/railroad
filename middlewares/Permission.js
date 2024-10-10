export function permission(request, response, next) {
	if (request.user.permission == "admin") {
		next();
	} else {
		return response.status(403).json({ error: "You need to have permissions" });
	}
}