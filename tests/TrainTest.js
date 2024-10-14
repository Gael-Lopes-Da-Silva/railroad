import chai from "chai";
import chaiHttp from "chai-http";
import bcrypt from "bcrypt";
import app from "../server.js";

import UserModel from "../models/UserModel.js";
import TrainModel from "../models/TrainModel.js";

chai.use(chaiHttp);
const expect = chai.expect;

describe("Tests for Train", () => {
    let userAdmin = {};
    let trainTest = {};
    
    let token = "";

    before(async () => {
        userAdmin = await UserModel.create({
            pseudo: "admin",
            password: bcrypt.hashSync("admin123", 10),
            email: "admin@example.com",
            role: "admin",
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

    // it("Create train", async () => {
    //     const response = await chai
    //         .request(app)
    //         .post("/trains/create")
    //         .send({
                
    //         });

    //     expect(response).to.have.status(201);
    //     expect(response.body).to.have.property("error", 0);

    //     trainTest = await TrainModel.findOne({ });
    // });

    after(async () => {
        await UserModel.findByIdAndDelete(userAdmin.id);
    });
});
