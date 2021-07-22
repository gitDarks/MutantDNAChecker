import { ConnectionDB } from "../../core/services/db/db.service";
import { DNASequencesEntity } from "../../core/entities/sequence.entity";

export class StatsService {
  public async countDNASequencesBySubject(
    subjectType: string
  ): Promise<number> {
    try {
      const queryRunner = await ConnectionDB.getQueryRunner();
      // @ts-ignore
      const [sequences, count] = await queryRunner.manager.findAndCount(DNASequencesEntity, {
        subjectType,
      });
      return count;
    } catch (error) {
      console.log("[ERROR] couting DNA sequences by subject type %o", error);
      throw new Error(error);
    }
  }
}
