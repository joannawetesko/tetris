import {
  COLORS,
  COLS,
  ROWS,
  BLOCK_SIZE,
  POINTS,
  LEVEL,
  LINES_FOR_LEVEL,
  KEY_CODE
} from "../utils/constants.js";

import { TetrisPiece } from "./piece.js";

export class TetrisBoard {
  constructor(canvasContext, nextPieceContext) {
    this.canvasContext = canvasContext;
    this.nextPieceContext = nextPieceContext;

    this.canvasContext.canvas.width = COLS * BLOCK_SIZE;
    this.canvasContext.canvas.height = ROWS * BLOCK_SIZE;
    this.canvasContext.scale(BLOCK_SIZE, BLOCK_SIZE);

    this.moves = {
      [KEY_CODE.UP]: piece => this.rotatePiece(piece),
      [KEY_CODE.DOWN]: piece => ({ ...piece, y: piece.y + 1 }),
      [KEY_CODE.LEFT]: piece => ({ ...piece, x: piece.x - 1 }),
      [KEY_CODE.RIGHT]: piece => ({ ...piece, x: piece.x + 1 }),
      [KEY_CODE.SPACE]: piece => ({ ...piece, y: piece.y + 1 })
    };
  }

  // ------------------ GAME LOGIC ----------------------

  getEmptyGrid() {
    return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
  }

  restart(player, time) {
    this.player = player;
    this.time = time;

    this.grid = this.getEmptyGrid();
    this.piece = new TetrisPiece(this.canvasContext);
    this.piece.setStartingPosition();
    this.showNewPiece();
  }

  isValidPosition(piece) {
    return piece.shape.every((row, dy) => {
      return row.every((value, dx) => {
        let x = piece.x + dx;
        let y = piece.y + dy;
        return (
          value === 0 ||
          (this.isInsideBoard(x) &&
            !this.hasReachedFloor(y) &&
            this.isEmptySpace(x, y))
        );
      });
    });
  }

  isInsideBoard(x) {
    return x < COLS && x >= 0;
  }

  hasReachedFloor(y) {
    return y > ROWS;
  }

  isEmptySpace(x, y) {
    return this.grid[y] && this.grid[y][x] === 0;
  }

  getPlayerPoints(lines) {
    let points =
      lines === 1
        ? POINTS.SINGLE
        : lines === 2
        ? POINTS.DOUBLE
        : lines === 3
        ? POINTS.TRIPLE
        : lines === 4
        ? POINTS.TETRIS
        : 0;
    return (this.player.level + 1) * points;
  }

  removeFinishedLines() {
    let lines = 0;

    this.grid.forEach((row, y) => {
      if (row.every(value => value > 0)) {
        lines++;
        this.grid.splice(y, 1);
        this.grid.unshift(Array(COLS).fill(0));
      }
    });

    if (lines > 0) {
      this.player.score += this.getPlayerPoints(lines);
      this.player.lines += lines;

      if (this.player.lines >= LINES_FOR_LEVEL) {
        this.player.level++;
        this.player.lines -= LINES_FOR_LEVEL;
        this.time.level = LEVEL[this.player.level];
      }
    }
  }

  freezePiece() {
    this.piece.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value > 0) {
          this.grid[y + this.piece.y][x + this.piece.x] = value;
        }
      });
    });
  }

  dropPiece() {
    let piece = this.moves[KEY_CODE.DOWN](this.piece);

    if (this.isValidPosition(piece)) {
      this.piece.move(piece);
    } else {
      this.freezePiece();
      this.removeFinishedLines();

      // GAME OVER
      if (this.piece.y === 0) {
        return false;
      }

      // REACHED FLOOR
      this.piece = this.next;
      this.piece.canvasContext = this.canvasContext;
      this.piece.setStartingPosition();
      this.showNewPiece();
    }

    return true;
  }

  rotatePiece(piece) {
    let rotatedPiece = JSON.parse(JSON.stringify(piece));

    // MATRIX TRANSPOSITION & COLUMN ORDER REVERSAL
    for (let y = 0; y < rotatedPiece.shape.length; ++y) {
      for (let x = 0; x < y; ++x) {
        [rotatedPiece.shape[x][y], rotatedPiece.shape[y][x]] = [
          rotatedPiece.shape[y][x],
          rotatedPiece.shape[x][y]
        ];
      }
    }
    rotatedPiece.shape.forEach(row => row.reverse());

    return rotatedPiece;
  }

  // ------------------- DRAWING ------------------------

  draw() {
    this.piece.draw();
    this.drawBoard();
  }

  drawBoard() {
    this.grid.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value > 0) {
          this.canvasContext.fillStyle = COLORS[value];
          this.canvasContext.fillRect(x, y, 1, 1);
        }
      });
    });
  }

  showNewPiece() {
    this.next = new TetrisPiece(this.nextPieceContext);
    this.nextPieceContext.clearRect(
      0,
      0,
      this.nextPieceContext.canvas.width,
      this.nextPieceContext.canvas.height
    );
    this.next.draw();
  }
}
