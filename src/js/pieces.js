var currTurn = 'white';

function Piece (row, col, color){
  this.row = row;
  this.col = col;
  this.color = color;
  this.img = null;
}
Piece.prototype.moveTo = function(x, y){
  board[x][y] = this;
  deletePiece(this.row, this.col);
  this.row = Number(x);
  this.col = Number(y);
};
function Rook (row, col, color){
  Piece.call(this, row, col, color);
  var baseImg = this.color === 'white' ? '2656' : '265C';
  this.img = unicodeify(baseImg);
}
Rook.prototype = new Piece();
Rook.prototype.getTargets = function(){
  var targets = [];
  for (var i = this.col - 1; i >= 0; i--) {
    if (canMoveTo(this.row, i)) {
      targets.push({
        x: this.row,
        y: i
      });
    } else {
      break;
    }
    if (isEnemy(this.row, i)) {
      break;
    }
  }
  for (var j = this.col + 1; j <= 7; j++) {
    if (canMoveTo(this.row, j)) {
      targets.push({
        x: this.row,
        y: j
      });
    } else {
      break;
    }
    if (isEnemy(this.row, j)) {
      break;
    }
  }
  for (var k = this.row - 1; k >= 0; k--) {
    if (canMoveTo(k, this.col)) {
      targets.push({
        x: k,
        y: this.col
      });
    } else {
      break;
    }
    if (isEnemy(k, this.col)) {
      break;
    }
  }
  for (var l = this.row + 1; l <=7; l++) {
    if (canMoveTo(l, this.col)) {
      targets.push({
        x: l,
        y:this.col
      });
    } else {
      break;
    }
    if (isEnemy(l, this.col)) {
      break;
    }
  }
  return targets;
};

function Bishop (row, col, color){
  Piece.call(this, row, col, color);
  var baseImg = this.color === 'white' ? '2657' : '265D';
  this.img = unicodeify(baseImg);
}
Bishop.prototype = new Piece();
Bishop.prototype.getTargets = function(){
  var targets = [];
  var dirs = {
    ul : true,
    ur : true,
    dl : true,
    dr : true
  };
  for (var i = 1; i < 7; i++) {
    if (dirs.ul && canMoveTo(this.row - i, this.col - i)) {
      targets.push({
        x: this.row - i,
        y: this.col - i,
      });
      if (isEnemy(this.row - i, this.col - i)) {
        dirs.ul = false;
      }
    } else {
      dirs.ul = false;
    }
    if (dirs.ur && canMoveTo(this.row - i, this.col + i)) {
      targets.push({
        x: this.row - i,
        y: this.col + i,
      });
      if (isEnemy(this.row - i, this.col + i)) {
        dirs.ur = false;
      }
    } else {
      dirs.ur = false;
    }
    if (dirs.dl && canMoveTo(this.row + i, this.col - i)) {
      targets.push({
        x: this.row + i,
        y: this.col - i
      });
      if (isEnemy(this.row + i, this.col - i)) {
        dirs.dl = false;
      }
    } else {
      dirs.dl = false;
    }
    if (dirs.dr && canMoveTo(this.row + i, this.col + i)) {
      targets.push({
        x: this.row + i,
        y: this.col + i
      });
      if (isEnemy(this.row + i, this.col + i)) {
        dirs.dr = false;
      }
    } else {
      dirs.dr = false;
    }
  }
  return targets;
};

function Queen (row, col, color){
  Piece.call(this, row, col, color);
  var baseImg = this.color === 'white' ? '2655' : '265B';
  this.img = unicodeify(baseImg);
}
Queen.prototype = new Piece();
Queen.prototype.getTargets = function(){
  var targetsB = Bishop.prototype.getTargets.call(this);
  var targetsR = Rook.prototype.getTargets.call(this);
  return targetsB.concat(targetsR);
};

function Knight (row, col, color){
  Piece.call(this, row, col, color);
  var baseImg = this.color === 'white' ? '2658' : '265E';
  this.img = unicodeify(baseImg);
}
Knight.prototype = new Piece();
Knight.prototype.getTargets = function(){
  var targets = [];
  for (var i = -2, column; i <= 2; i++) {
    if (i === 0) {
      continue;
    }
    if (Math.abs(i) === 2) {
      column = 1;
    } else if (Math.abs(i) === 1) {
      column = 2;
    }
    if (canMoveTo(this.row + i, this.col + column)) {
      targets.push({
        x: this.row + i,
        y: this.col + column
      });
    }
    if (canMoveTo(this.row + i, this.col + (column * -1))) {
      targets.push({
        x: this.row + i,
        y: this.col + (column * -1)
      });
    }
  }
  return targets;
};

function Pawn (row, col, color, dir){
  this.hasMoved = false;
  this.dir = dir;
  Piece.call(this, row, col, color);
  var baseImg = this.color === 'white' ? '2659' : '265F';
  this.img = unicodeify(baseImg);
}
Pawn.prototype = new Piece();
Pawn.prototype.getTargets = function(forCheck) {
  var targets = [];
  var dir = this.color === 'black' ? 1 : -1;
  var row = this.row + dir;
  var col = this.col;
  if (!forCheck && isOnBoard(row, col) && isEmpty(getCell(row, col))) {
    targets.push({
      x: row,
      y: col
    });
  }
  if (!forCheck && !this.hasMoved && isOnBoard(row + dir, col) && isEmpty(getCell(row + dir, col)) && isEmpty(getCell(row, col))) {
    targets.push({
      x: row + dir,
      y: col
    });
  }
  if (forCheck || isEnemy(row, col + 1)) {
    targets.push({
      x: row,
      y: col + 1
    });
  }
  if (forCheck || isEnemy(row, col - 1)) {
    targets.push({
      x: row,
      y: col -1
    });
  }
  return targets;
};

Pawn.prototype.moveTo = function(x, y){
  Piece.prototype.moveTo.call(this, x, y);
  this.hasMoved = true;
};

function King (row, col, color) {
  Piece.call(this, row, col, color);
  var baseImg = this.color === 'white' ? '2654' : '265A';
  this.img = unicodeify(baseImg);
}

King.prototype = new Piece();
King.prototype.getTargets = function (){
  var targets = [];
  for (var i = -1; i <= 1; i++) {
    for (var j = -1; j <= 1; j++) {
      if (canMoveTo(this.row + i, this.col + j) && (this.color !== currTurn || !this.willBeInCheck(this.row + i, this.col + j))) {
        targets.push({
          x: this.row + i,
          y: this.col + j
        });
      }
    }
  }
  return targets;
};
King.prototype.willBeInCheck = function (x, y){
  var possibleEnemyMoves = getAllEnemiesTars();
  for (var i = 0; i < possibleEnemyMoves.length; i++) {
    if (possibleEnemyMoves[i].x === x && possibleEnemyMoves[i].y === y) {
      return true;
    }
  }
  return false;
};
function unicodeify (str){
  return String.fromCharCode(parseInt(str, 16));
}

function canMoveTo(x, y){
  var cell = getCell(x, y);
  return (isOnBoard(x, y) && (isEmpty(cell) || isEnemy(x, y)));
}
function isOnBoard(x, y){
  return x >= 0 && x <= 7 && y >= 0 && y <= 7;
}
function isEmpty(cell){
  return !cell;
}
function isEnemy(x, y) {
  var cell = getCell(x, y);
  if (isEmpty(cell) || currTurn === cell.color) {
    return false;
  }else {
    return true;
  }
}
function getCell(x, y){
  return isOnBoard(x, y) ? board[x][y] : null;
}
function deletePiece(x, y) {
  board[x][y] = null;
}
function allEnemies(){
  var enemies = [];
  for (var i = 0; i < 8; i++) {
    for (var j = 0; j < 8; j++) {
      if (!isEmpty(board[i][j]) && board[i][j].color !== currTurn) {
        enemies.push(board[i][j]);
      }
    }
  }
  return enemies;
}
function getAllEnemiesTars(){
  var possibleEnemyMoves = [];
  var enemies = allEnemies();
  for (var k = 0; k < enemies.length; k++) {
    var enemy = enemies[k];
    possibleEnemyMoves = possibleEnemyMoves.concat(enemy.getTargets(true));
  }
  return possibleEnemyMoves;
}
var board = [
  [new Rook(0,0,'black'), new Knight(0,1,'black'), new Bishop(0,2,'black'), new Queen(0,3,'black'), new King(0,4,'black'), new Bishop(0,5,'black'), new Knight(0,6,'black'), new Rook(0,7,'black')],
  [new Pawn(1,0,'black'), new Pawn(1,1,'black'), new Pawn(1,2,'black'), new Pawn(1,3,'black'), new Pawn(1,4,'black'), new Pawn(1,5,'black'), new Pawn(1,6,'black'), new Pawn(1,7,'black')],
  new Array(8),new Array(8),new Array(8),new Array(8),
  [new Pawn(6,0,'white'), new Pawn(6,1,'white'), new Pawn(6,2,'white'), new Pawn(6,3,'white'), new Pawn(6,4,'white'), new Pawn(6,5,'white'), new Pawn(6,6,'white'), new Pawn(6,7,'white')],
  [new Rook(7,0,'white'), new Knight(7,1,'white'), new Bishop(7,2,'white'), new Queen(7,3,'white'), new King(7,4,'white'), new Bishop(7,5,'white'), new Knight(7,6,'white'), new Rook(7,7,'white')]];
