"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchContext = void 0;
/* Se utiliza el patrón Strategy para crear los algoritmos de busqueda en profundidad, a futuro si
se requiere buscar una secuencia de ADN particular (no mutante), se pueden añadir nuevos algoritmos
de busqueda*/
class SearchContext {
    constructor(size) {
        this.size = size;
    }
    setStrategy(strategy) {
        this.strategy = strategy;
    }
    search(i, j, dnaMatrix) {
        const result = this.strategy.search(i, j, this.size, dnaMatrix);
        return result;
    }
}
exports.SearchContext = SearchContext;
const searchContext = new SearchContext(0);
exports.default = searchContext;
//# sourceMappingURL=context.js.map