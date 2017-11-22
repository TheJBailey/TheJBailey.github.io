function Tile (x, y, tileMap) {
  this.x = x;
  this.y = y;
  this.tileMap = tileMap;
  this.state = 0;
}

Tile.prototype.render = function (interpPerc) {
  var xt = this.x * this.tileMap.tileSize + this.tileMap.x;
  var yt = this.y * this.tileMap.tileSize + this.tileMap.y;
  context.tile(xt, yt, this.tileMap.tileSize, this.tileMap.color[this.state]);
};
