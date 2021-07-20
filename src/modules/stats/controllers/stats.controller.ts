import { ConnectionDB } from "../../core/services/db/db.service";
import { StatsService } from "../services/db/stats.service";

export class Stats {
  private countMutantDna: number;
  private countHumanDna: number;
  private ratio: number;

  private readonly statsService: StatsService;

  constructor() {
    this.statsService = new StatsService();
  }

  public async getStats(): Promise<string> {
    await this.calcRatio();
    return (
      '"count_mutant_dna": ' +
      this.countMutantDna +
      ', "count_human_dna": ' +
      this.countHumanDna +
      ', "ratio": ' +
      this.ratio
    );
  }

  private async calcRatio() {
    /* Contar los registros en base de datos de las secuencias de ADN de mutantes y humanos
    Si la cantidad de mutantes es cero, el ratio es cero
    Si la cantidad de humanos es cero, el ratio es 1 o la cantidad de mutantes / la cantidad de mutantes
    de lo contrario el ratio es la cantidad de mutantes/la cantidad de humanos */
    try {
      await ConnectionDB.getConnectionInstance();

      this.countMutantDna = await this.statsService.countDNASequencesBySubject(
        "M"
      );
      this.countHumanDna = await this.statsService.countDNASequencesBySubject(
        "H"
      );
      await ConnectionDB.closeConnection();

      this.ratio =
        this.countMutantDna > 0
          ? this.countMutantDna /
            (this.countHumanDna > 0 ? this.countHumanDna : this.countMutantDna)
          : 0;
    } catch (e) {
      await ConnectionDB.closeConnection();
      throw new Error(e);
    }
  }
}