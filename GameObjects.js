"use strict";

var SPRITE = {
    "Floor": "tile",
    "Wall": "tileW",
    "Enemy": "tileE",
    "Person": "tileP",
    "HealthPotion": "tileHP",
    "Sword": "tileSW"
};

function GameObject(x, y) {
    this.x = x;
    this.y = y;
    this.sprite = null;
    this.is_block = null;
}

GameObject.prototype.getDOMElement = function(size) {
    var div = document.createElement('div');
    div.style.top = (this.y * size) + "px";
    div.style.left = (this.x * size) + "px";
    div.style.width = size + "px";
    div.style.height = size + "px";
    div.classList.add('tile', this.sprite);
    return div;
}

function Tile(x, y) {
    GameObject.call(this, x, y);
}
Tile.prototype = Object.create(GameObject.prototype);
Tile.prototype.constructor = Tile;

function Wall(x, y) {
    Tile.call(this, x, y);
    this.sprite = SPRITE.Wall;
    this.is_block = true;
}
Wall.prototype = Object.create(Tile.prototype);
Wall.prototype.constructor = Wall;

function Floor(x, y) {
    Tile.call(this, x, y);
    this.sprite = SPRITE.Floor;
    this.is_block = false;
}
Floor.prototype = Object.create(Tile.prototype);
Floor.prototype.constructor = Floor;

function Item(x, y) {
    GameObject.call(this, x, y);
    this.isBlock = false;
    this.isAutoEffect = null;
    this.isTaken = false;
}
Item.prototype = Object.create(GameObject.prototype);
Item.prototype.constructor = Item;
Item.prototype.applyEffect = function(gameObject) {
    throw new Error("Abstract method applyEffect called");
}
Item.prototype.tryTake = function(gameObject) {
    console.log(this.isAutoEffect)
    if (this.isAutoEffect)
        this.applyEffect(gameObject);
    else this.isTaken = true;
}
Item.prototype.getDOMElement = function(size) {
    if (this.isTaken === false)
        return GameObject.prototype.getDOMElement.call(this, size);
    var div = document.createElement('div');
    div.style.width = size + "px";
    div.style.height = size + "px";
    div.classList.add('item', this.sprite);
    console.log(this.isAutoEffect);
    return div;
}

function Sword(x, y, damage) {
    Item.call(this, x, y);
    this.isAutoEffect = true;
    this.sprite = SPRITE.Sword;
    this.damage = damage;
}
Sword.prototype = Object.create(Item.prototype);
Sword.prototype.constructor = Sword;
Sword.prototype.applyEffect = function(person) {
    person.affectDamage(this.damage);
}

function HealthPotion(x, y, health) {
    Item.call(this, x, y);
    this.isAutoEffect = false;
    this.sprite = SPRITE.HealthPotion;
    this.health = health;
}
HealthPotion.prototype = Object.create(Item.prototype);
HealthPotion.prototype.constructor = HealthPotion;
HealthPotion.prototype.applyEffect = function(person) {
    person.affectHealth(this.health);
    console.log(123444444);
}

function Entity(x, y, maxHP, damage) {
    GameObject.call(this, x, y);
    this.is_block = true;
    this.health = maxHP;
    this.maxHealth = maxHP;
    this.damage = damage;
}
Entity.prototype = Object.create(GameObject.prototype);
Entity.prototype.constructor = Entity;

Entity.prototype.affectHealth = function(health) {
    this.health = Math.max(0, Math.min(this.health + health, this.maxHealth))
}

Entity.prototype.affectDamage = function(damage) {
    this.damage += damage;
}

Entity.prototype.getDOMElement = function(size) {
    var div = GameObject.prototype.getDOMElement.call(this, size);
    var healthDiv = document.createElement('div');
    healthDiv.classList.add('health');
    healthDiv.style.width = ((this.health / this.maxHealth) * 100) + '%';
    div.appendChild(healthDiv);
    return div;
}

Entity.prototype.moveTo = function(x, y) {
    this.x = x;
    this.y = y;
}

Entity.prototype.applyAttack = function(entity) {
    entity.affectHealth(-this.damage);
}

Entity.prototype.isDead = function() {
    return this.health === 0;
}

function Person(x, y, maxHP, damage) {
    Entity.call(this, x, y, maxHP, damage);
    this.sprite = SPRITE.Person;
}
Person.prototype = Object.create(Entity.prototype);
Person.prototype.constructor = Person;

function Enemy(x, y, maxHP, damage) {
    Entity.call(this, x, y, maxHP, damage);
    this.sprite = SPRITE.Enemy;
}
Enemy.prototype = Object.create(Entity.prototype);
Enemy.prototype.constructor = Enemy;