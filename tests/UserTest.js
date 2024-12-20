import chai from "chai";
import chaiHttp from "chai-http";
import bcrypt from "bcrypt";
import app from "../server.js";

import UserModel from "../models/UserModel.js";

chai.use(chaiHttp);
const expect = chai.expect;

describe("Tests for User", () => {
    let userAdmin = {};
    let userTest = {};

    let token = "";

    before(async () => {
        userAdmin = await UserModel.create({
            pseudo: "admin",
            password: bcrypt.hashSync("admin123", 10),
            email: "admin@example.com",
            role: "admin",
        });
    });

    it("Register user", async () => {
        const response = await chai.request(app).post("/users/register").send({
            pseudo: "test",
            email: "test@example.com",
            password: "test1234",
        });

        expect(response).to.have.status(201);
        expect(response.body).to.have.property("error", 0);

        userTest = await UserModel.findOne({ email: "test@example.com" });
        expect(userTest).to.not.be.null;
    });

    it("Register user with invalid input", async () => {
        const response = await chai.request(app).post("/users/register").send({
            pseudo: "te",
            email: "test",
            password: "te",
        });

        expect(response).to.have.status(404);
        expect(response.body).to.have.property("error", 1);
    });

    it("Login user", async () => {
        const response = await chai.request(app).get("/users/login").send({
            email: "admin@example.com",
            password: "admin123",
        });

        expect(response).to.have.status(200);
        expect(response.body).to.have.property("error", 0);
        expect(response.body).to.have.property("token").that.is.a("string");

        token = response.body.token;
    });

    it("Login user with false input", async () => {
        const response = await chai.request(app).get("/users/login").send({
            email: "admin@example.com",
            password: "admin",
        });

        expect(response).to.have.status(404);
        expect(response.body).to.have.property("error", 1);
    });

    it("Login user with invalid input", async () => {
        const response = await chai.request(app).get("/users/login").send({
            email: "admin",
            password: "ad",
        });

        expect(response).to.have.status(404);
        expect(response.body).to.have.property("error", 1);
    });

    it("Get users", async () => {
        const response = await chai
            .request(app)
            .get("/users/get")
            .set("Authorization", `Bearer ${token}`)
            .send();

        expect(response).to.have.status(202);
        expect(response.body).to.have.property("error", 0);
    });

    it("Get user by id", async () => {
        const response = await chai
            .request(app)
            .get(`/users/get/${userTest.id}`)
            .set("authorization", `Bearer ${token}`)
            .send();

        expect(response).to.have.status(202);
        expect(response.body).to.have.property("error", 0);

        const test = await UserModel.findOne({ email: "test@example.com" });
        expect(test.id).to.be.equal(userTest.id);
    });

    it("Get user by id with invalid input", async () => {
        const response = await chai
            .request(app)
            .get(`/users/get/6707dd12730c7097898ca3db`)
            .set("authorization", `Bearer ${token}`)
            .send();

        expect(response).to.have.status(404);
        expect(response.body).to.have.property("error", 1);
    });

    it("Update user self", async () => {
        const response = await chai
            .request(app)
            .put("/users/update")
            .set("authorization", `Bearer ${token}`)
            .send({
                pseudo: "adminAfterUpdate",
                email: "adminAfterUpdate@example.com",
            });

        expect(response).to.have.status(202);
        expect(response.body).to.have.property("error", 0);

        const admin = await UserModel.findOne({ email: "adminAfterUpdate@example.com" });
        expect(admin.name).to.not.equal("admin");
    });

    it("Update user self with partial input", async () => {
        const response = await chai
            .request(app)
            .put("/users/update")
            .set("authorization", `Bearer ${token}`)
            .send({
                pseudo: "adminAfterUpdate2",
            });

        expect(response).to.have.status(202);
        expect(response.body).to.have.property("error", 0);

        const admin = await UserModel.findOne({ email: "adminAfterUpdate@example.com" });
        expect(admin.name).to.not.equal("adminAfterUpdate");
    });

    it("Update user self with invalid input", async () => {
        const response = await chai
            .request(app)
            .put("/users/update")
            .set("authorization", `Bearer ${token}`)
            .send({
                pseudo: "ad",
                email: "adminAfterUpdate",
            });

        expect(response).to.have.status(404);
        expect(response.body).to.have.property("error", 1);
    });

    it("Update user by id", async () => {
        const response = await chai
            .request(app)
            .put(`/users/update/${userTest.id}`)
            .set("authorization", `Bearer ${token}`)
            .send({
                pseudo: "testAfterUpdate",
                email: "testAfterUpdate@example.com",
            });

        expect(response).to.have.status(202);
        expect(response.body).to.have.property("error", 0);

        const test = await UserModel.findOne({ email: "testAfterUpdate@example.com" });
        expect(test.pseudo).to.not.equal("test");
    });

    it("Update user by id with partial input", async () => {
        const response = await chai
            .request(app)
            .put(`/users/update/${userTest.id}`)
            .set("authorization", `Bearer ${token}`)
            .send({
                pseudo: "testAfterUpdate2",
            });

        expect(response).to.have.status(202);
        expect(response.body).to.have.property("error", 0);

        const test = await UserModel.findOne({ email: "testAfterUpdate@example.com" });
        expect(test.pseudo).to.not.equal("testAfterUpdate");
    });

    it("Update user by id with invalid input", async () => {
        const response = await chai
            .request(app)
            .put(`/users/update/6707dd12437c7097898ca3db`)
            .set("authorization", `Bearer ${token}`)
            .send({
                pseudo: "testAfterUpdate",
                email: "testAfterUpdate@example.com",
            });

        expect(response).to.have.status(404);
        expect(response.body).to.have.property("error", 1);
    });

    it("Delete user self", async () => {
        const response = await chai
            .request(app)
            .delete("/users/delete")
            .set("authorization", `Bearer ${token}`)
            .send();

        expect(response).to.have.status(202);
        expect(response.body).to.have.property("error", 0);

        const admin = await UserModel.findOne({ email: "adminAfterUpdate@example.com" });
        expect(admin.deletedAt).to.not.be.null;
    });

    it("Delete user by id", async () => {
        const response = await chai
            .request(app)
            .delete(`/users/delete/${userTest.id}`)
            .set("authorization", `Bearer ${token}`)
            .send();

        expect(response).to.have.status(202);
        expect(response.body).to.have.property("error", 0);

        const test = await UserModel.findOne({ email: "testAfterUpdate@example.com" });
        expect(test.deletedAt).to.not.be.null;
    });

    it("Delete user by id with invalid input", async () => {
        const response = await chai
            .request(app)
            .delete(`/users/delete/6707dd12470c7097898ca3db`)
            .set("authorization", `Bearer ${token}`)
            .send();

        expect(response).to.have.status(404);
        expect(response.body).to.have.property("error", 1);
    });

    it("Set user role to admin", async () => {
        const response = await chai
            .request(app)
            .put(`/users/set/admin/${userTest.id}`)
            .set("authorization", `Bearer ${token}`)
            .send();

        expect(response).to.have.status(202);
        expect(response.body).to.have.property("error", 0);

        const test = await UserModel.findOne({ email: "testAfterUpdate@example.com" });
        expect(test.role).to.be.equal("admin");
    });

    it("Set user role to admin with invalid input", async () => {
        const response = await chai
            .request(app)
            .put(`/users/set/admin/6707dd12470c7097898ca3db`)
            .set("authorization", `Bearer ${token}`)
            .send();

        expect(response).to.have.status(404);
        expect(response.body).to.have.property("error", 1);
    });

    it("Set user role to employee", async () => {
        const response = await chai
            .request(app)
            .put(`/users/set/employee/${userTest.id}`)
            .set("authorization", `Bearer ${token}`)
            .send();

        expect(response).to.have.status(202);
        expect(response.body).to.have.property("error", 0);

        const test = await UserModel.findOne({ email: "testAfterUpdate@example.com" });
        expect(test.role).to.be.equal("employee");
    });

    it("Set user role to employee with invalid input", async () => {
        const response = await chai
            .request(app)
            .put(`/users/set/employee/6707dd12470c7097898ca3db`)
            .set("authorization", `Bearer ${token}`)
            .send();

        expect(response).to.have.status(404);
        expect(response.body).to.have.property("error", 1);
    });

    it("Set user role to user", async () => {
        const response = await chai
            .request(app)
            .put(`/users/set/user/${userTest.id}`)
            .set("authorization", `Bearer ${token}`)
            .send();

        expect(response).to.have.status(202);
        expect(response.body).to.have.property("error", 0);

        const test = await UserModel.findOne({ email: "testAfterUpdate@example.com" });
        expect(test.role).to.be.equal("user");
    });

    it("Set user role to user with invalid input", async () => {
        const response = await chai
            .request(app)
            .put(`/users/set/user/6707dd12470c7097898ca3db`)
            .set("authorization", `Bearer ${token}`)
            .send();

        expect(response).to.have.status(404);
        expect(response.body).to.have.property("error", 1);
    });

    after(async () => {
        await UserModel.findByIdAndDelete(userAdmin.id);
        await UserModel.findByIdAndDelete(userTest.id);
    });
});
