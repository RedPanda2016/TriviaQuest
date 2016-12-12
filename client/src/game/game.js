// create the game instance
var game = new RL.Game();

var mapData = [
    "######################",
    "#.........#..........#",
    "#....e....#....##....#",
    "#.........+....##....#",
    "#.........#..........#",
    "#.#..#..#.#..........#",
    "#.........#...####+#+#",
    "#....e....#...#......#",
    "#.........#...#...e..#",
    "#.........#...#......#",
    "######################"
];

// Tile types
var mapCharToType = {
    '#': 'wall',
    '.': 'grass',
    '+': 'door',
    '\'': 'door-open'
};

// This is defined here and in the entity's char property.
// Why? . . .
var entityCharToType = {
    'e': 'slime'
};

var keyBindings = {
    up: ['UP_ARROW', 'K', 'W'],
    down: ['DOWN_ARROW', 'J', 'S'],
    left: ['LEFT_ARROW', 'H', 'A'],
    right: ['RIGHT_ARROW', 'L', 'D'],
};

game.map.loadTilesFromArrayString(mapData, mapCharToType, 'floor');
game.entityManager.loadFromArrayString(mapData, entityCharToType);

// generate and assign a map object (repaces empty default)
game.setMapSize(game.map.width, game.map.height);

// add input keybindings
game.input.addBindings(keyBindings);

// // create entities and add to game.entityManager
// var entZombie = new RL.Entity(game, 'slime');
// game.entityManager.add(2, 8, entZombie);

// // or just add by entity type
// game.entityManager.add(5, 9, 'slime');

// set player starting position
game.player.x = 3;
game.player.y = 3;

// make the view a little smaller
game.renderer.resize(10, 10);

// get existing DOM elements
var mapContainerEl = document.getElementById('example-map-container');
var consoleContainerEl = document.getElementById('example-console-container');

// append elements created by the game to the DOM
mapContainerEl.appendChild(game.renderer.canvas);
consoleContainerEl.appendChild(game.console.el);

game.renderer.layers = [
    new RL.RendererLayer(game, 'map',       {draw: false,   mergeWithPrevLayer: false}),
    new RL.RendererLayer(game, 'entity',    {draw: false,   mergeWithPrevLayer: true}),
    new RL.RendererLayer(game, 'lighting',  {draw: true,    mergeWithPrevLayer: false}),
    new RL.RendererLayer(game, 'fov',       {draw: true,    mergeWithPrevLayer: false})
];

// start the game


class GameAppConnector {
  constructor(app) {
    this.game = window.game;
    this.game.start();
    this.app = app;
    this.grid = undefined;
    this.challenges = [];
  }

  setGrid(grid) {
    this.grid = JSON.parse(JSON.stringify(this.app.state.grid));
    for (var key in this.grid) {
      this.grid[key].image = 'water';
    }
  }

  getChallenges(callback) {
    callback();
    // $.get('/api/challenges')
    //   .done(challenges => { // An array of challenge objects
    //     console.log('Complete');
    //     // // Shuffle the challenges
    //     // challenges = shuffle(challenges);
    //     // // Save the challenges to the state
    //     // this.challenges = challenges;
    //     // console.log('Hi there');
    //   })
    //   .fail(function(error) {
    //     console.error('Could not get challenges:', error);
    //   });
  }

  drawSquare(x, y, char) {
    var gridNumber = (y * 10) + (x + 1);
    var contents = null;

    if (char === '@') {
      contents = 'player';
    } else {
      contents = mapCharToType[char] || entityCharToType[char];
      if (!contents) { // If the character doesn't match up to anything known
        return;
      }
    }

    this.grid[gridNumber] = {
      id: gridNumber,
      image: contents
    };

  }

  updateGrid() {
    this.app.setState({
      grid: this.grid
    });
  }
};

/////////////
// HELPERS //
/////////////

// Shuffle an array's contents
// Used to shuffle the order of challenges received from the server
function shuffle(array) {
  for (var i = array.length - 1; i > 0; i--) { 
    var j = Math.floor(Math.random() * (i + 1)); 
    var temp = array[i]; 
    array[i] = array[j]; 
    array[j] = temp; 
  } 
  return array;
}

