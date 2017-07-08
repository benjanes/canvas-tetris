// window.requestAnimFrame = window.requestAnimationFrame ||
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

import Game from './modules/Game';

const $nodes = {
  canvas: document.getElementById('tetris'),
  start: document.getElementById('start'),
  pause: document.getElementById('pause'),
  wrapper: document.getElementsByTagName('body')[0],
  title: document.getElementsByTagName('h1')[0]
};

const tetrisGame = new Game(15, 30, 12, $nodes);
