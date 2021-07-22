import { Nucleotide } from "../models/nucleotide.model";
import { SearchContext } from "./searching-strategies/context";
import { SearchRightStrategy } from "./searching-strategies/concrete-strategies/search-right-strategy";
import { SearchRightDownStrategy } from "./searching-strategies/concrete-strategies/search-rigth-down-strategy";
import { SearchDownStrategy } from "./searching-strategies/concrete-strategies/search-down-strategy";
import { SearchLeftDownStrategy } from "./searching-strategies/concrete-strategies/search-left-down-strategy";
import { DNASequencesEntity } from "../../core/entities/sequence.entity";
import { DnaSequenceService } from "../services/dna_sequence.service";
import { ConnectionDB } from "../../core/services/db/db.service";

export class DNAChecker {
  dnaMatrixFull: Nucleotide[][] = [];
  private sequenceCounter: number = 0;
  private context: SearchContext;

  private readonly dnaSequenceService: DnaSequenceService;

  constructor() {
    this.dnaSequenceService = new DnaSequenceService();
  }

  public async isMutant(dna: string[]): Promise<boolean> {
    const size = dna.length;
    const initTime = new Date().valueOf();

    // Mapeamos el array de entrada en un array 2D para hacer las busquedas en profundidad
    this.mapDnaMatrix(dna);

    // Verificar secuencia de ADN
    this.context = new SearchContext(size);
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        /*Realizar comparación con los nucleotidos de la horizontal a la derecha usando la estrategia de
        busqueda en profundidad, si encuentra una secuencia aumenta el contador de secuencias*/
        this.context.setStrategy(new SearchRightStrategy());
        this.sequenceCounter = this.context.search(i, j, this.dnaMatrixFull)
          ? this.sequenceCounter + 1
          : this.sequenceCounter;

        /*Realizar comparación con los nucleotidos de la diagonal derecha hacia abajo usando la
        estrategia de busqueda en profundidad, si encuentra una secuencia aumenta el contador de
        secuencias*/
        this.context.setStrategy(new SearchRightDownStrategy());
        this.sequenceCounter = this.context.search(i, j, this.dnaMatrixFull)
          ? this.sequenceCounter + 1
          : this.sequenceCounter;

        /*Realizar comparación con los nucleotidos de la vertical hacia abajo usando la estrategia de
        busqueda en profundidad, si encuentra una secuencia aumenta el contador de secuencias*/
        this.context.setStrategy(new SearchDownStrategy());
        this.sequenceCounter = this.context.search(i, j, this.dnaMatrixFull)
          ? this.sequenceCounter + 1
          : this.sequenceCounter;

        /*Realizar comparación con los nucleotidos de la diagonal izquierda hacia abajo usando la
        estrategia de busqueda en profundidad, si encuentra una secuencia aumenta el contador de
        secuencias*/
        this.context.setStrategy(new SearchLeftDownStrategy());
        this.sequenceCounter = this.context.search(i, j, this.dnaMatrixFull)
          ? this.sequenceCounter + 1
          : this.sequenceCounter;
      }
    }

    /*no es necesario buscar en otras direcciones puesto que ya toda la matriz fue cubierta
    Si se encontraron 2 o más secuencias se determina que el DNA es de un mutante*/
    const isMutantDNA = this.sequenceCounter >= 2 ? true : false;

    // almacenar en BD
    // await this.saveDNASequence(dna.toString(), isMutantDNA ? "M" : "H");

    const endTime = new Date().valueOf();
    console.log("exec time: ", (endTime - initTime) / 1000);
    return isMutantDNA;
  }

  private mapDnaMatrix(dna: string[]) {
    this.dnaMatrixFull = new Array<Nucleotide[]>();
    let line: string[] = [];

    dna.forEach((value: string, j: number) => {
      line = value.split("");
      const row: Nucleotide[] = new Array<Nucleotide>();
      line.forEach((nucleotide, i) => {
        row.push(new Nucleotide(nucleotide));
      });
      this.dnaMatrixFull.push(row);
    });
  }

  public async saveDNASequence(dna: string, subjectType: string) {
    try {
      await ConnectionDB.getConnectionInstance();
      const dnaEntity = new DNASequencesEntity();
      dnaEntity.sequence = dna;
      dnaEntity.subjectType = subjectType;

      await this.dnaSequenceService.saveDNASequence(dnaEntity);
      ConnectionDB.closeConnection();
    } catch (e) {
      console.log("saveDNASequence Error: ", e);
      ConnectionDB.closeConnection();
      throw new Error(e);
    }
  }
}
