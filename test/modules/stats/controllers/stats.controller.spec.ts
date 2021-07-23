import chai from "chai";
import chaiHttp from "chai-http";
import httpMocks from "node-mocks-http";
import sinon from "sinon";
import * as typeorm from "typeorm";
import { DNASequencesEntity } from "../../../../src/modules/core/entities/sequence.entity";
import { ConnectionDB } from "../../../../src/modules/core/services/db/db.service";
import dNACheckerController from "../../../../src/modules/dna-checker/controllers/dna-checker.controller";
import statsController from "../../../../src/modules/stats/controllers/stats.controller";

// Configure chai
chai.use(chaiHttp);
chai.should();
const expect = chai.expect;

describe("Stats Controller Tests", () => {
  let sandbox: any;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
    sinon.restore();
  });

  const requestValidateDevice = httpMocks.createRequest({
    body: {},
    headers: {},
    method: "GET",
    url: "/stats",
  });
  const queryRunnerMock = {
    commitTransaction: () => Promise.resolve(),
    release: () => Promise.resolve(),
    rollbackTransaction: () => Promise.resolve(),
    startTransaction: () => Promise.resolve(),
  } as any;

  describe("Get stats ratio from database", () => {
    it("should return 0.4", async () => {
      const resultString = '"count_mutant_dna": 40, "count_human_dna": 100, "ratio": 0.4';
      const sequences: DNASequencesEntity[] = [];
      const fakeConnection = sinon.createStubInstance(typeorm.Connection);
      const fakeRepository = sinon.createStubInstance(typeorm.EntityManager);

      fakeRepository.findAndCount
        .onFirstCall()
        .returns(Promise.resolve([sequences, 40]))
        .onSecondCall()
        .returns(Promise.resolve([sequences, 100]));

      fakeConnection.createQueryRunner.returns({
        ...queryRunnerMock,
        manager: fakeRepository,
      } as any);

      fakeConnection.close.returnsThis();
      sandbox.stub(typeorm, "createConnection").returns(fakeConnection as any);
      await ConnectionDB.getConnectionInstance();

      const stats = await statsController.getStats();

      await ConnectionDB.closeConnection();
      expect(stats).to.equal(resultString);
    });
  });
});
