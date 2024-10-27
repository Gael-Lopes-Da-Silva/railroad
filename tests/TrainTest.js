import chai from "chai";
import chaiHttp from "chai-http";
import bcrypt from "bcrypt";
import app from "../server.js";

import UserModel from "../models/UserModel.js";
import TrainModel from "../models/TrainModel.js";
import TrainstationModel from "../models/TrainstationModel.js";

chai.use(chaiHttp);
const expect = chai.expect;

describe("Tests for Train", () => {
    let userAdmin = {};
    let trainTest = {};
    let startTrainstationTest = {};
    let endTrainstationTest = {};
    let token = "";

    before(async () => {
        userAdmin = await UserModel.create({
            pseudo: "admin",
            password: bcrypt.hashSync("admin123", 10),
            email: "admin@example.com",
            role: "admin",
        });

        startTrainstationTest = await TrainstationModel.create({
            name: "Perpignan",
            open_hour: "06:00",
            close_hour: "22:45",
            image: "2JqBZv+zHtP9LfPmzNZ/CkBDTupH8YKKv8YJzZ2bLrfQPwUdrpLNQwDc4Gp8ysYZJ2XY5aQ9ab7oLRXXpGRL1fnfZKqW93OPJDf",
        });

        endTrainstationTest = await TrainstationModel.create({
            name: "Toulouse",
            open_hour: "05:00",
            close_hour: "23:45",
            image: "2JqBZv+zHtP9LfPmzNZ/CkfeaupH8YKKv8YJzZ2bLrfQPwUdrpLNQwDc4Gp8ysYZJ2XY5aQ9ab7oLRXXpGRL1fnfZKqW93OPJDf",
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

    it("Create train", async () => {
        const response = await chai
            .request(app)
            .post("/trains/create")
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "Ligne Perpignan-Toulouse",
                start_station: startTrainstationTest._id,
                end_station: endTrainstationTest._id,
                departure_time: new Date(),
            });

        expect(response).to.have.status(201);
        expect(response.body).to.have.property("error", 0);

        trainTest = await TrainModel.findOne({ start_station: startTrainstationTest._id, end_station: endTrainstationTest._id });
        expect(trainTest).to.not.be.null;
    });

    it("Create train with invalid input", async () => {
        const response = await chai
            .request(app)
            .post("/trains/create")
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "Ligne Perpignan-Toulouse",
                start_station: "6707dd12430c7097898ca3db",
                end_station: "6707dd12430crc97898ca3db",
                departure_time: new Date(),
            });

        expect(response).to.have.status(404);
        expect(response.body).to.have.property("error", 1);
    });

    it("Get trains", async () => {
        const response = await chai
            .request(app)
            .get("/trains/get")
            .set("Authorization", `Bearer ${token}`)
            .send();

        expect(response).to.have.status(202);
        expect(response.body).to.have.property("error", 0);
    });

    it("Get train by id", async () => {
        const response = await chai
            .request(app)
            .get(`/trains/get/${trainTest.id}`)
            .set("Authorization", `Bearer ${token}`)
            .send();

        expect(response).to.have.status(202);
        expect(response.body).to.have.property("error", 0);

        const test = await TrainModel.findOne({ start_station: startTrainstationTest._id, end_station: endTrainstationTest._id });
        expect(test.id).to.be.equal(trainTest.id);
    });

    it("Get train by id with invalid input", async () => {
        const response = await chai
            .request(app)
            .get(`/trains/get/6707dd12430c7097898ca3db`)
            .set("Authorization", `Bearer ${token}`)
            .send();

        expect(response).to.have.status(404);
        expect(response.body).to.have.property("error", 1);
    });

    it("Update train by id", async () => {
        const response = await chai
            .request(app)
            .put(`/trains/update/${trainTest.id}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "Ligne Perpignan-Toulouse-Bordeaux",
                start_station: startTrainstationTest._id,
                end_station: endTrainstationTest._id,
                departure_time: new Date(),
            });

        expect(response).to.have.status(202);
        expect(response.body).to.have.property("error", 0);

        const test = await TrainModel.findOne({ start_station: startTrainstationTest._id, end_station: endTrainstationTest._id });
        expect(test.name).to.not.equal("Ligne Perpignan-Toulouse");
    });

    it("Update train by id with partial input", async () => {
        const response = await chai
            .request(app)
            .put(`/trains/update/${trainTest.id}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "Ligne Perpignan-Toulouse-Bordeaux Test",
            });

        expect(response).to.have.status(202);
        expect(response.body).to.have.property("error", 0);

        const test = await TrainModel.findOne({ start_station: startTrainstationTest._id, end_station: endTrainstationTest._id });
        expect(test.name).to.not.equal("Ligne Perpignan-Toulouse-Bordeaux");
    });

    it("Update train by id with invalid input", async () => {
        const response = await chai
            .request(app)
            .put(`/trains/update/6707dd12430c7097898ca3db`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "Ligne Perpignan-Toulouse-Bordeaux",
                start_station: "6707dd12430c7097898ca3db",
                end_station: "6707dd12430crc97898ca3db",
                departure_time: new Date(),
            });

        expect(response).to.have.status(404);
        expect(response.body).to.have.property("error", 1);
    });

    it("Delete train by id", async () => {
        const response = await chai
            .request(app)
            .delete(`/trains/delete/${trainTest.id}`)
            .set("Authorization", `Bearer ${token}`)
            .send();

        expect(response).to.have.status(202);
        expect(response.body).to.have.property("error", 0);

        const test = await TrainModel.findOne({ start_station: startTrainstationTest._id, end_station: endTrainstationTest._id });
        expect(test.deletedAt).to.not.be.null;
    });

    it("Delete train by id", async () => {
        const response = await chai
            .request(app)
            .delete(`/trains/delete/6707dd12430c7097898ca3db`)
            .set("Authorization", `Bearer ${token}`)
            .send();

        expect(response).to.have.status(404);
        expect(response.body).to.have.property("error", 1);
    });

    after(async () => {
        await UserModel.findByIdAndDelete(userAdmin.id);
        await TrainModel.findByIdAndDelete(trainTest.id);
        await TrainstationModel.findByIdAndDelete(startTrainstationTest.id);
        await TrainstationModel.findByIdAndDelete(endTrainstationTest.id);
    });
});
