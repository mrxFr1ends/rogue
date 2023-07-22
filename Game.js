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

function makeGameObject(objectType, x, y) {
    switch (objectType) {
        case Wall: return new Wall(x, y);
        case Floor: return new Floor(x, y);
        case Sword: return new Sword(x, y, SETTINGS.items.sword.increasesDamage);
        case HealthPotion: return new HealthPotion(x, y, SETTINGS.items.healthPotion.increasesHealth);
        case Enemy: return new Enemy(x, y, SETTINGS.enemy.health, SETTINGS.enemy.damage);
        case Person: return new Person(x, y, SETTINGS.person.health, SETTINGS.person.damage);
        default:
            throw new Error("Invalid objectType: " + objectType.toString());
    }
}

function Game() {
    this.tileMap = null;
    this.person = {};
    this.items = [];
    this.enemies = [];
    this.inventory = [];
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
    Object.assign(this, MapGenerator.generate());
    this.render();
}

Game.prototype.tryMoveEntity = function(entity, direction) {
    var x = entity.x + direction.dx;
    var y = entity.y + direction.dy;

    if (x < 0 || x >= SETTINGS.board.width || y < 0 || y >= SETTINGS.board.height)
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
Game.prototype.tryPickUpItem = function() {
    for (var i = 0; i < this.items.length; i++)
        if (this.items[i].x === this.person.x && this.items[i].y === this.person.y) {
            // this.items[i].applyEffect(this.person);
            this.items[i].tryTake(this.person);
            if (this.items[i].isTaken)
                this.inventory.push(this.items[i]);
            console.log(this.inventory)
            this.items.splice(i, 1);
            console.log(this.inventory)
            break;
        }
}

Game.prototype.moveEnemies = function() {
    function getUnblockCells(x, y) {
        var cells = [];
        for (var direction of Object.values(EIGHT_DIRECTION)) {
            var row = y + direction.dy;
            var col = x + direction.dx;
            if (row >= 0 && row < SETTINGS.board.height 
                && col >= 0 && col < SETTINGS.board.width
                && this.tileMap[row][col].is_block === false)
                cells.push(this.tileMap[row][col]); 
        }
        return cells;
    }

    for (var enemy of this.enemies)
        if (this.tryAttackPerson(enemy) === false) {
            var unblockCells = getUnblockCells.call(this, enemy.x, enemy.y);
            if (unblockCells.length > 0) {
                var randomCell = unblockCells[randInt(0, unblockCells.length - 1)];
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

Game.prototype.clickItemHandler = function(itemIndex) {
    return function() {
        this.inventory[itemIndex].applyEffect(this.person); 
        this.inventory.splice(itemIndex, 1);
        console.log(itemIndex);
        this.render();
    }.bind(this);
}

Game.prototype.boardRender = function() {
    var board = document.querySelector('.field');
    clearNode(board);
    for (var i = 0; i < this.tileMap.length; i++) {
        for (var j = 0; j < this.tileMap[i].length; j++)
            board.appendChild(this.tileMap[i][j].getDOMElement(SETTINGS.board.cell.size));
    }
    for (var item of this.items) board.appendChild(item.getDOMElement(SETTINGS.board.cell.size));
    for (var enemy of this.enemies) board.appendChild(enemy.getDOMElement(SETTINGS.board.cell.size));
    board.appendChild(this.person.getDOMElement(SETTINGS.board.cell.size));
}

Game.prototype.inventoryRender = function() {
    var inv = document.querySelector('.inventory');
    clearNode(inv);
    for (var i = 0; i < this.inventory.length; i++) {
        var divItem = this.inventory[i].getDOMElement(SETTINGS.inventory.cell.size)
        divItem.onclick = this.clickItemHandler(i);
        inv.appendChild(divItem);
    }
}

Game.prototype.render = function() {
    this.boardRender();
    this.inventoryRender();
}