import {
  SHAPES,
  COLORS,
  STARTING_POSITION_SQUARE,
  STARTING_POSITION
} from "../utils/constants.js";

export class TetrisPiece {
  constructor(canvasContext) {
    this.canvasContext = canvasContext;
    this.x = 0;
    this.y = 0;

    this.type = this.randomizeShape();
    this.shape = SHAPES[this.type];
    this.color = COLORS[this.type];
  }

  randomizeShape() {
    return Math.floor(Math.random() * (SHAPES.length - 1) + 1);
  }

  setStartingPosition() {
    this.x = this.type === 4 ? STARTING_POSITION_SQUARE : STARTING_POSITION;
  }

  move(piece) {
    this.x = piece.x;
    this.y = piece.y;
    this.shape = piece.shape;
  }

  draw() {
    this.canvasContext.fillStyle = this.color;
    this.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value > 0) {
          this.canvasContext.fillRect(this.x + x, this.y + y, 1, 1);
        }
      });
    });
  }
}
