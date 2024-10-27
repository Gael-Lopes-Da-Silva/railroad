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

        const response = await chai.request(app).get("/users/login").send({
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
            .field("name", "Paris")
            .field("open_hour", "03:30")
            .field("close_hour", "00:00")
            .attach("image", "public/assets/trainstation.jpg", "trainstation.jpg");

        expect(response).to.have.status(201);
        expect(response.body).to.have.property("error", 0);

        trainstationTest = await TrainstationModel.findOne({ name: "Paris" });
        expect(trainstationTest).to.not.be.null;
    });

    it("Get trainstations", async () => {
        const response = await chai
            .request(app)
            .get("/trainstations/get")
            .set("Authorization", `Bearer ${token}`)
            .send();

        expect(response).to.have.status(202);
        expect(response.body).to.have.property("error", 0);
    });

    it("Get trainsation by id", async () => {
        const response = await chai
            .request(app)
            .get(`/trainstations/get/${trainstationTest.id}`)
            .set("Authorization", `Bearer ${token}`)
            .send();

        expect(response).to.have.status(202);
        expect(response.body).to.have.property("error", 0);

        const test = await TrainstationModel.findOne({ name: "Paris" });
        expect(test.id).to.be.equal(trainstationTest.id);
    });

    it("Get trainsation by id with invalid input", async () => {
        const response = await chai
            .request(app)
            .get(`/trainstations/get/6707dd12430c7097898ca3db`)
            .set("Authorization", `Bearer ${token}`)
            .send();

        expect(response).to.have.status(404);
        expect(response.body).to.have.property("error", 1);
    });

    it("Update trainsation by id with partial input", async () => {
        const response = await chai
            .request(app)
            .put(`/trainstations/update/${trainstationTest.id}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "Versailles",
                open_hour: "04:00",
            });

        expect(response).to.have.status(202);
        expect(response.body).to.have.property("error", 0);

        const test = await TrainstationModel.findOne({ name: "Versailles" });
        expect(test.name).to.not.equal("Paris");
        expect(test.open_hour).to.not.equal("03:30");
    });

    it("Update trainsation by id with invalid input", async () => {
        const response = await chai
            .request(app)
            .put(`/trainstations/update/6707dd12430c7097898ca3db`)
            .set("Authorization", `Bearer ${token}`)
            .field("name", "Versailles")
            .field("open_hour", "03:30")
            .field("close_hour", "00:00")
            .attach("image", "public/assets/trainstation.jpg", "trainstation.jpg");

        expect(response).to.have.status(404);
        expect(response.body).to.have.property("error", 1);
    });

    it("Delete trainsation by id", async () => {
        const response = await chai
            .request(app)
            .delete(`/trainstations/delete/${trainstationTest.id}`)
            .set("Authorization", `Bearer ${token}`)
            .send();

        expect(response).to.have.status(202);
        expect(response.body).to.have.property("error", 0);

        const test = await TrainstationModel.findOne({ _id: trainstationTest.id });
        expect(test.deletedAt).to.not.be.null;
    });

    it("Delete trainsation by id with invalid input", async () => {
        const response = await chai
            .request(app)
            .delete(`/trainstations/delete/6707dd12430c7097898ca3db`)
            .set("Authorization", `Bearer ${token}`)
            .send();

        expect(response).to.have.status(404);
        expect(response.body).to.have.property("error", 1);
    });

    after(async () => {
        await UserModel.findByIdAndDelete(userAdmin.id);
        await TrainstationModel.findByIdAndDelete(trainstationTest.id);
    });
});
