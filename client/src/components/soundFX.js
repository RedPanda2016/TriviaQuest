var shuffleSounds = function(soundArray) {
  var i = 0,
    j = 0,
    temp = 0;

  for (i = soundArray.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i+1));
    temp = soundArray[i];
    soundArray[i] = soundArray[j];
    soundArray[j] = temp;
  };

  return soundArray;
};

var soundFXOnOff = true;

var randomIndex = function(upToNum){
  return Math.floor(Math.random() * upToNum)
};

var test = function(){console.log('test es6');};

var walkingFX = new Howl({
  src: '../../sounds/FX/footsteps.mp3',
  volume: 0.1,
  sprite: {
    walking1: [0, 450],
    walking2: [500, 450],
    walking3: [1000, 450],
    walking4: [1500, 450],
    walking5: [2000, 450],
    walking6: [2500, 450],
    walking7: [3000, 450],
    walking8: [3500, 450],
    walking9: [4000, 450]
  }
});

var walkThisWay = function(){
  var walkNum = randomIndex(9);
  walkingFX.play("walking" + walkNum);
};

var duncanFX = new Howl({
  src: '',
  volume: 0.1,
  sprite: {
    death: '',
    victory: '',
    defeat: ''
  }
})

var pikachuFX = new Howl({
  src: '../../sounds/fx/pikachu.mp3',
  volume: 0.1,
  sprite: {
    swapCostume: [0, 1500],
    death: '',
    victory: '',
    defeat: ''
  }
});

var pirateFX = new Howl({
  src: '',
  volume: 0.1,
  sprite: {
    swapCostume: '',
    death: '',
    victory: '',
    defeat: ''
  }
});

var ninjaFX = new Howl({
  src: '',
  volume: 0.1,
  sprite: {
    swapCostume: '',
    death: '',
    victory: '',
    defeat: ''
  }
})

var knightFX = new Howl({
  src: '',
  volume: 0.1,
  sprite: {
    swapCostume: '',
    death: '',
    victory: '',
    defeat: ''
  }
});

var slimeFX = new Howl({
  src: '../../sounds/fx/slime.mp3',
  volume: 0.1,
  sprite: {
    attack: [0, 2000],
    defeat: '',
    victory: ''
  }
});

var snakeFX = new Howl({
  src: '../../sounds/fx/snakeHiss.mp3',
  volume: 0.1,
  sprite: {
    attack: [0, 1500],
    defeat: '',
    victory: ''
  }
});

var owlFX = new Howl({
  src: '',
  volume: 0.1,
  sprite: {
    attack: '',
    defeat: '',
    victory: ''
  }
});

var doorOpen = new Howl({
  src: '../../sounds/FX/doorOpen.mp3',
  volume: 0.1,
  sprite: {
    doorOpen: [0, 2000],
  }
});

var heart = new Howl({
  src: '../../sounds/FX/powerUp.mp3',
  volume: 0.1,
  sprite: {
    heart: [0, 500],
  }
});

// var wall = new Howl({
//   src: '../../sounds/FX/doorOpen.mp3',
//   volume: 0.1,
//   sprite: {
//     wall: [0, 2000],
//   }
// })

// var fx = new Howl({
//   src: '',
//   volume: 0.1,
//   sprite: {
//     swintchingMap: '',
//     gameStart: '',
//     gameOver: ''
//   }
// })