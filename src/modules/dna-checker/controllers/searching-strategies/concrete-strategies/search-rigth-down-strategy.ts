import { Nucleotide } from "../../../models/nucleotide.model";
import { ISearchStrategy } from "../i-strategy";

export class SearchRightDownStrategy implements ISearchStrategy {
  private matchCounter: number = 1;
  private dnaMatrix: Nucleotide[][] = [];

  search(
    i: number,
    j: number,
    size: number,
    dnaMatrix: Nucleotide[][]
  ): boolean {
    if (i <= size - 4 && j <= size - 4 && !dnaMatrix[i][j].getRightDown()) {
      this.dnaMatrix = dnaMatrix;
      return this.check(i, j);
    }
    return false;
  }

  check(i: number, j: number): boolean {
    if (
      this.dnaMatrix[i][j].getValue() ===
      this.dnaMatrix[i + 1][j + 1].getValue()
    ) {
      this.matchCounter++;
      this.dnaMatrix[i][j + 1].setRightDown(true);

      return this.matchCounter === 4 ? true : this.check(i + 1, j + 1);
    }
    this.dnaMatrix[i][j].setRightDown(false);
    this.matchCounter = 1;
    return false;
  }
}
