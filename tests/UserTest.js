import chai from "chai";
import chaiHttp from "chai-http";
import app from "../server.js";
import User from "../routes/UserRouter.js";

chai.use(chaiHttp);
const expect = chai.expect;

let userCreds;
let userToken;
let normalUserId;

// create / log / get / getid / update / updateid / delete / deleteid
before(() => {
  userCreds = {
    pseudo: "TestUser1",
    email: "testuser@example.com",
    password: "Password123",
  };
});

describe("User registration and login", () => {
  it("Should register a new user", async () => {
    const response = await chai
      .request(app)
      .post("/users/register")
      .send(userCreds);

    expect(response).to.have.status(201);
    expect(response.body).to.have.property(
      "message",
      "User registered successfully !" // checker l'erreur et pas le message directement
    );
    expect(response.body).to.have.property("error", 0);
  });

  it("Should login an user and set the token linked to", async () => {
    const response = await chai
      .request(app)
      .post("/users/login")
      .send(userCreds);

    expect(response).to.have.status(200);
    expect(response.body).to.have.property(
      "message",
      "User logged successfully !"
    );
    expect(response.body).to.have.property("error", 0);

    userToken = response.body.accessToken;
    normalUserId = response.body._id;
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
