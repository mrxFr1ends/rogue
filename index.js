var BOARD_COLS = 40;
var BOARD_ROWS = 24;
var CELL_SIZE = 25;

var PERSON_HEALTH = 100;
var PERSON_DAMAGE = 10;

var ENEMY_HEALTH = 80;
var ENEMY_DAMAGE = 5;
var ENEMY_COUNT = 10;

var SWORD_COUNT = 2;
var HEALTH_POITON_COUNT = 10;
var SWORD_DAMAGE = 10;
var HEALTH_POITON_HEAL = 10;

var GAME_SETTINGS = {
    board: { width: 40, height: 24 },
    cell: { width: 25, height: 25 },
    person: {
        health: 100,
        damage: 10,
        count: 1,
    },
    enemie: {
        health: 80,
        damage: 5,
        count: 10,
    },
    items: {
        sword: {
            count: 2,
            increasesDamage: 10,
        },
        healthPotion: {
            count: 10,
            increasesHealth: 10,
        }
    }
}

var FOUR_DIRECTION = {
    Left: {dx: -1, dy: 0},
    Right: {dx: 1, dy: 0},
    Up: {dx: 0, dy: -1},
    Down: {dx: 0, dy: 1}
};

var EIGHT_DIRECTION = {
    Left: {dx: -1, dy: 0},
    Right: {dx: 1, dy: 0},
    Up: {dx: 0, dy: -1},
    Down: {dx: 0, dy: 1},
    LeftUp: {dx: -1, dy: -1},
    RightUp: {dx: 1, dy: -1},
    LeftDown: {dx: -1, dy: 0},
    RightDown: {dx: 1, dy: 0}
};

var MOVE_KEYS = {
    'KeyW': FOUR_DIRECTION.Up,
    'KeyA': FOUR_DIRECTION.Left,
    'KeyS': FOUR_DIRECTION.Down,
    'KeyD': FOUR_DIRECTION.Right
};

function clearNode(parent) {
    while (parent.firstChild)
        parent.removeChild(parent.firstChild)
}

function randInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randBool() {
    return randInt(0, 1) === 0
}

function Rect(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
}

function generateRooms() {
    var rooms = [];
    var MAX_ROOMS_COUNT = 10;
    var MIN_ROOMS_COUNT = 5;
    var MAX_ROOMS_SIZE = 8;
    var MIN_ROOMS_SIZE = 3;
    var MAX_TRIES_PER_ROOM = 100;

    var isValidRoom = function(room) {
        for (var i = 0; i < rooms.length; i++) {
            if(rooms[i].x > room.x+room.width || rooms[i].x+rooms[i].width < room.x) continue;
            if(rooms[i].y > room.y+room.height || rooms[i].y+rooms[i].height < room.y) continue;
            return false;
        }
        return true;
    }

    var tries = MAX_TRIES_PER_ROOM;
    var iterations = 0;
    while (rooms.length < randInt(MIN_ROOMS_COUNT, MAX_ROOMS_COUNT) && tries-- > 0) {
        iterations++;
        var height = MAX_ROOMS_SIZE; // randInt(MIN_ROOMS_SIZE, MAX_ROOMS_SIZE);
        var width = MAX_ROOMS_SIZE; // randInt(MIN_ROOMS_SIZE, MAX_ROOMS_SIZE);
        var room = { 
            x: randInt(0, BOARD_COLS - width),
            y: randInt(0, BOARD_ROWS - height),
        };
        var isValid = false;
        for (var w = width; w >= MIN_ROOMS_SIZE && !isValid; w--) {
            for (var h = height; h >= MIN_ROOMS_SIZE && !isValid; h--) {
                room.width = w;
                room.height = h;
                isValid = isValidRoom(room);
            }
        }
        if (isValid) {
            rooms.push(room);
            tries = MAX_TRIES_PER_ROOM;
        }
    }
    console.log("Generated map with", rooms.length, " rooms by", iterations, " iterations");
    return rooms;
}

function generatePaths(rooms) {
    var MAX_COUNT_PATHS = 5;
    var MIN_COUNT_PATHS = 3;

    function getPath(room, isHorizontal) {
        if (isHorizontal)
            return new Rect(0, randInt(room.y, room.y + room.height - 1), BOARD_COLS, 1);
        return new Rect(randInt(room.x, room.x + room.width - 1), 0, 1, BOARD_ROWS);
    }

    var paths = [];
    for (var room of rooms) {
        paths.push(getPath(room, true), getPath(room, false));
        var countPaths = randInt(MIN_COUNT_PATHS, MAX_COUNT_PATHS) - 2;
        paths.concat(Array(countPaths).fill().map(function () { return getPath(room, randBool())}));
    }
    
    return paths;
}

function fillPart(map, rect, objectType) {
    console.log(map, rect, objectType);
    for (var y = rect.y; y < rect.y + rect.height; y++)
        for (var x = rect.x; x < rect.x + rect.width; x++) {
            map[y][x] = new objectType(x, y);
        }
}

function generateMap() {
    var tileMap = Array(BOARD_ROWS).fill().map(function () { return Array(BOARD_COLS).fill() });
    fillPart(tileMap, {x: 0, y: 0, width: BOARD_COLS, height: BOARD_ROWS}, Wall);
    var rooms = generateRooms();
    for (var room of rooms) fillPart(tileMap, room, Floor);
    for (var path of generatePaths(rooms)) fillPart(tileMap, path, Floor);
    return tileMap;
}

function Game() {
    this.tileMap = null;
    this.person = null;
    this.items = [];
    this.enemies = [];
}

Game.prototype.init = function() {
    document.addEventListener("keydown", this.keyboardHandler.bind(this));
    this.restart();
};

Game.prototype.gameOver = function() {
    alert("Вы проиграли");
    this.restart();
}

Game.prototype.restart = function() {
    this.tileMap = generateMap();
    this.placeObjects();
    this.render();
}

// function makeGameObject(objectType, x, y) {
//     switch (objectType) {
//         case Wall: return new Wall(x, y);
//         case Tile: return new Tile(x, y);
//         case Sword: return new Sword(x, y, GAME_SETTINGS.items.sword.increasesDamage);
//         case HealthPotion: return new HealthPotion(x, y, GAME_SETTINGS.items.healthPotion.increasesHealth);
//         case Enemy: return new Enemy(x, y, GAME_SETTINGS.enemie.health, GAME_SETTINGS.enemie.damage);
//         case Person: return new Person(x, y, GAME_SETTINGS.person.health, GAME_SETTINGS.person.damage);
//         default:
//             throw new Error("Invalid objectType: " + objectType.toString());
//     }
// }

Game.prototype.placeObjects = function() {
    var floorCells = this.tileMap.flat().filter(function (tile) { return tile instanceof Floor; });
    console.log(floorCells);
    var rIndex = randInt(0, floorCells.length - 1);
    this.person = new Person(floorCells[rIndex].x, floorCells[rIndex].y, PERSON_HEALTH, PERSON_DAMAGE);
    floorCells.splice(rIndex, 1);

    this.enemies = Array(ENEMY_COUNT).fill().map(function(){
        var rIndex = randInt(0, floorCells.length - 1);
        var enemy = new Enemy(floorCells[rIndex].x, floorCells[rIndex].y, ENEMY_HEALTH, ENEMY_DAMAGE);
        floorCells.splice(rIndex, 1);
        return enemy;
    });

    this.items = Array(SWORD_COUNT).fill().map(function(){
        var rIndex = randInt(0, floorCells.length - 1);
        var sword = new Sword(floorCells[rIndex].x, floorCells[rIndex].y, SWORD_DAMAGE);
        floorCells.splice(rIndex, 1);
        return sword;
    });
    console.log(floorCells);
    this.items = this.items.concat(Array(HEALTH_POITON_COUNT).fill().map(function(){
        var rIndex = randInt(0, floorCells.length - 1);
        var healthPoition = new HealthPotion(floorCells[rIndex].x, floorCells[rIndex].y, HEALTH_POITON_HEAL);
        floorCells.splice(rIndex, 1);
        return healthPoition;
    }));
    console.log(this.items);
}

Game.prototype.tryMoveEntity = function(entity, direction) {
    var x = entity.x + direction.dx;
    var y = entity.y + direction.dy;

    if (x < 0 || x >= BOARD_COLS || y < 0 || y >= BOARD_ROWS)
        return;
    if (this.tileMap[y][x].is_block)
        return;
    for (var enemy of this.enemies)
        if (enemy.x === x && enemy.y === y)
            return;
    if (this.person.x === x && this.person.y === y)
        return;
    
    entity.moveTo(x, y);
}

Game.prototype.tryAttackEnemies = function() {
    var closestEnemies = this.enemies.filter(e => 
        Math.abs(e.x - this.person.x) <= 1 
        && Math.abs(e.y - this.person.y) <= 1 
        && e.isDead() === false
    );
    for (var enemy of closestEnemies)
        this.person.applyAttack(enemy);
    this.enemies = this.enemies.filter(function (e) { return e.isDead() === false });
}

Game.prototype.moveEnemies = function() {
    function getEmptyCells(x, y) {
        var cells = [];
        for (var direction of Object.values(EIGHT_DIRECTION)) {
            var row = y + direction.dy;
            var col = x + direction.dx;
            if (row >= 0 && row < BOARD_ROWS 
                && col >= 0 && col < BOARD_COLS
                && this.tileMap[row][col].is_block === false)
                cells.push(this.tileMap[row][col]); 
        }
        return cells;
    }

    for (var enemy of this.enemies)
        if (this.tryAttackPerson(enemy) === false) {
            var emptyCells = getEmptyCells.call(this, enemy.x, enemy.y);
            if (emptyCells.length > 0) {
                var randomCell = emptyCells[Math.floor(Math.random()*emptyCells.length)];
                enemy.moveTo(randomCell.x, randomCell.y);
            }
        }
}

Game.prototype.tryAttackPerson = function(enemy) {
    if (Math.abs(enemy.x - this.person.x) <= 1 && Math.abs(enemy.y - this.person.y) <= 1) {
        enemy.applyAttack(this.person);
        if (this.person.isDead())
            this.gameOver();
        return true;
    }
    return false;
}

Game.prototype.tryPickUpItem = function() {
    for (var i = 0; i < this.items.length; i++)
        if (this.items[i].x === this.person.x && this.items[i].y === this.person.y) {
            this.items[i].applyEffect(this.person);
            this.items.splice(i, 1);
            break;
        }
}

Game.prototype.keyboardHandler = function(event) {
    if (Object.keys(MOVE_KEYS).indexOf(event.code) === -1 && event.code !== 'Space')
        return;     
    event.preventDefault();
    event.stopPropagation();
    if (event.code === 'Space') 
        this.tryAttackEnemies();
    else {
        this.tryMoveEntity(this.person, MOVE_KEYS[event.code]);
        this.tryPickUpItem();
    }
    this.moveEnemies();
    this.render();
}

Game.prototype.render = function() {
    var board = document.querySelector('.field');
    clearNode(board);
    for (var i = 0; i < this.tileMap.length; i++) {
        for (var j = 0; j < this.tileMap[i].length; j++)
            board.appendChild(this.tileMap[i][j].getDOMElement(CELL_SIZE));
    }
    for (var item of this.items)
        board.appendChild(item.getDOMElement(CELL_SIZE));
    for (var enemy of this.enemies)
        board.appendChild(enemy.getDOMElement(CELL_SIZE));
    board.appendChild(this.person.getDOMElement(CELL_SIZE));
}