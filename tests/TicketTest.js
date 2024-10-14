import chai from "chai";
import chaiHttp from "chai-http";
import bcrypt from "bcrypt";
import app from "../server.js";

import UserModel from "../models/UserModel.js";
import TrainModel from "../models/TrainModel.js";
import TrainstationModel from "../models/TrainstationModel.js";
import TicketModel from "../models/TicketModel.js";

chai.use(chaiHttp);
const expect = chai.expect;

describe("Tests for Ticket", () => {
    let userAdmin = {};
    let userTest = {};
    let startTrainstationTest = {};
    let endTrainstationTest = {};
    let trainTest = {};
    let ticketTest = {};

    let token = "";

    before(async () => {
        userAdmin = await UserModel.create({
            pseudo: "admin",
            password: bcrypt.hashSync("admin123", 10),
            email: "admin@example.com",
            role: "admin",
        });

        userTest = await UserModel.create({
            pseudo: "test",
            password: bcrypt.hashSync("test1234", 10),
            email: "test@example.com",
        });

        startTrainstationTest = await TrainstationModel.create({
            name: "Perpignan",
            open_hour: "06:00",
            close_hour: "22:45",
            image: "2JqBZv+zHtP9LfPmzNZ/CkBDTupH8YKKv8YJzZ2bLrfQPwUdrpLNQwDc4Gp8ysYZJ2XY5aQ9ab7oLRXXpGRL1fnfZKqW93OPJDf",
        });

        endTrainstationTest = await TrainstationModel.create({
            name: "Paris",
            open_hour: "06:00",
            close_hour: "20:45",
            image: "2JqBZv+zHtP9LfPmzNZ/CkBDTupH8YKKv8YJzZ2bLrfQPwUdrpLNQwDc4Gp8ysYZJ2XY5aQ9ab7oLRXXpGRL1fnfZKqW93OPJDf",
        });

        trainTest = await TrainModel.create({
            name: "Ligne Perpignan-Toulouse",
            start_station: startTrainstationTest.id,
            end_station: endTrainstationTest.id,
            departure_time: new Date(),
        });

        const response = await chai
            .request(app)
            .post("/users/login")
            .send({
                email: "admin@example.com",
                password: "admin123",
            });

        token = response.body.token;
    });

    it("Book ticket", async () => {
        const response = await chai
            .request(app)
            .post("/tickets/book")
            .set("Authorization", `Bearer ${token}`)
            .send({
                user: userTest.id,
                train: trainTest.id,
            });

        expect(response).to.have.status(201);
        expect(response.body).to.have.property("error", 0);

        // ticketTest = await TicketModel.findOne({ train: trainTest.id });
        // expect(ticketTest).to.not.be.null;
    });

    after(async () => {
        await UserModel.findByIdAndDelete(userAdmin.id);
        await UserModel.findByIdAndDelete(userTest.id);
        await TrainstationModel.findByIdAndDelete(startTrainstationTest.id);
        await TrainstationModel.findByIdAndDelete(endTrainstationTest.id);
        await TrainModel.findByIdAndDelete(trainTest.id);
        await TicketModel.findByIdAndDelete(ticketTest.id);
    });
});
