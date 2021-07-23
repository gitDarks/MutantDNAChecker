import chai from "chai";
import { Nucleotide } from "../../../../../../src/modules/dna-checker/models/nucleotide.model";
import searchLeftDown from '../../../../../../src/modules/dna-checker/controllers/searching-strategies/concrete-strategies/search-left-down-strategy';

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

describe("Search left down strategy test", () => {
  it("Should search left down and return true", () => {
    const result = searchLeftDown.search(0, 3, 4, dnaMutantMatrix);
    expect(result).to.equal(true);
  });

  it("Should search left down and return false", () => {
    const result = searchLeftDown.search(0, 3, 4, dnaHumanMatrix);
    expect(result).to.equal(false);
  });
});
