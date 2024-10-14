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

  it("Create train", async () => {
    // Get ObjectId from existing trainsations
    const startStation = await TrainstationModel.findOne({ name: "Paris" });
    const endStation = await TrainstationModel.findOne({ name: "Versailles" });
    const response = await chai
      .request(app)
      .post("/trains/create")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Ligne Paris-Versailles",
        start_station: startStation._id,
        end_station: endStation._id,
        departure_time: new Date(),
      });

    expect(response).to.have.status(201);
    expect(response.body).to.have.property("error", 0);

    trainTest = await TrainModel.findOne({ name: "Ligne Paris-Versailles" });
    expect(trainTest).to.not.be.null;
  });

  it("Get trains", async () => {
    const response = await chai
      .request(app)
      .post("/trains/get")
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(response).to.have.status(202);
    expect(response.body).to.have.property("error", 0);
  });

  it("Get train by id", async () => {
    const response = await chai
      .request(app)
      .post(`/trains/get/${trainTest.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(response).to.have.status(202);
    expect(response.body).to.have.property("error", 0);
  });

  it("Update train by id", async () => {
    const response = await chai
      .request(app)
      .post(`/trains/update/${trainTest.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Ligne Paris-Versailles-Orléans",
      });

    expect(response).to.have.status(202);
    expect(response.body).to.have.property("error", 0);

    const test = await TrainModel.findOne({
      name: "Ligne Paris-Versailles-Orléans",
    });

    expect(test.name).to.not.equal(trainTest.name);
  });

  it("Delete train by id", async () => {
    const response = await chai
      .request(app)
      .post(`/trains/delete/${trainTest.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(response).to.have.status(202);
    expect(response.body).to.have.property("error", 0);
  });
  
  after(async () => {
    await UserModel.findByIdAndDelete(userAdmin.id);
  });
});
