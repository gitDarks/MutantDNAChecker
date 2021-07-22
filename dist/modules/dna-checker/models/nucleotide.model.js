"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Nucleotide = void 0;
/*
    Esta clase permite identificar cada nucleótido de la sequencia. Los valores right: derecha, rightDown: diagonal derecha
    down: abajo, leftDown: diagonal izquierda, permiten verificar si las posiciones vecinas ya fueron analizadas(comparadas),
    esto permite evitar realizar validaciones innecesarias o repetidas
*/
class Nucleotide {
    constructor(value) {
        this.value = value;
        this.right = false;
        this.rightDown = false;
        this.down = false;
        this.leftDown = false;
    }
    getValue() {
        return this.value;
    }
    getRight() {
        return this.right;
    }
    getRightDown() {
        return this.rightDown;
    }
    getDown() {
        return this.down;
    }
    getLeftDown() {
        return this.leftDown;
    }
    setRight(right) {
        this.right = right;
    }
    setRightDown(rightDown) {
        this.rightDown = rightDown;
    }
    setDown(down) {
        this.down = down;
    }
    setLeftDown(leftDown) {
        this.leftDown = leftDown;
    }
}
exports.Nucleotide = Nucleotide;
//# sourceMappingURL=nucleotide.model.js.map