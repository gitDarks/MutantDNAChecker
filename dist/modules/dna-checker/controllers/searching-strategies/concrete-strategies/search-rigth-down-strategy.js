"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchRightDownStrategy = void 0;
class SearchRightDownStrategy {
    constructor() {
        this.matchCounter = 1;
        this.dnaMatrix = [];
    }
    search(i, j, size, dnaMatrix) {
        if (i <= size - 4 && j <= size - 4 && !dnaMatrix[i][j].getRightDown()) {
            this.dnaMatrix = dnaMatrix;
            return this.check(i, j);
        }
        return false;
    }
    check(i, j) {
        if (this.dnaMatrix[i][j].getValue() ===
            this.dnaMatrix[i + 1][j + 1].getValue()) {
            this.matchCounter++;
            this.dnaMatrix[i][j + 1].setRightDown(true);
            return this.matchCounter === 4 ? true : this.check(i + 1, j + 1);
        }
        this.dnaMatrix[i][j].setRightDown(false);
        this.matchCounter = 1;
        return false;
    }
}
exports.SearchRightDownStrategy = SearchRightDownStrategy;
//# sourceMappingURL=search-rigth-down-strategy.js.map