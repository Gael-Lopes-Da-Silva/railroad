import express from "express";
import mongoose from "mongoose";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";

import TrainRouter from "./routes/TrainRouter.js";
import TrainstationRouter from "./routes/TrainstationRouter.js";
import UserRouter from "./routes/UserRouter.js";

const app = express();
const swaggerDocs = swaggerJsdoc({
	swaggerDefinition: {
		openapi: "3.0.0",
		info: {
			title: "Railroad API",
			version: "1.0.0",
			description: "Documentation for Railraod API",
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

mongoose.connect("mongodb://127.0.0.1:27017/railraod").then(() => {
	console.log("Connected to database !");
	app.listen(3000, () => console.log("Server running on http://localhost:3000 !"));
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (request, response) => {
	response.sendFile("index.html", { root: "public" });
});

app.use("/users/", UserRouter);
app.use("/trains/", TrainRouter);
app.use("/trainstations/", TrainstationRouter);

app.use((request, response, next) => {
	response.status(404).send("ERROR 404: can't find ressource !")
});