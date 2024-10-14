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
  let trainstationDepartureTest = {};
  let trainsationArrivalTest = {};
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

    trainstationDepartureTest = await TrainstationModel.create({
      name: "Perpignan",
      open_hour: "06:00",
      close_hour: "22:45",
      image:
        "2JqBZv+zHtP9LfPmzNZ/CkBDTupH8YKKv8YJzZ2bLrfQPwUdrpLNQwDc4Gp8ysYZJ2XY5aQ9ab7oLRXXpGRL1fnfZKqW93OPJDf",
    });

    trainsationArrivalTest = await TrainstationModel.create({
      name: "Toulouse",
      open_hour: "05:00",
      close_hour: "23:45",
      image:
        "2JqBZv+zHtP9LfPmzNZ/CkfeaupH8YKKv8YJzZ2bLrfQPwUdrpLNQwDc4Gp8ysYZJ2XY5aQ9ab7oLRXXpGRL1fnfZKqW93OPJDf",
    });
  });

  it("Create train", async () => {
    trainstationDepartureTest = await TrainstationModel.findOne({
      name: "Perpignan",
    });
    trainsationArrivalTest = await TrainstationModel.findOne({
      name: "Toulouse",
    });
    const response = await chai
      .request(app)
      .post("/trains/create")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Ligne Perpignan-Toulouse",
        start_station: trainstationDepartureTest._id,
        end_station: trainsationArrivalTest._id,
        departure_time: new Date(),
      });

    expect(response).to.have.status(201);
    expect(response.body).to.have.property("error", 0);

    trainTest = await TrainModel.findOne({ name: "Ligne Perpignan-Toulouse" });
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
        name: "Ligne Perpignan-Toulouse-Bordeaux",
      });

    expect(response).to.have.status(202);
    expect(response.body).to.have.property("error", 0);

    const test = await TrainModel.findOne({
      name: "Ligne Perpignan-Toulouse-Bordeaux",
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
    await TrainModel.findByIdAndDelete()
  });
});
