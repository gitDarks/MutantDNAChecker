import chai from "chai";
import sinon from "sinon";
import * as typeorm from "typeorm";
import { ConnectionDB } from "../../../../../src/modules/core/services/db/db.service";

const expect = chai.expect;

describe("DB Service", () => {
  let sandbox: any;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
    sinon.restore();
  });

  it("should get alive connection", async () => {
    const fakeConnection = sinon.createStubInstance(typeorm.Connection);
    sinon.stub(typeorm, "getConnectionManager").resolves({
      connections: [fakeConnection, fakeConnection],
      get: () => {
        return {
          connect: () => fakeConnection,
          isConnected: true,
        };
      },
    });
    fakeConnection.close.returnsThis();
    sandbox.stub(typeorm, "createConnection").returns(fakeConnection as any);
    await ConnectionDB.getConnectionInstance();
    const connection = await ConnectionDB.getConnection();
    expect(connection).to.has.property("connect");
    await ConnectionDB.closeConnection();
  });

  it.skip("should return error on get connection", async () => {
    const fakeConnection = sinon.createStubInstance(typeorm.Connection);
    fakeConnection.createQueryRunner.throws("error");
    fakeConnection.close.returnsThis();
    sandbox.stub(typeorm, "createConnection").returns(fakeConnection);
    try {
      await ConnectionDB.getConnectionInstance();
    } catch (e) {
      await ConnectionDB.closeConnection();
      expect(e.message).to.be.eq("ERROR ON GET CONNECTION");
    }
  });

  it("should take else path on close connection", async () => {
    const spy = sinon.spy(ConnectionDB, "closeConnection");
    console.log("connection close => ", ConnectionDB);
    await ConnectionDB.closeConnection();
    expect(spy.calledOnce).to.be.true;
  });

  it("it should restore singleton if database connection fail", async () => {
    const spy = sinon.spy(ConnectionDB, "restoreSingleton");
    const fakeConnection = sinon.createStubInstance(typeorm.Connection);
    fakeConnection.close.returnsThis();

    sandbox
      .stub(typeorm, "createConnection")
      .onFirstCall()
      .throws(new Error("Handshake inactivity timeout"))
      .onSecondCall()
      .returns(fakeConnection);
    try {
      await ConnectionDB.getConnectionInstance();
    } catch (error) {
      expect(spy.calledOnce);
      expect(error.message).equal("ERROR ON GET CONNECTION");
    }
  });
});
