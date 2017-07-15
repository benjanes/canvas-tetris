/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _Game = __webpack_require__(1);

	var _Game2 = _interopRequireDefault(_Game);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	window.initGame = function () {
		var $nodes = {
			canvas: document.getElementById('tetris'),
			start: document.getElementById('start'),
			pause: document.getElementById('pause'),
			wrapper: document.getElementsByTagName('body')[0],
			title: document.getElementsByTagName('h1')[0]
		};

		var tetrisGame = new _Game2.default(15, 30, 12, $nodes);
	}; // window.requestAnimFrame = window.requestAnimationFrame ||
	//   window.webkitRequestAnimationFrame ||
	//   window.mozRequestAnimationFrame ||
	//   window.msRequestAnimationFrame ||
	//   window.oRequestAnimationFrame ||
	//   function(callback) {
	//     return setTimeout(callback, 1);
	//   };
	// window.cancelAnimFrame = window.cancelAnimationFrame ||
	//   window.webkitCancelAnimationFrame ||
	//   window.mozCancelAnimationFrame ||
	//   window.msCancelAnimationFrame ||
	//   window.oCancelAnimationFrame ||
	//   clearTimeout;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _Square = __webpack_require__(2);

	var _Square2 = _interopRequireDefault(_Square);

	var _Rod = __webpack_require__(5);

	var _Rod2 = _interopRequireDefault(_Rod);

	var _Elle = __webpack_require__(6);

	var _Elle2 = _interopRequireDefault(_Elle);

	var _Tee = __webpack_require__(7);

	var _Tee2 = _interopRequireDefault(_Tee);

	var _SquiggleA = __webpack_require__(8);

	var _SquiggleA2 = _interopRequireDefault(_SquiggleA);

	var _SquiggleB = __webpack_require__(9);

	var _SquiggleB2 = _interopRequireDefault(_SquiggleB);

	var _helpers = __webpack_require__(10);

	var _styles = __webpack_require__(11);

	var _styles2 = _interopRequireDefault(_styles);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Game = function () {
	  function Game(width, height, cellSize, $nodes) {
	    _classCallCheck(this, Game);

	    this.width = width;
	    this.height = height;
	    this.cellSize = cellSize;
	    this.ctx = $nodes.canvas.getContext('2d');

	    // DOM nodes
	    this.$nodes = Object.keys($nodes).map(function (key) {
	      return $nodes[key];
	    }).filter(function ($node) {
	      return $node !== $nodes.canvas;
	    });

	    this.$wrapper = $nodes.wrapper;
	    this.$startBtn = $nodes.start;
	    this.$pauseBtn = $nodes.pause;

	    // vars for drawing board
	    this.topMargin = 80;
	    this.boardBorder = 3;
	    this.boardHeight = this.height * cellSize + this.topMargin + 2 * this.boardBorder;
	    this.boardWidth = this.width * cellSize + cellSize * 6 + this.boardBorder * 3;
	    $nodes.canvas.height = this.boardHeight + 2;
	    $nodes.canvas.width = this.boardWidth;
	    this.pattern = this.initPattern();

	    // game pieces
	    this.currPiece = null;
	    this.shapes = [_Square2.default, _Rod2.default, _Elle2.default, _Tee2.default, _SquiggleA2.default, _SquiggleB2.default];
	    this.nextPiece = new (_helpers.getRandomShape.call(this))(this.width, this.height);

	    this.gameMsg = 'Start a game';

	    // hard bind core functions
	    this.tick = this.tick.bind(this);
	    this.handleKeydown = this.handleKeydown.bind(this);
	    this.startGame = this.startGame.bind(this);
	    this.pauseGame = this.pauseGame.bind(this);
	    this.initNewGame = this.initNewGame.bind(this);
	    this.handleStatusUpdate = this.handleStatusUpdate.bind(this);

	    // add listeners to buttons in DOM
	    this.$startBtn.addEventListener('click', this.startGame);
	    this.$pauseBtn.addEventListener('click', this.pauseGame);

	    // use proxy for this.status
	    this.status = new Proxy({
	      level: 1,
	      isOver: true
	    }, {
	      set: this.handleStatusUpdate
	    });

	    // prep a game
	    this.initNewGame(width, height);
	    // draw board once
	    this.drawBoard();
	  }

	  _createClass(Game, [{
	    key: 'handleStatusUpdate',
	    value: function handleStatusUpdate(status, key, value) {
	      var msg = void 0;

	      if (key === 'level') {
	        // update this.gameMsg
	        this.gameMsg = 'LEVEL: ' + value;

	        (0, _helpers.applyStyles)([this.$wrapper], _styles2.default[value]);

	        // update this.rate
	        this.rate = 550 - value * 50;
	      }

	      if (key === 'isOver') {
	        // update this.gameMsg
	        this.gameMsg = value ? 'GAME OVER' : 'LEVEL: 1';
	        // update button copy
	        this.$startBtn.innerText = value ? 'New Game' : 'Play';
	      }

	      status[key] = value;
	      return true;
	    }
	  }, {
	    key: 'startGame',
	    value: function startGame() {
	      this.$startBtn.setAttribute('disabled', true);
	      this.$pauseBtn.removeAttribute('disabled');

	      if (this.status.isOver) {
	        this.initNewGame(this.width, this.height);
	        this.status.isOver = false;
	        this.status.level = 1;
	      }

	      document.addEventListener('keydown', this.handleKeydown);
	      this.tick();
	    }
	  }, {
	    key: 'initNewGame',
	    value: function initNewGame(width, height) {
	      this.score = 0;
	      this.levelProgress = 0; // need to score a certain amount w/in a level to advance
	      this.rate = 500;

	      this.baseGrid = (0, _helpers.initGrid)(width, height);
	      this.copyBaseGrid();

	      this.maxYPerCol = [];
	      this.getMaxYPerCol();
	    }
	  }, {
	    key: 'pauseGame',
	    value: function pauseGame() {
	      this.$startBtn.removeAttribute('disabled');
	      this.$pauseBtn.setAttribute('disabled', true);

	      document.removeEventListener('keydown', this.handleKeydown);
	      clearTimeout(this.timer);
	    }
	  }, {
	    key: 'drawBoard',
	    value: function drawBoard() {
	      // clear canvas
	      this.ctx.clearRect(0, 0, this.boardWidth, this.boardHeight);

	      // draw the bg pattern onto the board
	      this.ctx.fillStyle = this.pattern;
	      this.ctx.translate(this.cellSize / 2 - 1, -1);
	      this.ctx.fillRect(this.boardBorder - 3, this.topMargin + 2, this.cellSize * this.width + this.boardBorder * 2 - 4, this.cellSize * this.height + this.boardBorder * 2 - 2);
	      this.ctx.translate(-1 * (this.cellSize / 2) + 1, 1);

	      // draw board border
	      this.ctx.strokeStyle = '#aaa';
	      this.ctx.lineWidth = this.boardBorder;
	      this.ctx.strokeRect(this.boardBorder + 1, this.topMargin + 1, this.cellSize * this.width + this.boardBorder * 2 - 3, this.cellSize * this.height + this.boardBorder * 2 - 3);

	      // reset the line width before drawing next piece shown in upper right
	      this.ctx.lineWidth = 1;
	      this.drawNextPiece();

	      // write out the game status (level or "game over") and current score
	      this.ctx.font = '20px Geostar Fill';
	      this.ctx.fillStyle = '#fff';
	      this.ctx.fillText(this.gameMsg, 0, 30);
	      this.ctx.fillText('SCORE: ' + this.score, 0, 60);

	      // draw the pieces onto the board
	      this.currGrid.forEach(this.drawRow, this);
	    }
	  }, {
	    key: 'drawRow',
	    value: function drawRow(row, rowIdx) {
	      var _this = this;

	      row.forEach(function (cell, colIdx) {
	        var x = void 0,
	            y = void 0;

	        // if cell is empty, don't draw anything
	        if (cell !== 'X' && !cell.fill) return;

	        // find the x and y coords from which to orient the cell
	        x = colIdx * _this.cellSize + _this.boardBorder * 2 - 1;
	        y = rowIdx * _this.cellSize + _this.topMargin + _this.boardBorder;

	        // if 'X', means the game is over -- draw cell for the "game over" animation
	        if (cell === 'X') {
	          _this.ctx.strokeStyle = '#ff0000';
	          _this.ctx.fillStyle = 'rgba(255,0,0,0.2)';
	          _this.ctx.fillRect(x, y, _this.cellSize, _this.cellSize);
	          _this.ctx.strokeRect(x, y, _this.cellSize, _this.cellSize);
	        } else {
	          (0, _helpers.drawCell)(_this.ctx, x, y, cell.fill, _this.cellSize);
	        }
	      });
	    }
	  }, {
	    key: 'drawNextPiece',
	    value: function drawNextPiece() {
	      var _this2 = this;

	      var boxX = this.boardBorder * 2 + this.width * this.cellSize + this.cellSize;
	      var boxY = this.topMargin;
	      var dimension = this.cellSize * 5;

	      // draw the box
	      this.ctx.fillStyle = '#888';
	      this.ctx.fillRect(boxX, boxY, dimension, dimension + this.cellSize);
	      this.ctx.strokeStyle = '#fff';
	      this.ctx.strokeRect(boxX, boxY, dimension, dimension + this.cellSize);

	      // then draw the piece
	      this.nextPiece.cells.forEach(function (cell) {
	        var x = void 0,
	            y = void 0;
	        x = boxX + _this2.cellSize + cell.staticX * _this2.cellSize;
	        y = boxY + _this2.cellSize + cell.staticY * _this2.cellSize;
	        (0, _helpers.drawCell)(_this2.ctx, x, y, cell.fill, _this2.cellSize);
	      });
	    }
	  }, {
	    key: 'copyBaseGrid',
	    value: function copyBaseGrid() {
	      this.currGrid = this.baseGrid.map(function (row) {
	        return row.slice();
	      });
	    }
	  }, {
	    key: 'addPiece',
	    value: function addPiece() {
	      this.currPiece = this.nextPiece;
	      this.nextPiece = new (_helpers.getRandomShape.call(this))(this.width, this.height);
	    }
	  }, {
	    key: 'updateBaseGrid',
	    value: function updateBaseGrid() {
	      this.baseGrid = this.currGrid.map(function (row) {
	        return row.slice();
	      });
	    }
	  }, {
	    key: 'handleCompletedRows',
	    value: function handleCompletedRows() {
	      for (var i = 0; i < this.baseGrid.length; i++) {
	        if (!~this.baseGrid[i].indexOf(' ')) {
	          this.baseGrid = (0, _helpers.makeRow)(this.width).concat(this.baseGrid.slice(0, i)).concat(this.baseGrid.slice(i + 1));
	          this.updatePlayerProgress();
	          this.handleCompletedRows();
	          return;
	        }
	      }
	    }
	  }, {
	    key: 'handleImpact',
	    value: function handleImpact() {
	      if (!this.currPiece || this.currPiece.hasImpacted(this.maxYPerCol)) {
	        this.updateBaseGrid();
	        this.handleCompletedRows();
	        this.getMaxYPerCol();
	        this.addPiece();
	      }
	    }
	  }, {
	    key: 'updatePlayerProgress',
	    value: function updatePlayerProgress() {
	      this.score += 1;
	      this.levelProgress += 1;
	      if (this.levelProgress >= 5) {
	        this.status.level += 1;
	        this.levelProgress = 0;
	      }
	    }
	  }, {
	    key: 'updatePositions',
	    value: function updatePositions(movePieceFn) {
	      var _this3 = this;

	      this.copyBaseGrid();
	      if (this.currPiece) {
	        movePieceFn();
	        this.currPiece.cells.forEach(function (cell) {
	          if (cell.y >= 0 && cell.y < _this3.height) {
	            _this3.currGrid[cell.y][cell.x] = cell;
	          }
	        });
	      }
	      this.drawBoard();
	    }
	  }, {
	    key: 'initPattern',
	    value: function initPattern() {
	      var pattern = document.createElement('canvas');
	      var ctx = pattern.getContext('2d');
	      var x = this.cellSize;

	      pattern.width = x;
	      pattern.height = x;

	      ctx.fillStyle = '#333';
	      ctx.fillRect(0, 0, x, x);

	      (0, _helpers.drawTriangle)(ctx, [[1, x - 2], [x - 2, 1], [x - 2, x - 2]], 'rgba(200,200,200,0.6)');
	      (0, _helpers.drawTriangle)(ctx, [[1, x - 2], [1, 1], [x - 2, x - 2]], 'rgba(160,160,160,0.6)');

	      // drawTriangle(ctx, [[0, x], [x, 0], [x, x]], 'rgba(200,200,200,0.6)');
	      // drawTriangle(ctx, [[0, x], [0, 0], [x, x]], 'rgba(160,160,160,0.6)');

	      ctx.strokeStyle = '#aaa';
	      ctx.strokeRect(0, 0, x - 1, x - 1);

	      return ctx.createPattern(pattern, 'repeat');
	    }
	  }, {
	    key: 'tick',
	    value: function tick() {
	      this.handleImpact();

	      if (~this.maxYPerCol.indexOf(0)) {
	        return this.killGame();
	      }

	      this.updatePositions(this.currPiece.moveDown.bind(this.currPiece));
	      this.timer = setTimeout(this.tick, this.rate);
	    }
	  }, {
	    key: 'getMaxYPerCol',
	    value: function getMaxYPerCol() {
	      var maxes = [];
	      for (var i = 0; i < this.width; i++) {
	        maxes.push(this.height);
	      }this.maxYPerCol = this.baseGrid.reduceRight(function (maxes, row, rowIdx) {
	        row.forEach(function (cell, colIdx) {
	          if (cell !== ' ') {
	            maxes[colIdx] = rowIdx;
	          }
	        });
	        return maxes;
	      }, maxes);
	    }
	  }, {
	    key: 'killGame',
	    value: function killGame() {
	      var rowLength = this.width;
	      // this.gameStatus = 'GAME OVER';
	      this.status.isOver = true;
	      this.$startBtn.removeAttribute('disabled');
	      this.$pauseBtn.setAttribute('disabled', true);

	      document.removeEventListener('keydown', this.handleKeydown);

	      if (this.currGrid[this.height - 1][this.width - 1] !== 'X') {
	        this.currGrid = this.currGrid.map(function (row) {
	          var place = row.lastIndexOf('X');
	          if (place !== -1 && place <= rowLength - 2) {
	            row[place + 1] = 'X';
	          }
	          return row;
	        });

	        for (var i = 0; i < this.height; i++) {
	          if (this.currGrid[i][0] !== 'X') {
	            this.currGrid[i][0] = 'X';
	            break;
	          }
	        }

	        this.drawBoard();
	        setTimeout(this.killGame.bind(this), 15);
	      }
	    }
	  }, {
	    key: 'handleKeydown',
	    value: function handleKeydown(e) {
	      if (e.keyCode === 37 || e.keyCode === 39 || e.keyCode === 38 || e.keyCode === 40) {
	        if (e.keyCode === 37) this.updatePositions(this.currPiece.moveLeft.bind(this.currPiece, this.baseGrid));
	        if (e.keyCode === 39) this.updatePositions(this.currPiece.moveRight.bind(this.currPiece, this.baseGrid));
	        if (e.keyCode === 38) this.updatePositions(this.currPiece.rotate.bind(this.currPiece, this.baseGrid));
	        if (e.keyCode === 40) {
	          this.handleImpact();
	          this.updatePositions(this.currPiece.moveDown.bind(this.currPiece));
	        }
	      }
	    }
	  }]);

	  return Game;
	}();

	exports.default = Game;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _Piece2 = __webpack_require__(3);

	var _Piece3 = _interopRequireDefault(_Piece2);

	var _Cell = __webpack_require__(4);

	var _Cell2 = _interopRequireDefault(_Cell);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Square = function (_Piece) {
	  _inherits(Square, _Piece);

	  function Square(maxX, maxY) {
	    _classCallCheck(this, Square);

	    var _this = _possibleConstructorReturn(this, (Square.__proto__ || Object.getPrototypeOf(Square)).call(this, maxX, maxY));

	    _this.init();
	    return _this;
	  }

	  _createClass(Square, [{
	    key: 'init',
	    value: function init() {
	      this.cells = [new _Cell2.default('#00BFFF', this.midPoint, -2, 0.5, 1), new _Cell2.default('#00BFFF', this.midPoint + 1, -2, 1.5, 1), new _Cell2.default('#00BFFF', this.midPoint, -1, 0.5, 2), new _Cell2.default('#00BFFF', this.midPoint + 1, -1, 1.5, 2)];
	    }
	  }, {
	    key: 'rotate',
	    value: function rotate() {
	      return;
	    }
	  }]);

	  return Square;
	}(_Piece3.default);

	exports.default = Square;

/***/ }),
/* 3 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Piece = function () {
	  function Piece(maxX, maxY) {
	    _classCallCheck(this, Piece);

	    this.maxX = maxX;
	    this.maxY = maxY;
	    this.midPoint = Math.floor(maxX / 2);
	    this.cells = [null, null, null, null];
	  }

	  _createClass(Piece, [{
	    key: 'moveDown',
	    value: function moveDown() {
	      this.cells.forEach(function (cell) {
	        return cell.setY.call(cell, cell.y + 1);
	      });
	    }
	  }, {
	    key: 'moveLeft',
	    value: function moveLeft(currGrid) {
	      if (!this.isAtBoundary(currGrid, 'left')) this.cells.forEach(function (cell) {
	        return cell.setX.call(cell, cell.x - 1);
	      });
	    }
	  }, {
	    key: 'moveRight',
	    value: function moveRight(currGrid) {
	      if (!this.isAtBoundary(currGrid, 'right')) this.cells.forEach(function (cell) {
	        return cell.setX.call(cell, cell.x + 1);
	      });
	    }
	  }, {
	    key: 'isAtBoundary',
	    value: function isAtBoundary(grid, direction) {
	      var dir = direction === 'left' ? -1 : 1;
	      return this.cells.reduce(function (isAtEdge, cell) {
	        if (isAtEdge) return true;
	        if (cell.y >= 0) return grid[cell.y][cell.x + dir] !== ' ';
	        return false;
	      }, false);
	    }
	  }, {
	    key: 'hasImpacted',
	    value: function hasImpacted(maxYPerCol) {
	      return this.cells.reduce(function (hasImpacted, cell) {
	        if (hasImpacted) return true;
	        return cell.y === maxYPerCol[cell.x] - 1;
	      }, false);
	    }
	  }, {
	    key: 'hasIllegalXVals',
	    value: function hasIllegalXVals() {
	      var _this = this;

	      return this.cells.reduce(function (hasIllegalVals, cell) {
	        if (hasIllegalVals) return hasIllegalVals;
	        if (cell.x < 0) return 1;
	        if (cell.x > _this.maxX - 1) return -1;
	        return false;
	      }, false);
	    }
	  }, {
	    key: 'hasIllegalYVals',
	    value: function hasIllegalYVals() {
	      var _this2 = this;

	      return this.cells.reduce(function (hasIllegalYVals, cell) {
	        if (hasIllegalYVals) return hasIllegalYVals;
	        return cell.y > _this2.maxY - 1;
	      }, false);
	    }
	  }, {
	    key: 'isImpactingAnotherPiece',
	    value: function isImpactingAnotherPiece(grid, changeInX, changeInY) {
	      return this.cells.reduce(function (isImpactingAnotherPiece, cell, cellIdx) {
	        if (isImpactingAnotherPiece) return true;
	        if (!grid[changeInY(cellIdx)]) return false;
	        if (!grid[changeInY(cellIdx)][changeInX(cellIdx)]) return false;
	        return grid[changeInY(cellIdx)][changeInX(cellIdx)] !== ' ';
	      }, false);
	    }
	  }, {
	    key: 'rotate',
	    value: function rotate(currGrid) {
	      var d = void 0,
	          illegals = void 0;

	      d = this.getChangeFns();

	      if (!this.isImpactingAnotherPiece(currGrid, d.changeInX, d.changeInY)) {
	        this.cells.forEach(function (cell, i) {
	          cell.setX.call(cell, d.changeInX(i));
	          cell.setY.call(cell, d.changeInY(i));
	        });
	      }

	      illegals = this.hasIllegalXVals();
	      while (illegals) {
	        this.cells.forEach(function (cell) {
	          return cell.setX.call(cell, cell.x + illegals);
	        });
	        illegals = this.hasIllegalXVals();
	      }

	      if (this.hasIllegalYVals()) {
	        this.cells.forEach(function (cell) {
	          return cell.setY.call(cell, cell.y - 1);
	        });
	      }
	    }
	  }]);

	  return Piece;
	}();

	exports.default = Piece;

/***/ }),
/* 4 */
/***/ (function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Cell = function () {
	  function Cell(fill, x, y, staticX, staticY) {
	    _classCallCheck(this, Cell);

	    this.fill = fill;
	    this.x = x;
	    this.y = y;
	    this.staticX = staticX;
	    this.staticY = staticY;
	  }

	  _createClass(Cell, [{
	    key: "setX",
	    value: function setX(x) {
	      this.x = x;
	    }
	  }, {
	    key: "setY",
	    value: function setY(y) {
	      this.y = y;
	    }
	  }]);

	  return Cell;
	}();

	exports.default = Cell;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _Piece2 = __webpack_require__(3);

	var _Piece3 = _interopRequireDefault(_Piece2);

	var _Cell = __webpack_require__(4);

	var _Cell2 = _interopRequireDefault(_Cell);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Rod = function (_Piece) {
	  _inherits(Rod, _Piece);

	  function Rod(maxX, maxY) {
	    _classCallCheck(this, Rod);

	    var _this = _possibleConstructorReturn(this, (Rod.__proto__ || Object.getPrototypeOf(Rod)).call(this, maxX, maxY));

	    _this.init();
	    return _this;
	  }

	  _createClass(Rod, [{
	    key: 'init',
	    value: function init() {
	      this.cells = [new _Cell2.default('#00FF00', this.midPoint, -4, 1, 0), new _Cell2.default('#00FF00', this.midPoint, -3, 1, 1), new _Cell2.default('#00FF00', this.midPoint, -2, 1, 2), new _Cell2.default('#00FF00', this.midPoint, -1, 1, 3)];
	    }
	  }, {
	    key: 'getChangeFns',
	    value: function getChangeFns() {
	      var x = void 0,
	          y = void 0,
	          changeInX = void 0,
	          changeInY = void 0;

	      if (this.cells[0].x === this.cells[1].x) {
	        // turn on side
	        x = this.cells[0].x;
	        y = this.cells[2].y;
	        changeInX = function changeInX(i) {
	          return x + i - 2;
	        };
	        changeInY = function changeInY(i) {
	          return y;
	        };
	        // });
	      } else {
	        // make vertical
	        x = this.cells[2].x;
	        y = this.cells[0].y;
	        changeInX = function changeInX(i) {
	          return x;
	        };
	        changeInY = function changeInY(i) {
	          return y + i - 2;
	        };
	      }

	      return { changeInX: changeInX, changeInY: changeInY };
	    }
	  }]);

	  return Rod;
	}(_Piece3.default);

	exports.default = Rod;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _Piece2 = __webpack_require__(3);

	var _Piece3 = _interopRequireDefault(_Piece2);

	var _Cell = __webpack_require__(4);

	var _Cell2 = _interopRequireDefault(_Cell);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Elle = function (_Piece) {
	  _inherits(Elle, _Piece);

	  function Elle(maxX, maxY) {
	    _classCallCheck(this, Elle);

	    var _this = _possibleConstructorReturn(this, (Elle.__proto__ || Object.getPrototypeOf(Elle)).call(this, maxX, maxY));

	    _this.init();
	    return _this;
	  }

	  _createClass(Elle, [{
	    key: 'init',
	    value: function init() {
	      this.cells = [new _Cell2.default('#FF0000', this.midPoint, -3, 0.5, 0.5), new _Cell2.default('#FF0000', this.midPoint, -2, 0.5, 1.5), new _Cell2.default('#FF0000', this.midPoint, -1, 0.5, 2.5), new _Cell2.default('#FF0000', this.midPoint + 1, -1, 1.5, 2.5)];
	    }
	  }, {
	    key: 'getChangeFns',
	    value: function getChangeFns() {
	      var x = void 0,
	          y = void 0,
	          changeInX = void 0,
	          changeInY = void 0;

	      x = this.cells[1].x;
	      y = this.cells[1].y;

	      if (this.cells[0].y === this.cells[3].y - 1) {
	        changeInX = function changeInX(i) {
	          if (i === 3) return x - 1;
	          return x;
	        };
	        changeInY = function changeInY(i) {
	          if (i !== 3) return y + 1 - i;
	          return y - 1;
	        };
	      } else if (this.cells[0].x === this.cells[3].x - 1) {
	        changeInX = function changeInX(i) {
	          if (i !== 3) return x + 1 - i;
	          return x - 1;
	        };
	        changeInY = function changeInY(i) {
	          if (i === 3) return y + 1;
	          return y;
	        };
	      } else if (this.cells[0].y === this.cells[3].y + 1) {
	        changeInX = function changeInX(i) {
	          if (i === 3) return x + 1;
	          return x;
	        };
	        changeInY = function changeInY(i) {
	          if (i !== 3) return y - 1 + i;
	          return y + 1;
	        };
	      } else if (this.cells[0].x === this.cells[3].x + 1) {
	        changeInX = function changeInX(i) {
	          if (i !== 3) return x - 1 + i;
	          return x + 1;
	        };
	        changeInY = function changeInY(i) {
	          if (i === 3) return y - 1;
	          return y;
	        };
	      }

	      return { changeInX: changeInX, changeInY: changeInY };
	    }
	  }]);

	  return Elle;
	}(_Piece3.default);

	exports.default = Elle;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _Piece2 = __webpack_require__(3);

	var _Piece3 = _interopRequireDefault(_Piece2);

	var _Cell = __webpack_require__(4);

	var _Cell2 = _interopRequireDefault(_Cell);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Tee = function (_Piece) {
	  _inherits(Tee, _Piece);

	  function Tee(maxX, maxY) {
	    _classCallCheck(this, Tee);

	    var _this = _possibleConstructorReturn(this, (Tee.__proto__ || Object.getPrototypeOf(Tee)).call(this, maxX, maxY));

	    _this.init();
	    return _this;
	  }

	  _createClass(Tee, [{
	    key: 'init',
	    value: function init() {
	      this.cells = [new _Cell2.default('#FF0099', this.midPoint - 1, -1, 0, 2), new _Cell2.default('#FF0099', this.midPoint, -1, 1, 2), new _Cell2.default('#FF0099', this.midPoint + 1, -1, 2, 2), new _Cell2.default('#FF0099', this.midPoint, -2, 1, 1)];
	    }
	  }, {
	    key: 'getChangeFns',
	    value: function getChangeFns() {
	      var x = void 0,
	          y = void 0,
	          changeInX = void 0,
	          changeInY = void 0;

	      x = this.cells[1].x;
	      y = this.cells[1].y;

	      if (this.cells[0].y > this.cells[3].y && this.cells[0].x < this.cells[3].x) {
	        // upside-down T
	        changeInX = function changeInX(i) {
	          if (i === 3) return x + 1;
	          return x;
	        };
	        changeInY = function changeInY(i) {
	          if (i !== 3) return y - 1 + i;
	          return y;
	        };
	      } else if (this.cells[0].y < this.cells[3].y && this.cells[0].x < this.cells[3].x) {
	        // sideways pointing right
	        changeInX = function changeInX(i) {
	          if (i !== 3) return x + 1 - i;
	          return x;
	        };
	        changeInY = function changeInY(i) {
	          if (i === 3) return y + 1;
	          return y;
	        };
	      } else if (this.cells[0].y < this.cells[3].y && this.cells[0].x > this.cells[3].x) {
	        // T
	        changeInX = function changeInX(i) {
	          if (i === 3) return x - 1;
	          return x;
	        };
	        changeInY = function changeInY(i) {
	          if (i !== 3) return y + 1 - i;
	          return y;
	        };
	      } else if (this.cells[0].y > this.cells[3].y && this.cells[0].x > this.cells[3].x) {
	        // sideways pointing left
	        changeInX = function changeInX(i) {
	          if (i !== 3) return x - 1 + i;
	          return x;
	        };
	        changeInY = function changeInY(i) {
	          if (i === 3) return y - 1;
	          return y;
	        };
	      }

	      return { changeInX: changeInX, changeInY: changeInY };
	    }
	  }]);

	  return Tee;
	}(_Piece3.default);

	exports.default = Tee;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _Piece2 = __webpack_require__(3);

	var _Piece3 = _interopRequireDefault(_Piece2);

	var _Cell = __webpack_require__(4);

	var _Cell2 = _interopRequireDefault(_Cell);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var SquiggleA = function (_Piece) {
	  _inherits(SquiggleA, _Piece);

	  function SquiggleA(maxX, maxY) {
	    _classCallCheck(this, SquiggleA);

	    var _this = _possibleConstructorReturn(this, (SquiggleA.__proto__ || Object.getPrototypeOf(SquiggleA)).call(this, maxX, maxY));

	    _this.isUpright = true;
	    _this.init();
	    return _this;
	  }

	  _createClass(SquiggleA, [{
	    key: 'init',
	    value: function init() {
	      this.cells = [new _Cell2.default('#FFFF00', this.midPoint + 1, -3, 1.5, 0.5), new _Cell2.default('#FFFF00', this.midPoint + 1, -2, 1.5, 1.5), new _Cell2.default('#FFFF00', this.midPoint, -2, 0.5, 1.5), new _Cell2.default('#FFFF00', this.midPoint, -1, 0.5, 2.5)];
	    }
	  }, {
	    key: 'getChangeFns',
	    value: function getChangeFns() {
	      var x = void 0,
	          y = void 0,
	          changeInX = void 0,
	          changeInY = void 0;

	      x = this.cells[1].x;
	      y = this.cells[1].y;

	      if (this.cells[0].y < this.cells[3].y && this.cells[0].x > this.cells[3].x) {
	        changeInX = function changeInX(i) {
	          if (!i) return x + 1;
	          if (i === 1 || i === 2) return x;
	          return x - 1;
	        };
	        changeInY = function changeInY(i) {
	          if (!i || i === 1) return y;
	          return y - 1;
	        };
	      } else {
	        changeInX = function changeInX(i) {
	          if (!i || i === 1) return x;
	          return x - 1;
	        };
	        changeInY = function changeInY(i) {
	          if (!i) return y - 1;
	          if (i === 1 || i === 2) return y;
	          return y + 1;
	        };
	      }

	      return { changeInX: changeInX, changeInY: changeInY };
	    }
	  }]);

	  return SquiggleA;
	}(_Piece3.default);

	exports.default = SquiggleA;

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _Piece2 = __webpack_require__(3);

	var _Piece3 = _interopRequireDefault(_Piece2);

	var _Cell = __webpack_require__(4);

	var _Cell2 = _interopRequireDefault(_Cell);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var SquiggleB = function (_Piece) {
	  _inherits(SquiggleB, _Piece);

	  function SquiggleB(maxX, maxY) {
	    _classCallCheck(this, SquiggleB);

	    var _this = _possibleConstructorReturn(this, (SquiggleB.__proto__ || Object.getPrototypeOf(SquiggleB)).call(this, maxX, maxY));

	    _this.init();
	    return _this;
	  }

	  _createClass(SquiggleB, [{
	    key: 'init',
	    value: function init() {
	      this.cells = [new _Cell2.default('#00FFFF', this.midPoint, -3, 0.5, 0.5), new _Cell2.default('#00FFFF', this.midPoint, -2, 0.5, 1.5), new _Cell2.default('#00FFFF', this.midPoint + 1, -2, 1.5, 1.5), new _Cell2.default('#00FFFF', this.midPoint + 1, -1, 1.5, 2.5)];
	    }
	  }, {
	    key: 'getChangeFns',
	    value: function getChangeFns() {
	      var x = void 0,
	          y = void 0,
	          changeInX = void 0,
	          changeInY = void 0;

	      x = this.cells[1].x;
	      y = this.cells[1].y;

	      if (this.cells[0].y < this.cells[3].y && this.cells[0].x < this.cells[3].x) {
	        changeInX = function changeInX(i) {
	          if (!i) return x - 1;
	          if (i === 1 || i === 2) return x;
	          return x + 1;
	        };
	        changeInY = function changeInY(i) {
	          if (!i || i === 1) return y + 1;
	          return y;
	        };
	      } else {
	        changeInX = function changeInX(i) {
	          if (!i || i === 1) return x;
	          return x + 1;
	        };
	        changeInY = function changeInY(i) {
	          if (!i) return y - 1;
	          if (i === 1 || i === 2) return y;
	          return y + 1;
	        };
	      }

	      return { changeInX: changeInX, changeInY: changeInY };
	    }
	  }]);

	  return SquiggleB;
	}(_Piece3.default);

	exports.default = SquiggleB;

/***/ }),
/* 10 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.initGrid = initGrid;
	exports.makeRow = makeRow;
	exports.drawBorder = drawBorder;
	exports.getRandomShape = getRandomShape;
	exports.lightenDarkenColor = lightenDarkenColor;
	exports.drawCell = drawCell;
	exports.drawTriangle = drawTriangle;
	exports.applyStyles = applyStyles;
	function initGrid(width, height) {
	  var grid = [];
	  for (var h = 0; h < height; h++) {
	    grid.push([]);
	    for (var w = 0; w < width; w++) {
	      grid[h].push(' ');
	    }
	  }
	  return grid;
	}

	function makeRow(width) {
	  var row = [];
	  for (var w = 0; w < width; w++) {
	    row.push(' ');
	  }
	  return [row];
	}

	function drawBorder(width) {
	  if (!width) return '--';
	  return '-' + drawBorder(width - 1);
	}

	function getRandomShape() {
	  return this.shapes[Math.floor(Math.random() * this.shapes.length)];
	}

	function lightenDarkenColor(col, amt) {
	  col = col.slice(1);
	  var num = parseInt(col, 16);
	  var r = (num >> 16) + amt;
	  var b = (num >> 8 & 0x00FF) + amt;
	  var g = (num & 0x0000FF) + amt;
	  r = correctColorComponent(r);
	  b = correctColorComponent(b);
	  g = correctColorComponent(g);
	  return '#' + (g | b << 8 | r << 16).toString(16);
	}

	function correctColorComponent(c) {
	  if (c > 255) c = 255;
	  if (c < 0) c = 0;
	  return c;
	}

	function drawCell(ctx, x, y, fill, d) {
	  ctx.fillStyle = fill;
	  ctx.fillRect(x, y, d, d);
	  drawTriangle(ctx, [[x, y], [x + d, y + d], [x, y + d]], 'rgba(100,100,100,0.25)');
	  drawTriangle(ctx, [[x + d, y], [x, y + d], [x + d, y + d]], 'rgba(100,100,100,0.5)');
	}

	function drawTriangle(ctx, vs, fill) {
	  ctx.beginPath();
	  ctx.moveTo(vs[0][0], vs[0][1]);
	  ctx.lineTo(vs[1][0], vs[1][1]);
	  ctx.lineTo(vs[2][0], vs[2][1]);
	  ctx.closePath();
	  ctx.fillStyle = fill;
	  ctx.fill();
	}

	function applyStyles($nodes, styles) {
	  $nodes.forEach(function ($node) {
	    $node.style.backgroundColor = styles.backgroundColor;
	    // $node.style.color = styles.color;
	  });
	}

/***/ }),
/* 11 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = {
		1: {
			backgroundColor: 'rgba(0,0,0,0.7)'
		},
		2: {
			backgroundColor: 'rgba(0,0,0,0.5)'
		},
		3: {
			backgroundColor: 'rgba(0,0,80,0.5)'
		},
		4: {
			backgroundColor: 'rgba(0,80,0,0.5)'
		},
		5: {
			backgroundColor: 'rgba(80,0,0,0.5)'
		},
		6: {
			backgroundColor: 'rgba(120,0,0,0.5)'
		},
		7: {
			backgroundColor: 'rgba(160,0,0,0.5)'
		},
		8: {
			backgroundColor: 'rgba(160,0,0,0.7)'
		},
		9: {
			backgroundColor: 'rgba(200,0,0,0.7)'
		},
		10: {
			backgroundColor: 'rgba(240,0,0,0.7)'
		}
	};

/***/ })
/******/ ]);