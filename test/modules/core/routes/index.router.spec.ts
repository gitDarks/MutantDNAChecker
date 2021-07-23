import chai from "chai";
import chaiHttp from "chai-http";
import sinon from "sinon";
import * as typeorm from "typeorm";
import app from "../../../../src/app";
import { ConnectionDB } from "../../../../src/modules/core/services/db/db.service";

// Configure chai
chai.use(chaiHttp);
chai.should();

const expect = chai.expect;

describe.skip("GET /", () => {
  let sandbox: any;
  beforeEach(async () => {
    sandbox = sinon.createSandbox();
    const fakeConnection = sinon.createStubInstance(typeorm.Connection);

    fakeConnection.close.returnsThis();
    sandbox.stub(typeorm, "createConnection").returns(fakeConnection as any);
    await ConnectionDB.getConnectionInstance();
  });

  afterEach(async () => {
    await ConnectionDB.closeConnection();
    sandbox.restore();
    sinon.restore();
  });

  it("should respond to /", (done) => {
    chai
      .request(app)
      .get("/")
      .end(async (err, res) => {
        expect(res.text).to.be.equals("OK");
        res.should.have.status(200);
        done();
      });
  });

  it("should fail on non-existent route", (done) => {
    chai
      .request(app)
      .get("/mypage")
      .end((err, res) => {
        res.should.have.status(404);
        done();
      });
  });
});
