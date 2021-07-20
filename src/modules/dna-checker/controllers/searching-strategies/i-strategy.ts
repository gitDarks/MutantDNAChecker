import { Nucleotide } from "../../models/nucleotide.model";

export interface ISearchStrategy {
  /*los condicionales de los metodos "search..." permiten que solo se comparen los nucleotidos cercanos si exite la
  posibilidad de armar una cadena de 4, de lo contrario no es necesario buscar coincidencias*/
  search(
    i: number,
    j: number,
    size: number,
    dnaMatrix: Nucleotide[][]
  ): boolean;

  /*Los metodos "check..." buscan de forma recursiva si los nucleotidos vecinos coinciden con el actual.
    de ser así continuan la busqueda en la misma dirección hasta completar la cadena de 4 coincidencias,
    marcando los nucleotidos que ya hacen parte de una cadena en la dirección determinada, de esta forma
    no se vuelven a evaluar en una siguiente pasada
  */
  check(i: number, j: number): boolean;
}
