export class Stats {
  private static countMutantDna: number = 40;
  private static countHumanDna: number = 100;
  private static ratio: number;

  public static getStats(): string {
    this.calcRatio();
    return (
      '"count_mutant_dna": ' +
      this.countMutantDna +
      ', "count_human_dna": ' +
      this.countHumanDna +
      ', "ratio": ' +
      this.ratio
    );
  }
  private static calcRatio() {
    this.ratio = this.countMutantDna / this.countHumanDna;
  }
}
