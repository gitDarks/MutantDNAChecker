"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DNAChecker = void 0;
const nucleotide_1 = require("../models/nucleotide");
class DNAChecker {
    constructor() {
        this.dnaMatrixFull = [];
        this.dnaMatrix = [];
        this.matchCounter = 1;
        this.sequenceCounter = 0;
    }
    mapDnaMatrix(dna) {
        this.dnaMatrixFull = new Array();
        let line = [];
        dna.forEach((value, j) => {
            line = value.split("");
            const row = new Array();
            line.forEach((nucleotide, i) => {
                row.push(new nucleotide_1.Nucleotide(nucleotide, i, j));
            });
            this.dnaMatrixFull.push(row);
        });
    }
    checkRight(i, j) {
        console.log("check right");
        if (this.dnaMatrixFull[i][j].getValue() ===
            this.dnaMatrixFull[i][j + 1].getValue()) {
            console.log("match right");
            this.matchCounter++;
            this.dnaMatrixFull[i][j + 1].setRight(true);
            return this.matchCounter === 4 ? true : this.checkRight(i, j + 1);
        }
        this.dnaMatrixFull[i][j].setRight(false);
        this.matchCounter = 1;
        return false;
    }
    checkRightDown(i, j) {
        console.log("check right down");
        if (this.dnaMatrixFull[i][j].getValue() ===
            this.dnaMatrixFull[i + 1][j + 1].getValue()) {
            console.log("match right down");
            this.matchCounter++;
            this.dnaMatrixFull[i][j + 1].setRightDown(true);
            return this.matchCounter === 4 ? true : this.checkRightDown(i + 1, j + 1);
        }
        this.dnaMatrixFull[i][j].setRightDown(false);
        this.matchCounter = 1;
        return false;
    }
    checkDown(i, j) {
        console.log("check down");
        if (this.dnaMatrixFull[i][j].getValue() ===
            this.dnaMatrixFull[i + 1][j].getValue()) {
            console.log("match down");
            this.matchCounter++;
            this.dnaMatrixFull[i][j + 1].setDown(true);
            return this.matchCounter === 4 ? true : this.checkDown(i, j + 1);
        }
        this.dnaMatrixFull[i][j].setDown(false);
        this.matchCounter = 1;
        return false;
    }
    checkLeftDown(i, j) {
        console.log("check left down");
        if (this.dnaMatrixFull[i][j].getValue() ===
            this.dnaMatrixFull[i + 1][j - 1].getValue()) {
            console.log("match left down");
            this.matchCounter++;
            this.dnaMatrixFull[i][j + 1].setLeftDown(true);
            return this.matchCounter === 4 ? true : this.checkLeftDown(i + 1, j - 1);
        }
        this.dnaMatrixFull[i][j].setLeftDown(false);
        this.matchCounter = 1;
        return false;
    }
    isMutant(dna) {
        console.log("---isMutant---");
        const initTime = new Date().valueOf();
        // Mapear valores de la secuencia en arreglo bidimencional NxN
        this.mapDnaMatrix(dna);
        // Verificar secuencia de ADN
        const size = dna.length;
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                console.log(this.dnaMatrixFull[i][j].getValue());
                console.log("i: " + i + " - j: " + j + " - lenght-4: " + (size - 4));
                if (i <= size &&
                    j <= size - 4 &&
                    !this.dnaMatrixFull[i][j].getRight()) {
                    this.sequenceCounter = this.checkRight(i, j)
                        ? this.sequenceCounter + 1
                        : this.sequenceCounter;
                }
                if (i <= size - 4 &&
                    j <= size - 4 &&
                    !this.dnaMatrixFull[i][j].getRightDown()) {
                    this.sequenceCounter = this.checkRightDown(i, j)
                        ? this.sequenceCounter + 1
                        : this.sequenceCounter;
                }
                if (i <= size - 4 && j <= size && !this.dnaMatrixFull[i][j].getDown()) {
                    this.sequenceCounter = this.checkDown(i, j)
                        ? this.sequenceCounter + 1
                        : this.sequenceCounter;
                }
                if (i <= size - 4 &&
                    j >= 3 &&
                    !this.dnaMatrixFull[i][j].getLeftDown()) {
                    this.sequenceCounter = this.checkLeftDown(i, j)
                        ? this.sequenceCounter + 1
                        : this.sequenceCounter;
                }
            }
        }
        const endTime = new Date().valueOf();
        console.log("exec time: ", (endTime - initTime) / 1000);
        return this.sequenceCounter === 2 ? true : false;
    }
}
exports.DNAChecker = DNAChecker;
//# sourceMappingURL=dna-checker.service.js.map