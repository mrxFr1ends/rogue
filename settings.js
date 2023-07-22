var SETTINGS = {
    board: { 
        width: 40, 
        height: 24,
        cell: { size: 28 }
    }, 
    person: {
        health: 100,
        damage: 10,
        count: 1,
    },
    enemy: {
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
    },
    rooms: {
        count: { max: 10, min: 5 },
        size: { max: 8, min: 3 },
        tries: 100,
    },
    paths: { 
        count: { max: 5, min: 3}
    },
    inventory: {
        cell: { size: 32 },
        items: { count: { max: 25 } }
    }
};