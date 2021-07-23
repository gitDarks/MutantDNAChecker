import chai from "chai";
import searchDownStrategy from "../../../../../../src/modules/dna-checker/controllers/searching-strategies/concrete-strategies/search-down-strategy";
import { Nucleotide } from "../../../../../../src/modules/dna-checker/models/nucleotide.model";

// Configure chai
chai.should();
const expect = chai.expect;
const dnaMutantMatrix: Nucleotide[][] = [
  [
    new Nucleotide("A"),
    new Nucleotide("A"),
    new Nucleotide("A"),
    new Nucleotide("A"),
  ],
  [
    new Nucleotide("A"),
    new Nucleotide("A"),
    new Nucleotide("A"),
    new Nucleotide("A"),
  ],
  [
    new Nucleotide("A"),
    new Nucleotide("A"),
    new Nucleotide("A"),
    new Nucleotide("A"),
  ],
  [
    new Nucleotide("A"),
    new Nucleotide("A"),
    new Nucleotide("A"),
    new Nucleotide("A"),
  ],
];
const dnaHumanMatrix: Nucleotide[][] = [
  [
    new Nucleotide("A"),
    new Nucleotide("T"),
    new Nucleotide("G"),
    new Nucleotide("C"),
  ],
  [
    new Nucleotide("C"),
    new Nucleotide("A"),
    new Nucleotide("G"),
    new Nucleotide("T"),
  ],
  [
    new Nucleotide("T"),
    new Nucleotide("T"),
    new Nucleotide("A"),
    new Nucleotide("T"),
  ],
  [
    new Nucleotide("T"),
    new Nucleotide("C"),
    new Nucleotide("A"),
    new Nucleotide("C"),
  ],
];

describe("Search down strategy test", () => {
  it("Should search down and return true", () => {
    const result = searchDownStrategy.search(0, 0, 4, dnaMutantMatrix);
    expect(result).to.equal(true);
  });

    it("Should search down and return false", () => {
      const result = searchDownStrategy.search(0, 0, 4, dnaHumanMatrix);
      expect(result).to.equal(false);
    });
});
