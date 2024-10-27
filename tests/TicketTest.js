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
            .get("/users/login")
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

        ticketTest = await TicketModel.findOne({ train: trainTest.id });
        expect(ticketTest).to.not.be.null;
    });

    it("Book ticket with invalid input", async () => {
        const response = await chai
            .request(app)
            .post("/tickets/book")
            .set("Authorization", `Bearer ${token}`)
            .send({
                user: "6707dd12430c7097898ca3db",
                train: "6707dd12430c2747898ca3db",
            });

        expect(response).to.have.status(404);
        expect(response.body).to.have.property("error", 1);
    });

    it("Get tickets", async () => {
        const response = await chai
            .request(app)
            .get("/tickets/get")
            .set("Authorization", `Bearer ${token}`)
            .send();

        expect(response).to.have.status(202);
        expect(response.body).to.have.property("error", 0);
    });

    it("Get ticket by id", async () => {
        const response = await chai
            .request(app)
            .get(`/tickets/get/${ticketTest.id}`)
            .set("Authorization", `Bearer ${token}`)
            .send();

        expect(response).to.have.status(202);
        expect(response.body).to.have.property("error", 0);
        
        const test = await TicketModel.findOne({ train: trainTest.id });
        expect(test.id).to.not.equal(userTest.id);
    });

    it("Get ticket by id with invalid input", async () => {
        const response = await chai
            .request(app)
            .get(`/tickets/get/6707dd12430c7097898ca3db`)
            .set("Authorization", `Bearer ${token}`)
            .send();

        expect(response).to.have.status(404);
        expect(response.body).to.have.property("error", 1);
    });

    it("Validate ticket by id", async () => {
        const response = await chai
            .request(app)
            .put(`/tickets/validate/${ticketTest.id}`)
            .set("Authorization", `Bearer ${token}`)
            .send();

        expect(response).to.have.status(202);
        expect(response.body).to.have.property("error", 0);
        
        const test = await TicketModel.findOne({ train: trainTest.id });
        expect(test.validatedAd).to.not.be.null;
    });

    it("Validate ticket by id with invalid input", async () => {
        const response = await chai
            .request(app)
            .put(`/tickets/validate/6707dd12430c7097898ca3db`)
            .set("Authorization", `Bearer ${token}`)
            .send();

        expect(response).to.have.status(404);
        expect(response.body).to.have.property("error", 1);
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
