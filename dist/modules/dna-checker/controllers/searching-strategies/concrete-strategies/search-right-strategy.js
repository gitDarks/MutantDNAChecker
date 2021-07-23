"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchRightStrategy = void 0;
class SearchRightStrategy {
    constructor() {
        this.matchCounter = 1;
        this.dnaMatrix = [];
    }
    search(i, j, size, dnaMatrix) {
        if (i <= size && j <= size - 4 && !dnaMatrix[i][j].getRight()) {
            this.dnaMatrix = dnaMatrix;
            return this.check(i, j);
        }
        return false;
    }
    check(i, j) {
        if (this.dnaMatrix[i][j].getValue() === this.dnaMatrix[i][j + 1].getValue()) {
            this.matchCounter++;
            this.dnaMatrix[i][j + 1].setRight(true);
            return this.matchCounter === 4 ? true : this.check(i, j + 1);
        }
        this.dnaMatrix[i][j].setRight(false);
        this.matchCounter = 1;
        return false;
    }
}
exports.SearchRightStrategy = SearchRightStrategy;
const searchRightStrategy = new SearchRightStrategy();
exports.default = searchRightStrategy;
//# sourceMappingURL=search-right-strategy.js.map