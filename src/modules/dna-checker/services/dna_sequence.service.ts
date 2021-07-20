import { DNASequencesEntity } from "../../core/entities/sequence.entity";
import { ConnectionDB } from "../../core/services/db/db.service";

export class DnaSequenceService {
  public async saveDNASequence(
    dnaSequence: DNASequencesEntity
  ): Promise<DNASequencesEntity> {
    const queryRunner = await ConnectionDB.getQueryRunner();
    try {
      await ConnectionDB.startTransaction(queryRunner);
      console.log("[INFO] queryRunner.manager.save %o", dnaSequence);
      const dnaSequenceSaved = await queryRunner.manager.save(
        DNASequencesEntity,
        dnaSequence
      );
      await ConnectionDB.commitTransaction(queryRunner);
      return dnaSequenceSaved;
    } catch (e) {
      await ConnectionDB.rollbackTransaction(queryRunner);
      throw new Error("Error saving DNA Sequence" + e);
    }
  }
}
