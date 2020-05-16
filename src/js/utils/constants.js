"use strict";

export const CANVAS = document.getElementById("game-board");
export const CANVAS_CONTEXT = CANVAS.getContext("2d");

export const NEXT_PIECE = document.getElementById("next-piece");
export const NEXT_PIECE_CONTEXT = NEXT_PIECE.getContext("2d");

export const COLS = 10;
export const ROWS = 20;
export const BLOCK_SIZE = 30;
export const LINES_FOR_LEVEL = 10;

export const COLORS = [
  "none",
  "#FEFFBF",
  "#FFB7B2",
  "#FFDAC1",
  "#E2F0CB",
  "#F4DCD6",
  "#C7CCEA",
  "#B0EFEF"
];

export const STARTING_POSITION_SQUARE = 4;
export const STARTING_POSITION = 3;

export const SHAPES = [
  [],
  [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ],
  [
    [2, 0, 0],
    [2, 2, 2],
    [0, 0, 0]
  ],
  [
    [0, 0, 3],
    [3, 3, 3],
    [0, 0, 0]
  ],
  [
    [4, 4],
    [4, 4]
  ],
  [
    [0, 5, 5],
    [5, 5, 0],
    [0, 0, 0]
  ],
  [
    [0, 6, 0],
    [6, 6, 6],
    [0, 0, 0]
  ],
  [
    [7, 7, 0],
    [0, 7, 7],
    [0, 0, 0]
  ]
];

export const KEY_CODE = {
  GAME_OVER: 27,
  SPACE: 32,
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  PAUSE: 80
};

export const POINTS = {
  SINGLE: 100,
  DOUBLE: 200,
  TRIPLE: 300,
  TETRIS: 400,
  SOFT_DROP: 1,
  HARD_DROP: 2
};

export const LEVEL = {
  0: 800,
  1: 720,
  2: 630,
  3: 550,
  4: 470,
  5: 380,
  6: 300,
  7: 220,
  8: 130,
  9: 100,
  10: 80,
  11: 80,
  12: 80,
  13: 70,
  14: 70,
  15: 70,
  16: 50,
  17: 50,
  18: 50,
  19: 30,
  20: 30
};
