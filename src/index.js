import Board from './modules/Board';

const tetrisGame = new Board(20, 20, document.getElementById('tetris_board'));
// document.addEventListener('keydown', tetrisGame.handleKeydown.bind(tetrisGame));
tetrisGame.drawBoard();
