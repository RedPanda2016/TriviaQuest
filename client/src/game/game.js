//this is the adventure game rendered
// create the game instance
var game = new RL.Game();

var mapData = [
    "#########################################################################################################",
    "#.........#..........#......................................................e.........................#Z#",
    "#u...e..:.#....##....#..........................................................................e.....+.#",
    "#k........+....##....#........................e....................e.........................e........#b#",
    "#p........#..........+......................................................e...................e.....#.#",
    "#n#..#..#.#..........#......................e....e....................................................#b#",
    "#.........#...####+#+#................................e...........e.........e.........................#.#",
    "#.........#...#......#..........................................................................e.....#b#",
    "#.........#...#......#.................e...........e...............e...........e......................#.#",
    "#.........#...#......#................................................................................+.#",
    "######################################################################+################################.#",
    "#...#...............#...............#...........#...................#...#.............................#.#",
    "#...#...#########...#...#####...#########...#####...#####...#####...#...#.............................#.#",
    "#...............#.......#...#...........#...........#...#...#.......#...#.............................#.#",
    "#########...#...#########...#########...#####...#...#...#...#########...#.............................#.#",
    "#.......#...#...............#...........#...#...#...#...#...........#...#.............................#.#",
    "#...#...#############...#...#...#########...#####...#...#########...#...#.............................#.#",
    "#...#...............#...#...#.......#...........#...........#.......#...#.............................#.#",
    "#...#############...#####...#####...#...#####...#########...#...#####...#.............................#.#",
    "#...........#.......#...#.......#...#.......#...........#...#...........#.............................#.#",
    "#...#####...#####...#...#####...#...#########...#...#...#...#############.............................#.#",
    "#.......#.......#...#...#.......#.......#.......#...#...#.......#.......#.............................#.#",
    "#############...#...#...#...#########...#...#####...#...#####...#####...#.............................#.#",
    "#...........#...#...........#.......#...#.......#...#.......#...........#.............................#.#",
    "#...#####...#...#########...#####...#...#####...#####...#############...#.............................#.#",
    "#...#.......#...........#...........#.......#...#...#...............#...+.............................#.#",
    "#...#...#########...#...#####...#########...#...#...#############...#...#.............................#.#",
    "#...#...........#...#...#...#...#...........#...............#...#.......#.............................#.#",
    "#...#########...#...#...#...#####...#########...#########...#...#########.............................#.#",
    "#...#.......#...#...#...........#...........#...#.......#...............#.............................#.#",
    "#...#...#####...#####...#####...#########...#####...#...#########...#...#.............................#.#",
    "#.e.#...................#...........#...............#...............#...#.............................#.#",
    "##########################################+##########################################################+#.#",
    "#......................#.................#......#.................#.........................#.........#.#",
    "#..##################..#.#########.#.#.###.#....#.###...###########.#.######.##############.#.#######.#.#",
    "#..#................#..#.....#...#.#.#.....########.###.............#........#............#.#.#.......#.#",
    "#..#..############..#..#####.#.#.#.#.#####..........#.#.##.#################.######.#####.#.#.#.#######.#",
    "#..#..#.............#..#...#.#.#.#.#.....#.######.#.#...#..#...#.#........................#..........##.#",
    "#..#..#...###########..#.#.#.#.#.###.##.##..........#.#.#.##.#.#.##############.###########.########.##.#",
    "#.....#................#.#...#.#...#.##.#..#####.##.#.#...#..#............................#...........#.#",
    "######################...#.#.#.#.#.#.#..#.........#.#...#...#######################.############.####.#.#",
    "#..#...................#...#.#.#.#...#.########.#.#.#######.#.....................#.#............#....#.#",
    "#..#.#################...##.##.###.#.#.#....+.#.#.#.........#.#####################.#.#.#######..####.#.#",
    "#..#.#.#...#...#...#...#.##.#.####.#.#.#....#.#.#.#.###.#####.......................#.#.#.....#..#....#.#",
    "#..#.#...#...#...#...#....#.#.####.#.#.######.#.#.#.#.#.......#####################.#.#.#.#.#.#..#.####.#",
    "#..#.#.#...#...#...#...####.#......#.#...+..#.#.....#.#.#######...................#.#.#.#.#.#.#..#....#.#",
    "#..#.#.#################.#..#####..#####.####.#####.#.#.........###################.#.#.#.#.#.#..#.####.#",
    "#..#.....................#......#........#..............#########...................#.#.#.#.#.#..#....#.#",
    "#..#.##########################.########.#.########.######........#################.#.#.#.#.#.#..##.###.#",
    "#..#.#..................................................#..######.#.................#.#.#.#.#.#...#...#.#",
    "#..#.####################.###############################.##......##############.##########.#####.###.#.#",
    "#..#....................#.................................#..####..............#..........#.....#.....#.#",
    "#..###################..#.################.############################.#############.#########.#####.#.#",
    "#.......................#................#............................................................#.#",
    "#+#####################################################################################################.#",
    "#.......................................................................................................#",
    "#########################################################################################################"
];

// Tile types
var mapCharToType = {
    '#': 'wall',
    '.': 'grass',
    '+': 'door',
    '\'': 'door-open',
};

var entityCharToType = {
    'e': 'slime',
    'Z': 'owl',
    'b': 'bird',
    'n': 'ninja',
    'k': 'knight',
    'p': 'pirate',
    'u': 'pikachu'
};

var itemCharToType = {
  ':': 'potion'
};

var keyBindings = {
    up: ['UP_ARROW', 'K', 'W'],
    down: ['DOWN_ARROW', 'J', 'S'],
    left: ['LEFT_ARROW', 'H', 'A'],
    right: ['RIGHT_ARROW', 'L', 'D'],
};

enemyGenerator(mapData, 28);
itemGenerator(mapData, 5);

game.map.loadTilesFromArrayString(mapData, mapCharToType, 'grass');
game.itemManager.loadFromArrayString(mapData, itemCharToType);

game.entityManager.loadFromArrayString(mapData, entityCharToType);

// generate and assign a map object (replaces empty default)
game.setMapSize(game.map.width, game.map.height);

// add input keybindings
game.input.addBindings(keyBindings);

// set player starting position
game.player.x = 3;
game.player.y = 3;

// make the view a little smaller (10x10 characters)
game.renderer.resize(10, 10);

// get existing DOM elements
var mapContainerEl = document.getElementById('roguelike-map-container');
var consoleContainerEl = document.getElementById('roguelike-console-container');

// append elements created by the game to the DOM
mapContainerEl.appendChild(game.renderer.canvas);
consoleContainerEl.appendChild(game.console.el);

game.renderer.layers = [
    new RL.RendererLayer(game, 'map',       {draw: false,   mergeWithPrevLayer: false}),
    new RL.RendererLayer(game, 'item',      {draw: false,   mergeWithPrevLayer: true}),
    new RL.RendererLayer(game, 'entity',    {draw: false,   mergeWithPrevLayer: true}),
    new RL.RendererLayer(game, 'lighting',  {draw: true,    mergeWithPrevLayer: false}),
    new RL.RendererLayer(game, 'fov',       {draw: true,    mergeWithPrevLayer: false})
];

//ADDED CODE
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//create a randomized map for each level.
//105 characters for each mapData index and there are 57 elements
//grab random index from mapData loadFromArrayString

//find random character in randomMapDataIndex

//might need to create arguments for room, array indeces, string characters
// function enemyGenerator() {
//     //first room in mapData to populate with enemies
//     var room11 = 0;
//     //enemies to add
//     var arr = ['e', 'Z', 'b'];
//     //loop through number of enemies to add
//     while(room11 <= 2) {
//         //array indeces to add enemies
//         var line = Math.floor((Math.random() * 5) + 1);
//         //the string characters from array index where enemies will populate
//         var string = mapData[line].substr(11, 20);
//         //point within the position on the string
//         var position = Math.floor(Math.random() * line.length);
//         //get enemy
//         var enemy = Math.floor(Math.random() * arr.length);
//         //populate grass spot with enemy
//         if(line[position] === ".") {
//             string = string.substring(0, position) + entityCharToType[enemy] + string.substring(position + 1);
//             mapData[line] = mapData[line].substring(0, 11) + string + mapData[line].substring(21);
//             room11++;
//         }
//     }
// }

function enemyGenerator(map, enemyNumber) {
  var arr = ['e', 'Z', 'b'];
  var xLength = map[0].length - 2;
  var yLength = map.length - 2;

  var enemyReplacer = function(mapLine, enemy, randX) {
    mapLine = mapLine.substring(0, randX) + enemy + mapLine.substring(randX + 1);
    return mapLine;
  }

  while(enemyNumber > 0) {
    var randX = Math.floor((Math.random() * xLength) + 1);
    var randY = Math.floor((Math.random() * yLength) + 1);

    if(map[randY][randX] === '.') {
      var randEnemy = arr[Math.floor(Math.random() * 3)];
      map[randY] = enemyReplacer(map[randY], randEnemy, randX);
      enemyNumber--;
    }
  }
}

function itemGenerator(map, itemNumber) {
  var xLength = map[0].length - 2;
  var yLength = map.length - 2;

  var itemReplacer = function(mapLine, item, randX) {
    mapLine = mapLine.substring(0, randX) + item + mapLine.substring(randX + 1);
    return mapLine;
  }

  while(itemNumber > 0) {
    var randX = Math.floor((Math.random() * xLength) + 1);
    var randY = Math.floor((Math.random() * yLength) + 1);

    if(map[randY][randX] === '.') {
      var item = ':';
      map[randY] = itemReplacer(map[randY], item, randX);
      itemNumber--;
    }
  }
}
// ROT.Map.IceyMaze = function(width, height, regularity) {
//     ROT.Map.call(this, width, height);
//     this._regularity = regularity || 0;
// }
// ROT.Map.IceyMaze.extend(ROT.Map);
//
// ROT.Map.IceyMaze.prototype.create = function(callback) {
//     var width = this._width;
//     var height = this._height;
//
//     var map = this._fillMap(1);
//
//     width -= (width % 2 ? 1 : 2);
//     height -= (height % 2 ? 1 : 2);
//
//     var cx = 0;
//     var cy = 0;
//     var nx = 0;
//     var ny = 0;
//
//     var done = 0;
//     var blocked = false;
//     var dirs = [
//         [0, 0],
//         [0, 0],
//         [0, 0],
//         [0, 0]
//     ];
//     do {
//         cx = 1 + 2*Math.floor(ROT.RNG.getUniform()*(width-1) / 2);
//         cy = 1 + 2*Math.floor(ROT.RNG.getUniform()*(height-1) / 2);
//
//         if (!done) { map[cx][cy] = 0; }
//
//         if (!map[cx][cy]) {
//             this._randomize(dirs);
//             do {
//                 if (Math.floor(ROT.RNG.getUniform()*(this._regularity+1)) == 0) { this._randomize(dirs); }
//                 blocked = true;
//                 for (var i=0;i<4;i++) {
//                     nx = cx + dirs[i][0]*2;
//                     ny = cy + dirs[i][1]*2;
//                     if (this._isFree(map, nx, ny, width, height)) {
//                         map[nx][ny] = 0;
//                         map[cx + dirs[i][0]][cy + dirs[i][1]] = 0;
//
//                         cx = nx;
//                         cy = ny;
//                         blocked = false;
//                         done++;
//                         break;
//                     }
//                 }
//             } while (!blocked);
//         }
//     } while (done+1 < width*height/4);
//
//     for (var i=0;i<this._width;i++) {
//         for (var j=0;j<this._height;j++) {
//             callback(i, j, map[i][j]);
//         }
//     }
//     this._map = null;
//     return this;
// }
//
// ROT.Map.IceyMaze.prototype._randomize = function(dirs) {
//     for (var i=0;i<4;i++) {
//         dirs[i][0] = 0;
//         dirs[i][1] = 0;
//     }
//
//     switch (Math.floor(ROT.RNG.getUniform()*4)) {
//         case 0:
//             dirs[0][0] = -1; dirs[1][0] = 1;
//             dirs[2][1] = -1; dirs[3][1] = 1;
//         break;
//         case 1:
//             dirs[3][0] = -1; dirs[2][0] = 1;
//             dirs[1][1] = -1; dirs[0][1] = 1;
//         break;
//         case 2:
//             dirs[2][0] = -1; dirs[3][0] = 1;
//             dirs[0][1] = -1; dirs[1][1] = 1;
//         break;
//         case 3:
//             dirs[1][0] = -1; dirs[0][0] = 1;
//             dirs[3][1] = -1; dirs[2][1] = 1;
//         break;
//     }
// }
