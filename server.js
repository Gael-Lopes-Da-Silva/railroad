import express from "express";
import mongoose, { Schema } from "mongoose";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";

import TrainRouter from "./routes/TrainRouter.js";
import TrainstationRouter from "./routes/TrainstationRouter.js";
import UserRouter from "./routes/UserRouter.js";
import TicketRouter from "./models/TicketModel.js";

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
                url: "http://localhost:3000/",
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                    description: "Add bearer token to access this route"
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            }
        ]
    },
    apis: ["./routes/*.js"],
});

app.use("/docs", swaggerUiExpress.serve, swaggerUiExpress.setup(swaggerDocs));

mongoose.connect("mongodb://127.0.0.1:27017/railraod").then(() => {
    console.log("Connected to database !");
    app.listen(3000, () =>
        console.log("Server running on http://localhost:3000 !")
    );
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (request, response) => {
    response.sendFile("index.html", { root: "public" });
});

app.use("/trainstations/", TrainstationRouter);
app.use("/trains/", TrainRouter);
app.use("/users/", UserRouter);
app.use("/tickets/", TicketRouter);

export default app;
