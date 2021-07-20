import { Nucleotide } from "../../models/nucleotide.model";
import { ISearchStrategy } from "./i-strategy";

/* Se utiliza el patrón Strategy para crear los algoritmos de busqueda en profundidad, a futuro si
se requiere buscar una secuencia de ADN particular (no mutante), se pueden añadir nuevos algoritmos
de busqueda*/

export class SearchContext {
  private strategy: ISearchStrategy;
  private size: number;

  constructor(size: number) {
    this.size = size;
  }

  public setStrategy(strategy: ISearchStrategy) {
    this.strategy = strategy;
  }

  public search(i: number, j: number, dnaMatrix: Nucleotide[][]): boolean {
    const result = this.strategy.search(i, j, this.size, dnaMatrix);
    return result;
  }
}
