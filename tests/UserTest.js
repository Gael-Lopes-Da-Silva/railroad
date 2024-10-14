import chai from "chai";
import chaiHttp from "chai-http";
import app from "../server.js";
import User from "../routes/UserRouter.js";

chai.use(chaiHttp);
const expect = chai.expect;

let userCreds;
let userToken;
let normalUserId;

let adminCreds;
let adminToken;
let adminUserId;

// create / log / get / getid / update / updateid / delete / deleteid
before(async () => {
  userCreds = {
    pseudo: "TestUser1",
    email: "testuser@example.com",
    password: "Password123",
  };

  adminCreds = {
    pseudo: "AdminUser1",
    email: "adminuser@example.com",
    password: "AdminPassword123",
  };
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

    userToken = response.body.accessToken;
    normalUserId = response.body._id;
  });
});

describe("Admin registration and login", () => {
  it("Should register a second user (future admin)", async () => {
    const response = await chai
      .request(app)
      .post("/users/register")
      .send(adminCreds);

    expect(response).to.have.status(201);
    expect(response.body).to.have.property("error", 0);

    adminUserId = response.body._id;
  });

  it("Should promote an user to admin directly in the database", async () => {
    // Create a temp admin in the DB
    await User.updateUser ({ _id: adminUserId }, { role: "admin" });
  });

  it("Shoud log in as the promoted admin user", async () => {
    const response = await chai
      .request(app)
      .post("/users/login")
      .send(adminCreds);

    expect(response).to.have.status(200);
    expect(response.body).to.have.property("token");

    adminToken = response.body.token;
  });

  it("Should update another user's role to admin", async () => {
    const response = await chai
      .request(app)
      .post(`/users/set/admin/${adminUserId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ role: "admin" });

    expect(response).to.have.status(200);
    expect(response.body).to.have.property("error", 0);
  });
});

describe("User entity tests", () => {
  it("Should get the user", async () => {
    const response = await chai
      .request(app)
      .get(`users/get/${normalUserId}`)
      .set("authorization", `Bearer ${userToken}`);

    expect(response).to.have.status(200);
    expect(response.body).to.have.property("pseudo", userCreds.pseudo);
  });
});
