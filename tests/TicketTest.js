import chai from "chai";
import chaiHttp from "chai-http";
import bcrypt from "bcrypt";
import app from "../server.js";

import UserModel from "../models/UserModel.js";
import TicketModel from "../models/TicketModel.js";

chai.use(chaiHttp);
const expect = chai.expect;

describe("Tests for Ticket", () => {
    let userAdmin = {};
    let ticketTest = {};
    
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

    // it("Book ticket", async () => {
    //     const response = await chai
    //         .request(app)
    //         .post("/ticket/book")
    //         .send({
                
    //         });

    //     expect(response).to.have.status(201);
    //     expect(response.body).to.have.property("error", 0);

    //     ticketTest = await ticketModel.findOne({ });
    // });

    after(async () => {
        await UserModel.findByIdAndDelete(userAdmin.id);
    });
});
