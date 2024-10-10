import express from "express";
import mongoose from "mongoose";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";

import UserRouter from "./routes/UserRouter.js";
import PostRouter from "./routes/PostRouter.js";
import CommentRouter from "./routes/CommentRouter.js";

const app = express();
const swaggerDocs = swaggerJsdoc({
	swaggerDefinition: {
		openapi: "3.0.0",
		info: {
			title: "Blogify API",
			version: "1.0.0",
			description: "Documentation for Blogify API",
		},
		servers: [
			{
				url: "http://localhost:3000/"
			},
		],
	},
	apis: ["./routes/*.js"]
});

app.use("/docs", swaggerUiExpress.serve, swaggerUiExpress.setup(swaggerDocs));

mongoose.connect("mongodb://127.0.0.1:27017/blogify").then(() => {
	console.log("Connected to database !");
	app.listen(3000, () => console.log("Server running on http://localhost:3000 !"));
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (request, response) => {
	response.sendFile("index.html", { root: "public" });
});

app.use("/users/", UserRouter);
app.use("/posts/", PostRouter);
app.use("/comments/", CommentRouter);

app.use((request, response, next) => {
	response.status(404).send("ERROR 404: can't find ressource !")
});