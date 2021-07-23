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
import { json } from "body-parser";

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

  private mapDnaMatrix(dna: string[]): boolean {
    dNACheckerController.dnaMatrixFull = new Array<Nucleotide[]>();
    let line: string[] = [];
    let val: boolean = true;

    // Dado que la longitud máxima permitida en la BD es de 400, solo se puede tener una secuencia de 14X14
    if (dna && dna.length > 4 && dna.length <= 14) {
      for (const value of dna) {
        line = value.split("");
        // Verificar que la secuencia de ADN sea de NXN
        if (dna.length === value.length) {
          const row: Nucleotide[] = new Array<Nucleotide>();
          for (const nucleotide of line) {
            // verificar que el nucleótido sea válido
            if (["A", "C", "G", "T"].includes(nucleotide)) {
              row.push(new Nucleotide(nucleotide));
            } else {
              val = false;
              break;
            }
          }
          dNACheckerController.dnaMatrixFull.push(row);
        } else {
          val = false;
          break;
        }
      }
    } else {
      val = false;
    }

    return val;
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

      // Validamos el request y mapeamos el array de entrada en un array 2D para hacer las busquedas en profundidad
      const isValidRequest = dNACheckerController.mapDnaMatrix(dnaSequence);
      if (isValidRequest) {
        // Verificar si el ADN es mutante
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
      } else {
        rs.status(400).send("400-Bad request");
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
