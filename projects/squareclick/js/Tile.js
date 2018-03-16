function Tile (x, y, tileMap, bind) {
  this.x = x;
  this.y = y;
  this.map = tileMap;
  this.state = 0;
  this.bind = bind;

  this.enableBind();
}

Tile.prototype.enableBind = function () {
  window.addEventListener('keydown', this.bindingListener.bind(this));
}

Tile.prototype.setBind = function (bind) {
  this.bind = bind;
}

Tile.prototype.bindingListener = function (event) {
  if(event.altKey) return;
  if(this.bind == event.key) this.map.clickTile(this.x, this.y);
}

Tile.prototype.render = function (interpPerc) {
  var xt = this.x * this.map.tileSize + this.map.x;
  var yt = this.y * this.map.tileSize + this.map.y;
  context.tile(xt, yt, this.map.tileSize, this.map.color[this.state],'#444');

  if(!this.map.binds) return;

  context.font = "15px Montserrat";
  context.fillStyle = this.map.color[3];
  var nx = (this.x)*this.map.tileSize+this.map.x+this.map.tileSize-context.measureText(this.bind).width-7;
  var ny = (this.y)*this.map.tileSize+this.map.y+this.map.tileSize-7;
  context.fillText(this.bind, nx,ny);
};
