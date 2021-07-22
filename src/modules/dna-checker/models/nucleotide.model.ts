/*
    Esta clase permite identificar cada nucleótido de la sequencia. Los valores right: derecha, rightDown: diagonal derecha
    down: abajo, leftDown: diagonal izquierda, permiten verificar si las posiciones vecinas ya fueron analizadas(comparadas),
    esto permite evitar realizar validaciones innecesarias o repetidas
*/
export class Nucleotide {
  private value: string;
  private right: boolean;
  private rightDown: boolean;
  private down: boolean;
  private leftDown: boolean;

  constructor(value: string) {
    this.value = value;
    this.right = false;
    this.rightDown = false;
    this.down = false;
    this.leftDown = false;
  }

  public getValue(): string {
    return this.value;
  }

  public getRight(): boolean {
    return this.right;
  }

  public getRightDown(): boolean {
    return this.rightDown;
  }

  public getDown(): boolean {
    return this.down;
  }

  public getLeftDown(): boolean {
    return this.leftDown;
  }

  public setRight(right: boolean) {
    this.right = right;
  }

  public setRightDown(rightDown: boolean) {
    this.rightDown = rightDown;
  }

  public setDown(down: boolean) {
    this.down = down;
  }

  public setLeftDown(leftDown: boolean) {
    this.leftDown = leftDown;
  }
}
