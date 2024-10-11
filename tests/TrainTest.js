import chai from "chai";
import chaiHttp from "chai-http";
import app from "../server.js";

chai.use(chaiHttp);
const expect = chai.expect;

let firstTrainId

/* describe("Train routes", () => {
  it("Should add a new train", async () => {
    const newTrain = {
      name: "TGV ligne Grand Est",
      start_station: "6707bf7690233d02a3227ae4", // Paris
      end_station: "6708c96b6563110bf9b19e8d", // Strasbourg
      departure_time: "2024-10-11T09:00:00.000Z",
    };

    const response = (
      await chai
        .request(app)
        .post("/trains/create")
        .set("authorization", `Bearer ${adminToken}`)
    ).setEncoding(newTrain);

    expect(response).to.have.status(200)
    expect(response.body).to.have.property("_id")

    firstTrainId = response.body._id
    )
  });
}); */
