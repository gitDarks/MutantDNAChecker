import { Nucleotide } from "../../../models/nucleotide.model";
import { ISearchStrategy } from "../i-strategy";

export class SearchRightStrategy implements ISearchStrategy {
  private matchCounter: number = 1;
  private dnaMatrix: Nucleotide[][] = [];

  search(
    i: number,
    j: number,
    size: number,
    dnaMatrix: Nucleotide[][]
  ): boolean {
    if (i <= size && j <= size - 4 && !dnaMatrix[i][j].getRight()) {
      this.dnaMatrix = dnaMatrix;
      return this.check(i, j);
    }
    return false;
  }

  check(i: number, j: number): boolean {
    if (
      this.dnaMatrix[i][j].getValue() === this.dnaMatrix[i][j + 1].getValue()
    ) {
      this.matchCounter++;
      this.dnaMatrix[i][j + 1].setRight(true);

      return this.matchCounter === 4 ? true : this.check(i, j + 1);
    }
    this.dnaMatrix[i][j].setRight(false);
    this.matchCounter = 1;
    return false;
  }
}
