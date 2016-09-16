import Board from './modules/Board';



const tetrisGame = new Board(20, 20, document.getElementById('tetris_board'));

tetrisGame.drawBoard();

// const square = new Square(20);
// console.log(square);