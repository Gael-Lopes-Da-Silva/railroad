import chai from "chai";
import chaiHttp from "chai-http";
import app from "../server.js";
import User from "../routes/UserRouter.js";
import UserModel from "../models/UserModel.js";
import bcrypt from "bcrypt";
import { deleteUser } from "../controllers/UserController.js";

chai.use(chaiHttp);
const expect = chai.expect;

let userCreds;
let userToken;
let normalUserId;

let adminUser;
let adminToken;
let adminUserId;

// create / log / get / getid / update / updateid / delete / deleteid
before(async () => {
  userCreds = {
    pseudo: "TestUser1",
    email: "testuser@example.com",
    password: "Password123",
  };

  adminUser = await UserModel.create({
    pseudo: "AdminUser1",
    password: bcrypt.hashSync("AdminPassword123", 10),
    email: "adminuser@example.com",
    role: "admin",
  });
});

describe("User registration and login", () => {
  it("Should register a new user", async () => {
    const response = await chai
      .request(app)
      .post("/users/register")
      .send(userCreds);

    expect(response).to.have.status(201);
    expect(response.body).to.have.property("error", 0);
  });

  it("Should login an user and set the token linked to", async () => {
    const response = await chai
      .request(app)
      .post("/users/login")
      .send(userCreds);

    expect(response).to.have.status(200);
    expect(response.body).to.have.property("error", 0);
    expect(response.body).to.have.property("token").that.is.a("string"); // check is the token is here and a string

    userToken = response.body.token;
    normalUserId = response.body._id;
  });
});

describe("Admin registration and login", () => {
  it("Should login as admin", async () => {
    const response = await chai
      .request(app)
      .post(`/users/login`)
      .send({ email: "adminuser@example.com", password: "AdminPassword123" });

    expect(response).to.have.status(200);
    expect(response.body).to.have.property("error", 0);

    adminToken = response.body.token;
  });

  it("Should update another user's role to admin", async () => {
    const response = await chai
      .request(app)
      .post(`/users/set/admin/${normalUserId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ role: "admin" });

    console.log(response.body);

    expect(response).to.have.status(202);
    expect(response.body).to.have.property("error", 0);

    const updatedUser = await UserModel.findById(normalUserId);
    expect(updatedUser.role).to.equal("admin"); // Check if user is updated as admin in DB
  });
});

/* describe("User entity tests", () => {
  it("Should get the user", async () => {
    const response = await chai
      .request(app)
      .get(`/users/get/${normalUserId}`)
      .set("authorization", `Bearer ${userToken}`);

    expect(response).to.have.status(202);
    expect(response.body).to.have.property("error", 0);
  });
}); */

after(async () => {
  await deleteUser({ params: { id: adminUserId } });
});
