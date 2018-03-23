const MAP_STATE = {
  FAIL: 1,
  TIME_LIMIT: 2,
  PLAY: 3,
  PAUSE: 4,
  START: 5,
  BIND: 6
}

function TileMap(x, y, mapSize, tileSize, activeLimit, time, mode, colors) {
  this.x = (canvas.width - (tileSize*mapSize)) / 2;
  this.y = 150;
  this.colors = colors;
  this.mapSize = mapSize;
  this.tileSize = tileSize;
  this.activeLimit = activeLimit;
  this.time = time * 1000;
  this.timer = time;
  this.mode = mode;
  this.color = colors;
  this.score = 0;
  this.fail = {tile:-1, time:0.0};//TODO rename
  this.k = {x : -1, y: -1};
  this.binds = false;
  this.reset();
}

//-------------------------------UPDATE---------------------------------
TileMap.prototype.update = function(delta) {
  var inBounds = (mouse.x >= this.x && mouse.x <= this.x + this.size()) &&
              (mouse.y >= this.y && mouse.y <= this.y + this.size());

  var mx = -1;
  var my = -1;
  if(mouse.pressed & inBounds) {
    mx = Math.floor((mouse.x - this.x) / this.tileSize);
    my = Math.floor((mouse.y - this.y) / this.tileSize);
  }
  var tx = (this.k.x == -1 ? mx : this.k.x);
  var ty = (this.k.y == -1 ? my : this.k.y);

  var tileIndex = tx + ty * this.mapSize;

  switch (this.state) {
    case MAP_STATE.START:
      if (tileIndex > -1 && tileIndex < this.tiles.length) {
        if (this.tileCheck(tileIndex) == 0) this.failed(tileIndex);
        else {
          this.score++;
          this.activateTiles(1);
          this.tiles[tileIndex].state = 0;
          this.play();
        }
      }
      break;
    case MAP_STATE.PLAY:
      if(this.mode != MODE.CHILL) this.timer -= delta;
      if (tileIndex > -1 && tileIndex < this.tiles.length) {
        if (this.tileCheck(tileIndex) == 0) this.failed(tileIndex);
        else {
          switch (mode) {
            case MODE.RACE:

              break;
            case MODE.TIME_TRIAL:
              this.score++;
              this.activateTiles(1);
              this.tiles[tileIndex].state = 0;
              break;
            case MODE.ENDLESS:
              if(this.score % 15 == 0) this.timer = this.time;
              this.score++;
              this.activateTiles(1);
              this.tiles[tileIndex].state = 0;
              break;
            case MODE.CHILL:
              this.score++;
              this.activateTiles(1);
              this.tiles[tileIndex].state = 0;
              break;
          }
        }
      }
      if(this.timer <= 0) this.timeLimitReached();
      break;
    case MAP_STATE.PAUSE:
      break;
    case MAP_STATE.TIME_LIMIT:
      this.fail.time += delta
       var time = Math.floor(this.fail.time / 100) * 1;
       if(time < this.tiles.length) this.tiles[time].state = 1;
       if(this.fail.time > this.tiles.length*100) this.reset();
      break;
    case MAP_STATE.FAIL:
      this.fail.time += 1 * delta;
      var time = Math.floor(this.fail.time / 100) * 1;
      if(time % 2 == 0) this.tiles[this.fail.tile].state = 0;
      else this.tiles[this.fail.tile].state = 2;

      if(this.fail.time > 1500) {
        this.fail.time = 0;
        this.reset();
      }
      break;
    case MAP_STATE.BIND:

      break;
    default:
  }

  this.k.x = this.k.y = -1; //reset keyboard input
}

TileMap.prototype.render = function(interpPerc) {
  if(this.state == MAP_STATE.START) {
    context.text(null, this.size()+this.y+25, 'click to start', 16, 'Montserrat', this.color[1]);
  }
  switch (mode) {
    case MODE.ENDLESS:
    case MODE.RACE:
    case MODE.CHILL:
    case MODE.TIME_TRIAL:
      this.tiles.forEach(function(tile) { tile.render(interpPerc); })
      context.timer(this);
      break;
    default:
  }
  context.text(this.x, this.y+this.size()+25, modeName(), 16, 'Montserrat',this.color[1]);
  context.font = "16px Montserrat";
  context.fillStyle = this.color[1];
  var rx = this.size()+this.x-context.measureText('score: '+ this.score).width;
  context.fillText('score: '+ this.score, rx, this.size()+this.y+25);
}

TileMap.prototype.initTiles = function() {
  this.tiles = [];
  for (var ys = 0; ys < this.mapSize; ys++) {
    for (var xs = 0; xs < this.mapSize; xs++) {
      this.tiles.push(new Tile(xs, ys, this, def_binds[ys][xs]));
    }
  }
  this.timer = this.time;
}

TileMap.prototype.activateTiles = function(numberOfTiles) {
  while (numberOfTiles > 0) {
    var x = Math.floor(Math.random() * this.mapSize);
    var y = Math.floor(Math.random() * this.mapSize);
    if (this.tiles[x + y * this.mapSize].state == 1) continue;
    else {
      this.tiles[x + y * this.mapSize].state = 1;
      numberOfTiles--;
    }
  }
}

TileMap.prototype.reset = function() {
  this.initTiles();
  this.activateTiles(this.activeLimit);
  this.timer = this.time;
  this.fail.tile = -1;
  this.fail.time = 0;
  this.score = 0;
  this.state = MAP_STATE.START;
  if(dev) console.log("reset");
}

TileMap.prototype.play = function() {
  this.state = MAP_STATE.PLAY;
  if(dev) console.log('play');
}

TileMap.prototype.failed = function(tile) {
  this.state = MAP_STATE.FAIL;
  this.fail.tile = tile;
  this.fail.time = 0;
  if(dev) console.log('fail');
}

TileMap.prototype.timeLimitReached = function() {
  this.state = MAP_STATE.TIME_LIMIT;
  this.fail.time = 0;
  if(dev) console.log('time limit');
}

TileMap.prototype.size = function () {
  return this.mapSize * this.tileSize;
};


TileMap.prototype.clickTile = function(tx, ty) {
  this.k.x = tx;
  this.k.y = ty;
}

TileMap.prototype.tileCheck = function(index) {
  return this.tiles[index].state;
}

TileMap.prototype.nextMode = function() {
  this.reset();
  if(this.mode < 2) this.mode++;
  else this.mode = 0;
}

function modeName() {
  switch (map.mode) {
    case MODE.RACE:
      return 'race'
    case MODE.ENDLESS:
      return 'endless'
    case MODE.CHILL:
      return 'chill'
    case MODE.TIME_TRIAL:
      return 'time trial'
    default:
  }
}
