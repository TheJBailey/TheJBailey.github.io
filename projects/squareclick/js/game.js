var mouse = {x:'0', y:'0', active:false, pressed:false, released:false};
var score_data = document.getElementById('score');
var accuracy_data = document.getElementById('acc');
var speed_data = document.getElementById('speed');

const GAME_STATE = {
  PLAYING : {name:'playing'},
  PAUSED  : {name:'paused'},
  MENU    : {name:'menu'},
  FAIL    : {name:'fail'},
  WIN     : {name:'win'}
};

var state = {
  name: 'paused',
  mapTime: 0,
  laskClickTime: 0,
  failTime: 0,
  endTime: 0,
  time: 0,
  numberOfClicks: 0,
  lastClickTime: 0
}

var mode = '';


CanvasRenderingContext2D.prototype.tile = function(x, y, size, color) {
  this.beginPath();
  this.rect(x, y, size, size);
  this.strokeStyle = 'black';
  this.fillStyle = color;
  this.lineWidth = 1;
  this.stroke();
  this.fill();
}

CanvasRenderingContext2D.prototype.dev = function () {
  this.beginPath();
  this.arc(mouse.x, mouse.y, 5, 0, Math.PI * 2, true);
  this.fillStyle = 'black';
  this.fill();
}

CanvasRenderingContext2D.prototype.timer = function (map) {
  this.beginPath();
  this.lineWidth = 6;
  this.moveTo(map.x-4, map.y + map.size);
  this.lineTo(map.x-4, map.y + map.size - map.size * (state.mapTime / map.time));
  this.strokeStyle = map.color[1];
  this.stroke();
  this.closePath();
}

canvas.onmousedown = function(event) {
  var rect = canvas.getBoundingClientRect();
  mouse.x = event.clientX - rect.left;
  mouse.y = event.clientY - rect.top;
  if(!mouse.active) mouse.pressed = true;
  mouse.active = true;
}
canvas.onmouseup = function() {
  if(mouse.active) mouse.released = true;
  mouse.active = false;
}
