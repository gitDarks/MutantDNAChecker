"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchDownStrategy = void 0;
class SearchDownStrategy {
    constructor() {
        this.matchCounter = 1;
        this.dnaMatrix = [];
    }
    search(i, j, size, dnaMatrix) {
        if (i <= size - 4 && j <= size && !dnaMatrix[i][j].getDown()) {
            this.dnaMatrix = dnaMatrix;
            return this.check(i, j);
        }
        return false;
    }
    check(i, j) {
        if (this.dnaMatrix[i][j].getValue() === this.dnaMatrix[i + 1][j].getValue()) {
            this.matchCounter++;
            this.dnaMatrix[i][j + 1].setDown(true);
            return this.matchCounter === 4 ? true : this.check(i + 1, j);
        }
        this.dnaMatrix[i][j].setDown(false);
        this.matchCounter = 1;
        return false;
    }
}
exports.SearchDownStrategy = SearchDownStrategy;
//# sourceMappingURL=search-down-strategy.js.map