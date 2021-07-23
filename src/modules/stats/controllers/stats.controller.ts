import { ConnectionDB } from "../../core/services/db/db.service";
import { StatsService } from "../services/stats.service";
import { Request, Response } from "express";

export class Stats {
  private countMutantDna: number;
  private countHumanDna: number;
  private ratio: number;

  public statsService: StatsService;

  constructor() {
    this.statsService = new StatsService();
  }

  public async getStats(rq: Request, rs: Response) {
    /* Contar los registros en base de datos de las secuencias de ADN de mutantes y humanos
    Si la cantidad de mutantes es cero, el ratio es cero
    Si la cantidad de humanos es cero, el ratio es 1 o la cantidad de mutantes / la cantidad de mutantes
    de lo contrario el ratio es la cantidad de mutantes/la cantidad de humanos */
    try {
      statsController.countMutantDna =
        (await statsController.statsService.countDNASequencesBySubject("M")) ||
        0;
      statsController.countHumanDna =
        (await statsController.statsService.countDNASequencesBySubject("H")) ||
        0;
      statsController.ratio =
        statsController.countMutantDna > 0
          ? statsController.countMutantDna /
            (statsController.countHumanDna > 0
              ? statsController.countHumanDna
              : statsController.countMutantDna)
          : 0;

      await ConnectionDB.closeConnection();

      const result =
        '"count_mutant_dna": ' +
        statsController.countMutantDna +
        ', "count_human_dna": ' +
        statsController.countHumanDna +
        ', "ratio": ' +
        statsController.ratio;

      return rs.status(200).send("Stats are: " + result);
    } catch (error) {
      await ConnectionDB.closeConnection();
      return rs
        .status(500)
        .send({ error: error.message || JSON.stringify(error) });
    }
  }
}

const statsController = new Stats();
export default statsController;
