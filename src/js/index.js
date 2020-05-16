"use strict";

import { TetrisBoard } from "./models/board.js";
import { TetrisPiece } from "./models/piece.js";
import {
  CANVAS_CONTEXT,
  NEXT_PIECE_CONTEXT,
  BLOCK_SIZE,
  KEY_CODE,
  POINTS,
  LEVEL
} from "./utils/constants.js";

let player;
let playerStats = {
  score: 0,
  level: 0,
  lines: 0
};

let time;
let game;

let gameLogic = {
  [KEY_CODE.GAME_OVER]: () => gameOver(),
  [KEY_CODE.PAUSE]: () => pause()
};

let gameBoard = new TetrisBoard(CANVAS_CONTEXT, NEXT_PIECE_CONTEXT);

// ---------------------- GAME LOGIC -----------------------

window.addEventListener = function() {
  document.addEventListener("keydown", event => {
    if (event.keyCode in gameBoard.moves) {
      event.preventDefault();
      event.stopPropagation();

      let piece = gameBoard.moves[event.keyCode](gameBoard.piece);

      // HARD DROP
      if (event.keyCode === KEY_CODE.SPACE) {
        while (gameBoard.isValidPosition(piece)) {
          gameBoard.piece.move(piece);
          piece = gameBoard.moves[KEY_CODE.DOWN](gameBoard.piece);
          player.score += POINTS.HARD_DROP;
        }
      }

      // REGULAR MOVE
      if (gameBoard.isValidPosition(piece)) {
        gameBoard.piece.move(piece);
        if (event.keyCode === KEY_CODE.DOWN) {
          player.score += POINTS.SOFT_DROP;
        }
      }
    }

    // PAUSE OR GAME OVER
    if (event.keyCode in gameLogic) {
      gameLogic[event.keyCode]();
    }
  });
};

window.prepareNewGame = function() {
  player.score = player.lines = player.level = 0;
  time = {
    start: 0,
    elapsed: 0,
    level: LEVEL[player.level]
  };
  gameBoard.restart(player, time);
};

window.updatePlayerStats = function(key, val) {
  let element = document.getElementById(key);
  element.textContent = val;
};

window.startGame = function() {
  addEventListener();
  showNextPieceCanvas();

  // CANCEL ONGOING GAME
  if (game) {
    cancelAnimationFrame(game);
  }

  // CREATE NEW PLAYER
  player = new Proxy(playerStats, {
    set: (target, key, val) => {
      target[key] = val;
      updatePlayerStats(key, val);
      return true;
    }
  });

  prepareNewGame();
  time.start = performance.now();
  showAnimation();
};

window.gameOver = function() {
  cancelAnimationFrame(game);
  showPrompt("GAME OVER", 1.8, 4);
};

window.pause = function() {
  // IGNORE IF NO ONGOING GAME
  if (!game) {
    showAnimation();
    return;
  }

  cancelAnimationFrame(game);
  showPrompt("PAUSED", 3, 4);
  game = null;
};

// ------------------------ DRAWING ------------------------

window.showNextPieceCanvas = function() {
  NEXT_PIECE_CONTEXT.canvas.width = 5 * BLOCK_SIZE;
  NEXT_PIECE_CONTEXT.canvas.height = 5 * BLOCK_SIZE;
  NEXT_PIECE_CONTEXT.scale(BLOCK_SIZE, BLOCK_SIZE);
};

window.showPrompt = function(text, value_x, value_y) {
  CANVAS_CONTEXT.fillStyle = "#D3D3D3";
  CANVAS_CONTEXT.fillRect(1, 3, 8, 1.2);
  CANVAS_CONTEXT.font = "1px Arial";
  CANVAS_CONTEXT.fillStyle = "white";
  CANVAS_CONTEXT.fillText(text, value_x, value_y);
};

window.showAnimation = function(now = 0) {
  time.elapsed = now - time.start;
  if (time.elapsed > time.level) {
    time.start = now;

    if (!gameBoard.dropPiece()) {
      gameOver();
      return;
    }
  }

  // CLEAR BOARD AND DRAW NEW STATE
  CANVAS_CONTEXT.clearRect(
    0,
    0,
    CANVAS_CONTEXT.canvas.width,
    CANVAS_CONTEXT.canvas.height
  );
  gameBoard.draw();
  game = requestAnimationFrame(showAnimation);
};
