"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchLeftDownStrategy = void 0;
class SearchLeftDownStrategy {
    constructor() {
        this.matchCounter = 1;
        this.dnaMatrix = [];
    }
    search(i, j, size, dnaMatrix) {
        if (i <= size - 4 && j >= 3 && !dnaMatrix[i][j].getLeftDown()) {
            this.dnaMatrix = dnaMatrix;
            return this.check(i, j);
        }
        return false;
    }
    check(i, j) {
        if (this.dnaMatrix[i][j].getValue() ===
            this.dnaMatrix[i + 1][j - 1].getValue()) {
            this.matchCounter++;
            this.dnaMatrix[i][j - 1].setLeftDown(true);
            return this.matchCounter === 4 ? true : this.check(i + 1, j - 1);
        }
        this.dnaMatrix[i][j].setLeftDown(false);
        this.matchCounter = 1;
        return false;
    }
}
exports.SearchLeftDownStrategy = SearchLeftDownStrategy;
const searchLeftDown = new SearchLeftDownStrategy();
exports.default = searchLeftDown;
//# sourceMappingURL=search-left-down-strategy.js.map