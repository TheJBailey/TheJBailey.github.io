function TileMap(x, y, color, mapSize, tileSize, activeLimit, time) {
  this.x = x;
  this.y = y;
  this.color = color;
  this.mapSize = mapSize;
  this.tileSize = tileSize;
  this.size = tileSize * mapSize;
  this.activeLimit = activeLimit;
  this.time = time*1000;

  this.reset();
}

TileMap.prototype.initTiles = function () {
  this.tiles = [];
  for (var ys = 0; ys < this.mapSize; ys++) {
    for (var xs = 0; xs < this.mapSize; xs++) {
      this.tiles.push(new Tile(xs, ys, this));
    }
  }
  state.mapTime = this.time;
}

//----------------------------------------------------------UPDATE----------------------------------------------------------------------
TileMap.prototype.update = function (delta) {
  var check = (mouse.x >= this.x && mouse.x <= this.x + this.size) &&
              (mouse.y >= this.y && mouse.y <= this.y + this.size);

  var mx = Math.floor((mouse.x-this.x) / this.tileSize);
  var my = Math.floor((mouse.y-this.y) / this.tileSize);

  var tileIndex = mx + my * this.mapSize;

  switch (state.name) {
    case 'playing':
      switch (mode) {
        case 'endless':
          state.mapTime -= delta;
          if(mouse.pressed && check) {
            if(tileIndex < this.tiles.length)  {
              if (this.tileCheck(tileIndex) == 0) this.fail(tileIndex);
              else {
                this.activateTiles(1);
                this.tiles[tileIndex].state = 0;
                score_data.innerHTML = 'score: ' + ++state.numberOfClicks;
                var timeSinceClick = (state.time - state.lastClickTime) / 1000; //secs ;)
                //speed.innerHTML = Math.round(1 / timeSinceClick * 100) / 100 + ' cps';
                state.lastClickTime = state.time;
                if(state.numberOfClicks % 15 == 0) state.mapTime = this.time;
              }
            }
          }
          if(state.mapTime < 0) this.timeLimitReached();
          break;
        case 'race':
          state.mapTime -= delta;
          if(mouse.pressed && check) {
            if(tileIndex < this.tiles.length)  {
              if (this.tileCheck(tileIndex) == 0) this.fail(tileIndex);
              else {
                this.activateTiles(1);
                this.tiles[tileIndex].state = 0;
                score_data.innerHTML = 'score: ' + ++state.numberOfClicks;
                var timeSinceClick = (state.time - state.lastClickTime) / 1000; //secs ;)
                //speed.innerHTML = Math.round(1 / timeSinceClick * 100) / 100 + ' cps';
              }
            }
          }
          if(state.mapTime < 0) this.timeLimitReached();
          break;
        case 'chill':
          if(mouse.pressed && check) {
            if(tileIndex < this.tiles.length)  {
              if (this.tileCheck(tileIndex) == 0) this.fail(tileIndex);
              else {
                this.activateTiles(1);
                this.tiles[tileIndex].state = 0;
                score_data.innerHTML = 'score: ' + ++state.numberOfClicks;
                var timeSinceClick = (state.time - state.lastClickTime) / 1000; //secs ;)
                //speed.innerHTML = Math.round(1 / timeSinceClick * 100) / 100 + ' cps';
                state.lastClickTime = state.time;
              }
            }
          }
          if(state.mapTime < 0) this.timeLimitReached();
          break;
        default:

      }


      break;
    case 'paused':
      if(mouse.pressed && check) {
        if(tileIndex < this.tiles.length) {
          if(this.tileCheck(tileIndex) == 1) {
            this.activateTiles(1);
            this.tiles[tileIndex].state = 0;
            this.play();
          } else this.fail(tileIndex);
        }
      }
      break;
    case 'time_limit':
      state.endTime += delta;

      var time = Math.floor(state.endTime / 100) * 1;
      if(time < this.tiles.length) this.tiles[time].state = 1;
      if(state.endTime > this.tiles.length*100) this.reset();

      break;
    case 'fail':
      state.failTime += 1 * delta;

      var time = Math.floor(state.failTime / 100) * 1;
      if(time % 2 == 0) this.tiles[state.tileIndex].state = 0;
      else this.tiles[state.tileIndex].state = 2;

      if(state.failTime > 1500) {
        state.failTime = 0;
        this.reset();
      }
      break;
    case 'menu':

      break;
    default:
  }

}

TileMap.prototype.render = function (interpPerc) {
  switch (state.name) {
    case 'playing':
      this.tiles.forEach(function(tile) {
        tile.render(interpPerc);
      });
      if(mode != 'chill') context.timer(this);
      //context.dev();
      break;
    case 'paused':
      this.tiles.forEach(function(tile) {
        tile.render(interpPerc);
      });
      if(mode != 'chill') context.timer(this);
      break;
    case 'time_limit':
      this.tiles.forEach(function(tile) {
        tile.render(interpPerc);
      });
      break;
    case 'fail':
      this.tiles.forEach(function(tile) {
        tile.render(interpPerc);
      });
      if(mode != 'chill') context.timer(this);
      break;
    case 'menu':

      break;
    default:
  }
}

TileMap.prototype.activateTiles = function (numberOfTiles) {
  while (numberOfTiles > 0) {
    var x = Math.floor(Math.random() * this.mapSize);
    var y = Math.floor(Math.random() * this.mapSize);
    if(this.tiles[x + y * this.mapSize].state == 1) continue;
    else {
      this.tiles[x + y * this.mapSize].state = 1;
      numberOfTiles--;
    }
  }
}

TileMap.prototype.tileCheck = function (tileIndex) {
  return this.tiles[tileIndex].state;
}

TileMap.prototype.reset = function () {
  this.initTiles();
  this.activateTiles(this.activeLimit);
  state.mapTime = this.time;
  state.endTime = 0;
  state.name = 'paused';
}

TileMap.prototype.play = function () {
  state.numberOfClicks = 0;
  //score.innerHTML = 0;
  state.laskClickTime = state.time;
  state.name = 'playing';
};

TileMap.prototype.fail = function (tileIndex) {
  state.tileIndex = tileIndex;
  state.name = 'fail';
}

TileMap.prototype.timeLimitReached = function () {
  //speed.innerHTML = 'avg ' + Math.round(state.numberOfClicks/(this.time/1000)*100)/100 + ' cps';
  state.name = 'time_limit';
}
