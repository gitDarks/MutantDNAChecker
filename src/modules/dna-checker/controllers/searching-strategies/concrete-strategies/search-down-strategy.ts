import { Nucleotide } from "../../../models/nucleotide.model";
import { ISearchStrategy } from "../i-strategy";

export class SearchDownStrategy implements ISearchStrategy {
  private matchCounter: number = 1;
  private dnaMatrix: Nucleotide[][] = [];

  search(
    i: number,
    j: number,
    size: number,
    dnaMatrix: Nucleotide[][]
  ): boolean {
    if (i <= size - 4 && j <= size && !dnaMatrix[i][j].getDown()) {
      this.dnaMatrix = dnaMatrix;
      return this.check(i, j);
    }
    return false;
  }

  check(i: number, j: number): boolean {
    if (
      this.dnaMatrix[i][j].getValue() === this.dnaMatrix[i + 1][j].getValue()
    ) {
      this.matchCounter++;
      this.dnaMatrix[i][j + 1].setDown(true);

      return this.matchCounter === 4 ? true : this.check(i + 1, j);
    }
    this.dnaMatrix[i][j].setDown(false);
    this.matchCounter = 1;
    return false;
  }
}

const searchDownStrategy = new SearchDownStrategy();
export default searchDownStrategy;
