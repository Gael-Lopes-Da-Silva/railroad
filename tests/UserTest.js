import * as chai from "chai";
import chaiHttp from "chai-http";
import app from "../server.js";

chai.use(chaiHttp);
const expect = chai.expect;

let userCreds;

// create / log / get / getid / update / updateid / delete / deleteid
before(() => {
  userCreds = {
    pseudo: "TestUserTT",
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
    expect(response.body).to.have.property("pseudo");
  });
});

