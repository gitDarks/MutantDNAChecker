import chai from "chai";
import chaiHttp from "chai-http";
import httpMocks from "node-mocks-http";
import sinon from "sinon";
import * as typeorm from "typeorm";
import { DNASequencesEntity } from "../../../../src/modules/core/entities/sequence.entity";
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

  const dna = ["ATGCGA", "CAGTGC", "TTATGT", "AGAAGG", "CCCCTA", "TCACTG"];
  const requestValidateDevice = httpMocks.createRequest({
    body: { dna: dna },
    headers: {},
    method: "GET",
    url: "/mutant",
  });
  const queryRunnerMock = {
    commitTransaction: () => Promise.resolve(),
    release: () => Promise.resolve(),
    rollbackTransaction: () => Promise.resolve(),
    startTransaction: () => Promise.resolve(),
  } as any;

  describe("Check if DNA sequence belongs to a mutant", () => {
    it("should return true when DNA is from mutant", () => {
      const isMutant = dNACheckerController.isMutant(dna);
      expect(isMutant).to.be.equal(true);
    });

    it("should save DNA Sequence", async () => {
      const returnEntity = new DNASequencesEntity();
      returnEntity.sequence = dna.toString();
      returnEntity.subjectType = "M";

      const fakeConnection = sinon.createStubInstance(typeorm.Connection);
      const fakeRepository = sinon.createStubInstance(typeorm.EntityManager);

      fakeRepository.findOne
        .onFirstCall()
        .returns(Promise.resolve(returnEntity));

      fakeRepository.save.returns(Promise.resolve(returnEntity));
      fakeRepository.delete.returns(Promise.resolve({ raw: 0, affected: 1 }));

      fakeConnection.createQueryRunner.returns({
        ...queryRunnerMock,
        manager: fakeRepository,
      } as any);

      fakeConnection.close.returnsThis();
      sandbox.stub(typeorm, "createConnection").returns(fakeConnection as any);
      await ConnectionDB.getConnectionInstance();

      const result = await dNACheckerController.saveDNASequence(
        dna.toString(),
        "M"
      );

      await ConnectionDB.closeConnection();
      expect(result.sequence).to.equal(dna.toString());
    });
  });
});
