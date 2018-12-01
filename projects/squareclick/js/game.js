const GAME_STATE = {
  PLAYING : 1,
  PAUSED  : 2,
  MENU    : 3
}

const MODE = {
  RACE    : -2,
  TIME_TRIAL: 0,
  ENDLESS : 1,
  CHILL   : 2
}

function Mouse() {
  this.x = this.y = 0;
  this.active = this.pressed = this.released = false;
  this.button = -1;
}

Mouse.prototype.update = function() {
  mouse.pressed = mouse.released = false;
}

var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');

var mouse = new Mouse();
var ctrl = false, alt = false, dev = false;

var title = {
  y: 90,
  text: 'square click',
  size:'72',
  font:'Consolas'
}

//TODO maybe
var menu = {
  options:new Menu(optionsData),
}

var dark = false;
var state = GAME_STATE.PLAYING;
var mode = MODE.ENDLESS;

var def_binds = [
  ['q','w','e'],
  ['a','s','d'],
  ['z','x','c']
]

var map = new TileMap(0,0,3,120,3,5,mode,['#fff','#36FBB3','#F45B69', '#222'])

function begin() {
  if(dark) {
    document.body.style.background = "#222222";
    map.color[3] = '#ffffff';
    map.color[0] = '#222222';
  } else {
    document.body.style.background = "#ffffff";
    map.color[3] = '#222222';
    map.color[0] = '#ffffff';
  }
}

function update(delta) {
  //console.log(state);
  switch(state) {
    case GAME_STATE.PLAYING:
      map.update(delta);
      break;
    case GAME_STATE.PAUSED:
      break;
    case GAME_STATE.MENU:
      menu.options.update(delta);
      break;
  }
  mouse.update();
}

function render(interpPerc) {
  context.clearRect(0, 0, canvas.width, canvas.height);

  context.text(title.x, title.y, title.text, title.size, title.font, map.color[1]);

  switch(state) {
    case GAME_STATE.PLAYING:
      map.render(interpPerc);
      break;
    case GAME_STATE.PAUSED:
      map.render(interpPerc);
      break;
    case GAME_STATE.MENU:
      //menu.options.render(interpPerc);
      break;
  }
  if(dev) context.dev();
}

function end() {
}

CanvasRenderingContext2D.prototype.tile = function(x, y, size, color, border) {
  this.beginPath();
  this.rect(x, y, size, size);
  this.strokeStyle = border;
  this.fillStyle = color;
  this.lineWidth = 1;
  this.stroke();
  this.fill();
}

CanvasRenderingContext2D.prototype.text = function(x,y,text,size,font,color) {
  this.beginPath();
  this.font = size+'px ' + font;
  if(x == null) x = (canvas.width - context.measureText(title.text).width) / 2;
  this.fillStyle = color;
  this.fillText(text, x, y);
}

CanvasRenderingContext2D.prototype.label = function(item) {
  if(item.bg != null) {
    this.beginPath();
    this.rect(item.x,item.y,item.w,item.h);
    this.fillStyle = item.bg;
    this.fill();
  }
  this.beginPath();
  this.font = item.size+'px Montserrat';
  this.fillStyle = item.color;
  this.fillText(item.text, item.textX, item.textY);
}

CanvasRenderingContext2D.prototype.dev = function () {
  this.beginPath();
  this.arc(mouse.x, mouse.y, 2, 0, Math.PI * 2, true);
  this.fillStyle = 'black';
  this.fill();
  this.font = '12px arial';
  this.fillText(mouse.x + ' ' + mouse.y, mouse.x-20, mouse.y-20);
}

CanvasRenderingContext2D.prototype.timer = function (map) {
  this.beginPath();
  this.lineWidth = 6;
  this.moveTo(map.x-4, map.y + map.size()+1);
  this.lineTo(map.x-4, map.y + map.size() - map.size() * (map.timer / map.time)-1);
  this.strokeStyle = map.color[1];
  this.stroke();
  this.closePath();
}

canvas.onmousemove = function(event) {
  var rect = canvas.getBoundingClientRect();
  mouse.x = event.clientX - rect.left;
  mouse.y = event.clientY - rect.top;
}

canvas.onmousedown = function(event) {
  if(!mouse.active) mouse.pressed = true;
  mouse.active = true;
}
canvas.onmouseup = function() {
  if(mouse.active) mouse.released = true;
  mouse.active = false;
}
