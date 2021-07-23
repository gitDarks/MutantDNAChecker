import chai from "chai";
import { Nucleotide } from "../../../../../src/modules/dna-checker/models/nucleotide.model";
import { SearchRightStrategy } from "../../../../../src/modules/dna-checker/controllers/searching-strategies/concrete-strategies/search-right-strategy";
import { SearchContext } from "../../../../../src/modules/dna-checker/controllers/searching-strategies/context";

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

describe("Search context strategy test", () => {
  it("Should search down and return true", () => {
    const searchContext = new SearchContext(4);
    searchContext.setStrategy(new SearchRightStrategy());
    const result = searchContext.search(0, 0, dnaMutantMatrix);
    expect(result).to.be.equal(true);
  });

  it("Should search down and return false", () => {});
});
