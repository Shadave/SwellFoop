// Generated by CoffeeScript 1.10.0
(function() {
  var Component, checkLeft, checkMouse, click, fieldSize, getMouse, i, isNotEnd, j, leftOver, mouse, mousestate, ref, ref1, score, startGame, tiles, update, updateScore, voidAction, wnd, x, y;

  fieldSize = 20;

  isNotEnd = true;

  checkLeft = true;

  tiles = [];

  for (y = i = 1, ref = fieldSize; 1 <= ref ? i <= ref : i >= ref; y = 1 <= ref ? ++i : --i) {
    for (x = j = 1, ref1 = fieldSize; 1 <= ref1 ? j <= ref1 : j >= ref1; x = 1 <= ref1 ? ++j : --j) {
      tiles.push("block" + y + "-" + x);
    }
  }

  mouse = {
    x: 0,
    y: 0
  };

  mousestate = 0;

  leftOver = Math.pow(fieldSize, 2);

  score = 0;

  updateScore = function(add) {
    var k, len, tile;
    score += add;
    leftOver = 0;
    for (k = 0, len = tiles.length; k < len; k++) {
      tile = tiles[k];
      if (tile !== null) {
        leftOver++;
      }
    }
    if (leftOver === 0) {
      score += 1000;
      isNotEnd = false;
    }
    document.getElementById("score").innerHTML = score.toString();
    document.getElementById("leftover").innerHTML = leftOver.toString();
    console.log("Score: " + score);
    return console.log("Left: " + leftOver);
  };

  getMouse = function(evnt) {
    var cnvs, retVal;
    cnvs = wnd.screen.getBoundingClientRect();
    return retVal = {
      x: evnt.clientX - cnvs.left,
      y: evnt.clientY - cnvs.top
    };
  };

  click = function() {
    var deletable, ic, k, l, len, len1, tile, toAdd;
    deletable = [];
    for (k = 0, len = tiles.length; k < len; k++) {
      tile = tiles[k];
      if (tile !== null) {
        if (tile.state === true) {
          deletable.push(tiles.indexOf(tile));
        }
      }
    }
    ic = 0;
    if (deletable.length > 1) {
      for (l = 0, len1 = deletable.length; l < len1; l++) {
        tile = deletable[l];
        tiles[tile] = null;
      }
      if (deletable.length === 3) {
        toAdd = 1;
      } else if (deletable.length > 3) {
        toAdd = (deletable.length - 2) * 2;
      } else {
        toAdd = 0;
      }
      return updateScore(toAdd);
    }
  };

  checkMouse = function() {
    document.body.onmousedown = function() {
      return ++mousestate;
    };
    return document.body.onmouseup = function() {
      var k, len, tile;
      if (mousestate > 0) {
        click();
        isNotEnd = false;
        for (k = 0, len = tiles.length; k < len; k++) {
          tile = tiles[k];
          if (tile !== null) {
            tile.getSurrElems();
            if (isNotEnd === false) {
              if (tile.topElem !== void 0) {
                if (tiles[tile.topElem].origColor === tile.origColor) {
                  isNotEnd = true;
                }
              }
              if (tile.rightElem !== void 0) {
                if (tiles[tile.rightElem].origColor === tile.origColor) {
                  isNotEnd = true;
                }
              }
              if (tile.bottomElem !== void 0) {
                if (tiles[tile.bottomElem].origColor === tile.origColor) {
                  isNotEnd = true;
                }
              }
              if (tile.leftElem !== void 0) {
                if (tiles[tile.leftElem].origColor === tile.origColor) {
                  isNotEnd = true;
                }
              }
            }
          }
        }
        return mousestate = 0;
      } else {
        return mousestate = 0;
      }
    };
  };

  startGame = function() {
    var dx, dy, k, l, len, len1, randInt, tile, tileColor;
    wnd.start();
    wnd.screen.addEventListener("mousemove", function(evnt) {
      var mousepos;
      mousepos = getMouse(evnt);
      mouse.x = mousepos.x;
      return mouse.y = mousepos.y;
    }, false);
    dx = 0;
    dy = 0;
    for (k = 0, len = tiles.length; k < len; k++) {
      tile = tiles[k];
      randInt = Math.floor(Math.random() * 3);
      if (randInt === 0) {
        tileColor = "Green";
      } else if (randInt === 1) {
        tileColor = "Salmon";
      } else {
        tileColor = "Blue";
      }
      tiles[tiles.indexOf(tile)] = new Component(40, 40, tileColor, dx, dy);
      dx += 40;
      if (dx >= 800) {
        dx = 0;
        dy += 40;
      }
    }
    for (l = 0, len1 = tiles.length; l < len1; l++) {
      tile = tiles[l];
      if (tile !== null) {
        tile.getSurrElems();
      }
    }
  };

  Component = (function() {
    function Component(width, height, color, x1, y1) {
      var ctx;
      this.width = width;
      this.height = height;
      this.color = color;
      this.x = x1;
      this.y = y1;
      this.origColor = this.color;
      this.state = false;
      ctx = wnd.context;
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
      ctx.strokeStyle = "white";
      ctx.lineWidth = 1;
      ctx.strokeRect(this.x, this.y, this.width, this.height);
    }

    Component.prototype.getSurrElems = function() {
      var k, len, tile;
      this.topElem = void 0;
      this.rightElem = void 0;
      this.bottomElem = void 0;
      this.leftElem = void 0;
      for (k = 0, len = tiles.length; k < len; k++) {
        tile = tiles[k];
        if (tile !== null) {
          if ((tile.x === this.x) && (tile.y === this.y - 40)) {
            this.topElem = tiles.indexOf(tile);
          }
          if ((tile.x === this.x + 40) && (tile.y === this.y)) {
            this.rightElem = tiles.indexOf(tile);
          }
          if ((tile.x === this.x) && (tile.y === this.y + 40)) {
            this.bottomElem = tiles.indexOf(tile);
          }
          if ((tile.x === this.x - 40) && (tile.y === this.y)) {
            this.leftElem = tiles.indexOf(tile);
          }
        }
      }
    };

    Component.prototype.updateComp = function() {
      var ctx, k, l, len, len1, len2, len3, m, n, tile;
      if (this.bottomElem === void 0 && this.y < 760) {
        this.y += 40;
        for (k = 0, len = tiles.length; k < len; k++) {
          tile = tiles[k];
          if (tile !== null) {
            tile.getSurrElems();
          }
        }
        for (l = 0, len1 = tiles.length; l < len1; l++) {
          tile = tiles[l];
          if (tile !== null) {
            if (tile.y < 760 && tile.bottomElem === void 0) {
              checkLeft = false;
            }
          }
        }
      }
      if (checkLeft === true && this.y === 760 && this.x !== 0 && this.leftElem === void 0) {
        for (m = 0, len2 = tiles.length; m < len2; m++) {
          tile = tiles[m];
          if (tile !== null) {
            if (tile.x >= this.x) {
              tile.x -= 40;
            }
          }
        }
        for (n = 0, len3 = tiles.length; n < len3; n++) {
          tile = tiles[n];
          if (tile !== null) {
            tile.getSurrElems();
          }
        }
      }
      ctx = wnd.context;
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
      ctx.strokeStyle = "white";
      ctx.lineWidth = 1;
      ctx.strokeRect(this.x, this.y, this.width, this.height);
      if (this.state === true) {
        this.color = this.origColor;
        return this.color = "light" + this.color;
      } else {
        return this.color = this.origColor;
      }
    };

    Component.prototype.getState = function() {
      return this.state;
    };

    Component.prototype.checkState = function() {
      var k, len, tile;
      if ((mouse.x > this.x && mouse.x < this.x + 40) && (mouse.y > this.y && mouse.y < this.y + 40)) {
        for (k = 0, len = tiles.length; k < len; k++) {
          tile = tiles[k];
          if (tile !== null) {
            if (tile.origColor !== this.origColor) {
              tile.state = false;
            }
          }
        }
        return this.state = true;
      } else {
        this.state = false;
        if (this.topElem !== void 0) {
          if ((tiles[this.topElem].getState() === true) && (tiles[this.topElem].origColor === this.origColor)) {
            this.state = true;
          }
        }
        if (this.rightElem !== void 0) {
          if ((tiles[this.rightElem].getState() === true) && (tiles[this.rightElem].origColor === this.origColor)) {
            this.state = true;
          }
        }
        if (this.bottomElem !== void 0) {
          if ((tiles[this.bottomElem].getState() === true) && (tiles[this.bottomElem].origColor === this.origColor)) {
            this.state = true;
          }
        }
        if (this.leftElem !== void 0) {
          if ((tiles[this.leftElem].getState() === true) && (tiles[this.leftElem].origColor === this.origColor)) {
            return this.state = true;
          }
        }
      }
    };

    Component.prototype.giveInfo = function() {
      console.log(this.width, this.height, this.color, this.x, this.y);
    };

    return Component;

  })();

  update = function() {
    var k, len, tile;
    wnd.clear();
    checkMouse();
    checkLeft = true;
    for (k = 0, len = tiles.length; k < len; k++) {
      tile = tiles[k];
      if (tile !== null) {
        tile.checkState();
        tile.updateComp();
      }
    }
    if (isNotEnd === false) {
      wnd.stop();
      return;
    }
  };

  voidAction = function() {};

  wnd = {
    screen: document.createElement("canvas"),
    start: function() {
      this.screen.width = 800;
      this.screen.height = 800;
      this.context = this.screen.getContext("2d");
      document.body.insertBefore(this.screen, document.body.childNodes[2]);
      this.interval = setInterval(update, 20);
    },
    clear: function() {
      this.context.clearRect(0, 0, this.screen.width, this.screen.height);
    },
    stop: function() {
      var span;
      this.interval = setInterval(voidAction, 10000);
      span = document.createElement("span");
      span.innerHTML = "Game Over<br/>Score: " + score;
      return document.body.insertBefore(span, document.body.childNodes[2]);
    }
  };

  startGame();

}).call(this);
