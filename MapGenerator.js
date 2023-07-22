function MapGenerator() {}
MapGenerator.generateRooms = function() {
    var rooms = [];

    function isValidRoom(createdRoom) {
        for (var room of rooms)
            if (room.intersect(createdRoom))
                return false;
        return true;
    }

    function tryFindValidRoom() {
        var height = SETTINGS.rooms.size.max; // randInt(MIN_ROOMS_SIZE, MAX_ROOMS_SIZE);
        var width = SETTINGS.rooms.size.max; // randInt(MIN_ROOMS_SIZE, MAX_ROOMS_SIZE);
        var room = new Rect(
            randInt(0, SETTINGS.board.width - width), 
            randInt(0, SETTINGS.board.height - height)
        ); 
        for (var w = width; w >= SETTINGS.rooms.size.min; w--) {
            for (var h = height; h >= SETTINGS.rooms.size.min; h--) {
                room.width = w;
                room.height = h;
                if (isValidRoom(room))
                    return room;
            }
        }
        return null;
    }

    var roomsCount = randInt(SETTINGS.rooms.count.min, SETTINGS.rooms.count.max);
    var tries = SETTINGS.rooms.tries;
    var iterations = 0;
    while (rooms.length < roomsCount && tries-- > 0) {
        iterations++;
        var room = tryFindValidRoom();
        if (room !== null) {
            rooms.push(room);
            tries = SETTINGS.rooms.tries;
        }
    }
    console.log("Generated map with", rooms.length, " rooms by", iterations, " iterations");
    return rooms;
}
MapGenerator.generatePaths = function(rooms) {
    function getPath(room, isHorizontal) {
        if (isHorizontal)
            return new Rect(0, randInt(room.y, room.y + room.height - 1), SETTINGS.board.width, 1);
        return new Rect(randInt(room.x, room.x + room.width - 1), 0, 1, SETTINGS.board.height);
    }

    var paths = [];
    for (var room of rooms) {
        paths.push(getPath(room, true), getPath(room, false));
        var countPaths = randInt(SETTINGS.paths.count.min, SETTINGS.paths.count.max) - 2;
        paths.concat(Array(countPaths).fill().map(function () { 
            return getPath(room, randInt(0, 1) === 1);
        }));
    }
    return paths;
}
MapGenerator.placeObjects = function(map) {
    var floorCells = map.flat().filter(function (tile) { return tile instanceof Floor; });

    function createObject(objectType) {
        var index = randInt(0, floorCells.length - 1);
        var gameObject = makeGameObject(objectType, floorCells[index].x, floorCells[index].y);
        floorCells.splice(index, 1);
        return gameObject;
    }

    function createObjects(objectType, count) {
        return Array(count).fill(objectType).map(createObject);
    }

    var person = createObject(Person);
    var enemies = createObjects(Enemy, SETTINGS.enemy.count); 
    var items = [].concat(
        createObjects(Sword, SETTINGS.items.sword.count),
        createObjects(HealthPotion, SETTINGS.items.healthPotion.count)
    );
    return { person, enemies, items }
}
MapGenerator.generate = function() {
    var tileMap = Array(SETTINGS.board.height).fill().map(function () { 
        return Array(SETTINGS.board.width).fill() 
    });

    function fillPart(rect, objectType) {
        for (var y = rect.y; y < rect.y + rect.height; y++)
            for (var x = rect.x; x < rect.x + rect.width; x++)
                tileMap[y][x] = makeGameObject(objectType, x, y);
    }

    fillPart(new Rect(0, 0, SETTINGS.board.width, SETTINGS.board.height), Wall);

    var rooms = MapGenerator.generateRooms();
    for (var room of rooms) 
        fillPart(room, Floor);
    for (var path of MapGenerator.generatePaths(rooms)) 
        fillPart(path, Floor);

    var objects = MapGenerator.placeObjects(tileMap);
    return Object.assign({ tileMap }, objects);
}