import chai from "chai";
import chaiHttp from "chai-http";
import httpMocks from "node-mocks-http";
import sinon from "sinon";
import * as typeorm from "typeorm";
import { ConnectionDB } from "../../../../src/modules/core/services/db/db.service";
import dNACheckerController from "../../../../src/modules/dna-checker/controllers/dna-checker.controller";

// Configure chai
chai.use(chaiHttp);
chai.should();
const expect = chai.expect;

describe("DNA Checker Controller Tests", () => {
  let sandbox: any;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
    sinon.restore();
  });

  const mutanDNA = ["ATGCGA", "CAGTGC", "TTATGT", "AGAAGG", "CCCCTA", "TCACTG"];
  const humanDNA = ["ATGCGA", "CAGTGC", "TTATTT", "AGACGG", "GCGTCA", "TCACTG"];

  const requestMutantDNAChecker = httpMocks.createRequest({
    body: { dna: mutanDNA },
    headers: {},
    method: "POST",
    url: "/mutant",
  });

  const requestHumanDNAChecker = httpMocks.createRequest({
    body: { dna: humanDNA },
    headers: {},
    method: "POST",
    url: "/mutant",
  });

  const response = httpMocks.createResponse();

  const queryRunnerMock = {
    commitTransaction: () => Promise.resolve(),
    release: () => Promise.resolve(),
    rollbackTransaction: () => Promise.resolve(),
    startTransaction: () => Promise.resolve(),
  } as any;

  describe("Check if DNA sequence belongs to a mutant", () => {
    it("should return 200 when DNA is from mutant", async () => {
      const fakeConnection = sinon.createStubInstance(typeorm.Connection);
      const fakeRepository = sinon.createStubInstance(typeorm.EntityManager);

      fakeRepository.findOne.onFirstCall().returns(Promise.resolve({}));

      fakeRepository.save.returns(
        Promise.resolve(requestMutantDNAChecker.toString)
      );
      fakeRepository.delete.returns(Promise.resolve({ raw: 0, affected: 1 }));

      fakeConnection.createQueryRunner.returns({
        ...queryRunnerMock,
        manager: fakeRepository,
      } as any);

      fakeConnection.close.returnsThis();
      sandbox.stub(typeorm, "createConnection").returns(fakeConnection as any);
      await ConnectionDB.getConnectionInstance();
      dNACheckerController.checkisMutant(requestMutantDNAChecker, response);
      await ConnectionDB.closeConnection();
      expect(response.statusCode).to.be.equal(200);
    });
  });
});
