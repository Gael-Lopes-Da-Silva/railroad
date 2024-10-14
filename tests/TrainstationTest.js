import chai from "chai";
import chaiHttp from "chai-http";
import bcrypt from "bcrypt";
import app from "../server.js";

import UserModel from "../models/UserModel.js";
import TrainstationModel from "../models/TrainstationModel.js";

chai.use(chaiHttp);
const expect = chai.expect;

describe("Tests for Trainstation", () => {
    let userAdmin = {};
    let trainstationTest = {};

    let token = "";

    before(async () => {
        userAdmin = await UserModel.create({
            pseudo: "admin",
            password: bcrypt.hashSync("admin123", 10),
            email: "admin@example.com",
            role: "admin",
        });

        const response = await chai.request(app).post("/users/login").send({
            email: "admin@example.com",
            password: "admin123",
        });

        token = response.body.token;
    });

    it("Create trainstation", async () => {
        const response = await chai
            .request(app)
            .post("/trainstations/create")
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "Paris",
                open_hour: "03:30",
                close_hour: "00:00",
                image: "2JqBZv+zHtP9LfPmzNZ/CkBDTupH8YKKv8YJzZ2bLrfQPwUdrpLNQwDc4Gp8ysYZJ2XY5aQ9ab7oLRXXpGRL1fnfZKqW93OPJDn",
            });

        expect(response).to.have.status(201);
        expect(response.body).to.have.property("error", 0);

        trainstationTest = await TrainstationModel.findOne({ name: "Paris" });
    });

    it("Get trainstations", async () => {
        const response = await chai
            .request(app)
            .post("/trainstations/get")
            .set("Authorization", `Bearer ${token}`)
            .send();

        expect(response).to.have.status(202);
        expect(response.body).to.have.property("error", 0);
    });

    it("Get trainsation by id", async () => {
        const response = await chai
            .request(app)
            .post(`/trainstations/get/${trainstationTest.id}`)
            .set("Authorization", `Bearer ${token}`)
            .send();

        expect(response).to.have.status(202);
        expect(response.body).to.have.property("error", 0);
    });

    it("Update trainsation by id", async () => {
        const response = await chai
            .request(app)
            .post(`/trainstations/update/${trainstationTest.id}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "Versailles",
            });

        expect(response).to.have.status(202);
        expect(response.body).to.have.property("error", 0);

        const test = await TrainstationModel.findOne({ name: "Versailles" });
        expect(test.name).to.not.equal(trainstationTest.name);
    });

    it("Delete trainsation by id", async () => {
        const response = await chai
            .request(app)
            .post(`/trainstations/delete/${trainstationTest.id}`)
            .set("Authorization", `Bearer ${token}`)
            .send();

        expect(response).to.have.status(202);
        expect(response.body).to.have.property("error", 0);

        const test = await TrainstationModel.findOne({ name: "Versailles" });
        expect(test.deletedAt).to.not.be.null;
    });

    after(async () => {
        await UserModel.findByIdAndDelete(userAdmin.id);
        await TrainstationModel.findByIdAndDelete(trainstationTest.id);
    });
});
