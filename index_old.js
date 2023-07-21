// var BOARD_COLS = 40;
// var BOARD_ROWS = 24;
// var CELL_SIZE = 25;

// var SPRITE = {
//     "Floor": "tile",
//     "Wall": "tileW",
//     "Enemy": "tileE",
//     "Person": "tileP",
//     "HealthPotion": "tileHP",
//     "Sword": "tileSW"
// }

// var DIRECTION = {
//     Left: {dx: -1, dy: 0},
//     Right: {dx: 1, dy: 0},
//     Up: {dx: 0, dy: -1},
//     Down: {dx: 0, dy: 1},
// };

// function Cell(x, y, sprite) {
//     this.x = x;
//     this.y = y;
//     this.sprite = sprite;
//     this.item = null;
//     this.entity = null;

//     this.getTile = function(size) {
//         var tile = document.createElement('div');
//         tile.style.top = (this.y * size) + "px";
//         tile.style.left = (this.x * size) + "px";
//         tile.style.width = size + "px";
//         tile.style.height = size + "px";
//         var sprite = this.entity ? this.entity : (this.item ? this.item : this.sprite);
//         tile.classList.add('tile', this.sprite, this.item, this.entity);
//         return tile;
//     }
// }

// function Map(rows, cols) {
//     this.rows = rows;
//     this.cols = cols;
//     this.map = [];
    
//     this.init = function() {
//         for (var i = 0; i < this.height; i++) {
//             this.map[i] = [];
//             for (var j = 0; j < this.width; j++)
//               this.map[i][j] = new Cell(j, i, SPRITE.Wall);
//         }
//         this.generateDungeon();
//     }

//     this.generateDungeon = function() {
//         for (var i = 0; i < 4; i++)
//             for (var j = 0; j < 6; j++) {
//                 // this.map[i][j].sprite = SPRITE.Floor;
//             }
//     }

//     this.placeEntity = function(x, y, entity) {
//         // this.map[y][x].entity = entity;
//     }

//     this.render = function(board) {
//         for (var i = 0; i < this.map.length; i++) {
//             for (var j = 0; j < this.map[i].length; j++) {
//                 board.appendChild(this.map[i][j].getTile(CELL_SIZE));
//             }
//         }
//     }
// }

// function Entity(x, y, sprite) {
//     this.x = x;
//     this.y = y;
//     this.sprite = sprite;
//     this.canMove = false;

//     this.move = function(direction) {
        
//     }
// }

// function Person() {
//     Entity.call(this, SPRITE.Person);
// }
// Person.prototype = Object.create(Entity.prototype);
// Person.prototype.constructor = Person;

// function Enemy() {
//     Entity.call(this, SPRITE.Enemy);
// }
// Enemy.prototype = Object.create(Entity.prototype);
// Enemy.prototype.constructor = Enemy;

// // function Item() {}
// // function Sword() {}
// // function Health() {}

// function clearNode(parent) {
//     while (parent.firstChild)
//         parent.removeChild(parent.firstChild)
// }

// function Game() {
//     this.map = null;
//     this.board = null;
//     this.person = null;
//     this.entities = [];

//     this.init = function() {
//         this.initMap();
//         this.board = document.querySelector('.field');
//         this.person = new Person();
//         this.map.placeEntity(2, 3, this.person);
//         document.addEventListener("keydown", this.keyboardHandler.bind(this));
//     };

//     this.initMap = function() {
//         this.map = new Map(BOARD_ROWS, BOARD_COLS);
//         this.map.init();
//     }

//     this.placeEntities = function() {

//     }

//     this.keyboardHandler = function(event) {
//         console.log(event.code);
//         switch (event.code) {
//             case 'KeyW':
//                 console.log(event.key);
//                 this.person.y -= 1;
//                 this.render();
//                 break;
//             case 'KeyA':
//                 console.log(event.key);
//                 this.person.x -= 1;
//                 this.render();
//                 break;
//             case 'KeyS':
//                 console.log(event.key);
//                 this.person.y += 1;
//                 this.render();
//                 break;
//             case 'KeyD':
//                 console.log(event.key);
//                 this.person.x += 1;
//                 this.render();
//                 break;
//             case 'Space':
//                 event.preventDefault();
//                 event.stopPropagation();
//                 console.log(event.key);
//                 this.render();
//                 break;
//         }
//     }

//     this.render = function() {
//         clearNode(this.board);
//         this.map.render(this.board);
//     }

//     this.update = function() {
//         this.render();
//     }

//     // this.run = function() {
//     //     setInterval(this.update.bind(this), 500);
//     // }
// }

