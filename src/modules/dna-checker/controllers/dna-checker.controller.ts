import { Nucleotide } from "../models/nucleotide.model";
import { SearchContext } from "./searching-strategies/context";
import { SearchRightStrategy } from "./searching-strategies/concrete-strategies/search-right-strategy";
import { SearchRightDownStrategy } from "./searching-strategies/concrete-strategies/search-rigth-down-strategy";
import { SearchDownStrategy } from "./searching-strategies/concrete-strategies/search-down-strategy";
import { SearchLeftDownStrategy } from "./searching-strategies/concrete-strategies/search-left-down-strategy";
import { DNASequencesEntity } from "../../core/entities/sequence.entity";
import { DnaSequenceService } from "../services/dna_sequence.service";
import { ConnectionDB } from "../../core/services/db/db.service";
import { IMutantDNARequestModel } from "../models/request.model";
import { Request, Response } from "express";

export class DNAChecker {
  private dnaMatrixFull: Nucleotide[][] = [];
  private sequenceCounter: number = 0;
  private context: SearchContext;

  private readonly dnaSequenceService: DnaSequenceService;

  constructor() {
    this.dnaSequenceService = new DnaSequenceService();
  }

  private isMutant(dna: string[]): boolean {
    const size = dna.length;
    const initTime = new Date().valueOf();

    // Mapeamos el array de entrada en un array 2D para hacer las busquedas en profundidad
    dNACheckerController.mapDnaMatrix(dna);

    // Verificar secuencia de ADN
    dNACheckerController.context = new SearchContext(size);
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        /*Realizar comparación con los nucleotidos de la horizontal a la derecha usando la estrategia de
        busqueda en profundidad, si encuentra una secuencia aumenta el contador de secuencias*/
        dNACheckerController.context.setStrategy(new SearchRightStrategy());
        dNACheckerController.sequenceCounter =
          dNACheckerController.context.search(
            i,
            j,
            dNACheckerController.dnaMatrixFull
          )
            ? dNACheckerController.sequenceCounter + 1
            : dNACheckerController.sequenceCounter;

        /*Realizar comparación con los nucleotidos de la diagonal derecha hacia abajo usando la
        estrategia de busqueda en profundidad, si encuentra una secuencia aumenta el contador de
        secuencias*/
        dNACheckerController.context.setStrategy(new SearchRightDownStrategy());
        dNACheckerController.sequenceCounter =
          dNACheckerController.context.search(
            i,
            j,
            dNACheckerController.dnaMatrixFull
          )
            ? dNACheckerController.sequenceCounter + 1
            : dNACheckerController.sequenceCounter;

        /*Realizar comparación con los nucleotidos de la vertical hacia abajo usando la estrategia de
        busqueda en profundidad, si encuentra una secuencia aumenta el contador de secuencias*/
        dNACheckerController.context.setStrategy(new SearchDownStrategy());
        dNACheckerController.sequenceCounter =
          dNACheckerController.context.search(
            i,
            j,
            dNACheckerController.dnaMatrixFull
          )
            ? dNACheckerController.sequenceCounter + 1
            : dNACheckerController.sequenceCounter;

        /*Realizar comparación con los nucleotidos de la diagonal izquierda hacia abajo usando la
        estrategia de busqueda en profundidad, si encuentra una secuencia aumenta el contador de
        secuencias*/
        dNACheckerController.context.setStrategy(new SearchLeftDownStrategy());
        dNACheckerController.sequenceCounter =
          dNACheckerController.context.search(
            i,
            j,
            dNACheckerController.dnaMatrixFull
          )
            ? dNACheckerController.sequenceCounter + 1
            : dNACheckerController.sequenceCounter;
      }
    }

    /*no es necesario buscar en otras direcciones puesto que ya toda la matriz fue cubierta
    Si se encontraron 2 o más secuencias se determina que el DNA es de un mutante*/
    const isMutantDNA =
      dNACheckerController.sequenceCounter >= 2 ? true : false;

    const endTime = new Date().valueOf();
    console.log("exec time: ", (endTime - initTime) / 1000);
    return isMutantDNA;
  }

  private mapDnaMatrix(dna: string[]) {
    dNACheckerController.dnaMatrixFull = new Array<Nucleotide[]>();
    let line: string[] = [];

    dna.forEach((value: string, j: number) => {
      line = value.split("");
      const row: Nucleotide[] = new Array<Nucleotide>();
      line.forEach((nucleotide, i) => {
        row.push(new Nucleotide(nucleotide));
      });
      dNACheckerController.dnaMatrixFull.push(row);
    });
  }

  private async saveDNASequence(
    dna: string,
    subjectType: string
  ): Promise<DNASequencesEntity> {
    try {
      const dnaEntity = new DNASequencesEntity();
      dnaEntity.sequence = dna;
      dnaEntity.subjectType = subjectType;

      const result =
        await dNACheckerController.dnaSequenceService.saveDNASequence(
          dnaEntity
        );

      await ConnectionDB.closeConnection();
      return result;
    } catch (e) {
      console.log("saveDNASequence Error: ", e);
      await ConnectionDB.closeConnection();
      throw new Error(e);
    }
  }

  public checkisMutant(rq: Request, rs: Response) {
    try {
      // Leer secuencia de ADN desde el request
      const request = rq.body as IMutantDNARequestModel;
      const dnaSequence = request.dna;
      const isMutant = dNACheckerController.isMutant(dnaSequence);
      // almacenar en BD
      dNACheckerController.saveDNASequence(
        dnaSequence.toString(),
        isMutant ? "M" : "H"
      );

      if (isMutant) {
        rs.status(200).send("200-OK");
      } else {
        rs.status(403).send("403-Forbidden");
      }
    } catch (error) {
      return rs
        .status(500)
        .send({ error: error.message || JSON.stringify(error) });
    }
  }
}

const dNACheckerController = new DNAChecker();
export default dNACheckerController;
