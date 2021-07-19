import { Nucleotide } from "../models/nucleotide";

export class DNAChecker {
  private dnaMatrixFull: Nucleotide[][] = [];
  private dnaMatrix: string[][] = [];
  private matchCounter: number = 1;
  private sequenceCounter: number = 0;

  private mapDnaMatrix(dna: string[]) {
    this.dnaMatrixFull = new Array<Nucleotide[]>();
    let line: string[] = [];

    dna.forEach((value: string, j: number) => {
      line = value.split("");
      const row: Nucleotide[] = new Array<Nucleotide>();
      line.forEach((nucleotide, i) => {
        row.push(new Nucleotide(nucleotide, i, j));
      });
      this.dnaMatrixFull.push(row);
    });
  }

  private checkRight(i: number, j: number): boolean {
    console.log("check right");

    if (
      this.dnaMatrixFull[i][j].getValue() ===
      this.dnaMatrixFull[i][j + 1].getValue()
    ) {
      console.log("match right");
      this.matchCounter++;
      this.dnaMatrixFull[i][j + 1].setRight(true);

      return this.matchCounter === 4 ? true : this.checkRight(i, j + 1);
    }
    this.dnaMatrixFull[i][j].setRight(false);
    this.matchCounter = 1;
    return false;
  }

  private checkRightDown(i: number, j: number): boolean {
    console.log("check right down");

    if (
      this.dnaMatrixFull[i][j].getValue() ===
      this.dnaMatrixFull[i + 1][j + 1].getValue()
    ) {
      console.log("match right down");
      this.matchCounter++;
      this.dnaMatrixFull[i][j + 1].setRightDown(true);

      return this.matchCounter === 4 ? true : this.checkRightDown(i + 1, j + 1);
    }
    this.dnaMatrixFull[i][j].setRightDown(false);
    this.matchCounter = 1;
    return false;
  }

  private checkDown(i: number, j: number): boolean {
    console.log("check down");

    if (
      this.dnaMatrixFull[i][j].getValue() ===
      this.dnaMatrixFull[i + 1][j].getValue()
    ) {
      console.log("match down");
      this.matchCounter++;
      this.dnaMatrixFull[i][j + 1].setDown(true);

      return this.matchCounter === 4 ? true : this.checkDown(i, j + 1);
    }
    this.dnaMatrixFull[i][j].setDown(false);
    this.matchCounter = 1;
    return false;
  }

  private checkLeftDown(i: number, j: number): boolean {
    console.log("check left down");

    if (
      this.dnaMatrixFull[i][j].getValue() ===
      this.dnaMatrixFull[i + 1][j - 1].getValue()
    ) {
      console.log("match left down");
      this.matchCounter++;
      this.dnaMatrixFull[i][j + 1].setLeftDown(true);

      return this.matchCounter === 4 ? true : this.checkLeftDown(i + 1, j - 1);
    }
    this.dnaMatrixFull[i][j].setLeftDown(false);
    this.matchCounter = 1;
    return false;
  }

  public isMutant(dna: string[]): boolean {
    console.log("---isMutant---");
    const initTime = new Date().valueOf();

    // Mapear valores de la secuencia en arreglo bidimencional NxN
    this.mapDnaMatrix(dna);

    // Verificar secuencia de ADN
    const size = dna.length;
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        console.log(this.dnaMatrixFull[i][j].getValue());
        console.log("i: " + i + " - j: " + j + " - lenght-4: " + (size - 4));

        if (
          i <= size &&
          j <= size - 4 &&
          !this.dnaMatrixFull[i][j].getRight()
        ) {
          this.sequenceCounter = this.checkRight(i, j)
            ? this.sequenceCounter + 1
            : this.sequenceCounter;
        }

        if (
          i <= size - 4 &&
          j <= size - 4 &&
          !this.dnaMatrixFull[i][j].getRightDown()
        ) {
          this.sequenceCounter = this.checkRightDown(i, j)
            ? this.sequenceCounter + 1
            : this.sequenceCounter;
        }

        if (i <= size - 4 && j <= size && !this.dnaMatrixFull[i][j].getDown()) {
          this.sequenceCounter = this.checkDown(i, j)
            ? this.sequenceCounter + 1
            : this.sequenceCounter;
        }

        if (
          i <= size - 4 &&
          j >= 3 &&
          !this.dnaMatrixFull[i][j].getLeftDown()
        ) {
          this.sequenceCounter = this.checkLeftDown(i, j)
            ? this.sequenceCounter + 1
            : this.sequenceCounter;
        }
      }
    }

    const endTime = new Date().valueOf();
    console.log("exec time: ", (endTime - initTime) / 1000);
    return this.sequenceCounter === 2 ? true : false;
  }
}
