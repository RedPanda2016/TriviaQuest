  class GameAppConnector {
  ////////////////
  // INITIALIZE //
  ////////////////

  constructor(app) {
    this.game = window.game;
    this.game.start();
    this.app = app;
    this.grid = undefined;
    this.challenges = {
      bird: [],
      owl: [],
      slime: []
    };
    this.challengeTypes = {
      // Git
      git: 'owl',
      // Git prep trivia
      gitPrep: 'bird',
      // Random trivia
      trivia: 'slime'
    };

    // Get challenges from the server and update this.challenges
    // Then, assign each slime entity a challenge
    this.getChallenges(this.assignChallenges.bind(this));
  }

  // Gets the grid from app state and replaces the image on every grid space with
  // water (currently rendered as blackness)
  setGrid(grid) {
    this.grid = JSON.parse(JSON.stringify(this.app.state.grid));
    for (var key in this.grid) {
      this.grid[key].image = 'water';
    }
  }

  // Gets challenges from the server and sets them on the object
  getChallenges(callback) {
    $.get('/api/challenges')
      .done(function(challenges) {
        // Save the challenges
        challenges.forEach(function (challenge) {
          var character = this.challengeTypes[challenge.type];
          if (this.challenges[character] == undefined) {
            this.challenges[character] = [];
          }
          this.challenges[character].push(challenge);
        }.bind(this));
        callback();
      }.bind(this))
      .fail(function(error) {
        console.log('Error');
      });
  }

  // Assigns challenges to enemies.
  assignChallenges() {
    var entities = this.game.entityManager.objects;
    var challenge;
    entities.forEach(function(entity) {
      if (entity.type === 'slime') { // Assign challenges to slimes
        // Pluck off a challenge
         challenge = this.challenges.slime.pop();
      } else if (entity.type === 'bird') {
         challenge = this.challenges.bird.pop();
      }
      // Assign it to the entity.
      entity.challenge = challenge;
    }.bind(this));
  }

  // Run this when we have the profile nickname.
  assignGitChallenges() {
    var entities = this.game.entityManager.objects;
    entities.forEach(function(entity) {
      if (entity.type === 'owl') {
        // Set all owls to the same challenge for now.
       // @todo: allow for multiple git challenges
        this.setGitChallenge(entity, 0, this.challenges.owl[0].prompt);
      }
    }.bind(this));
  }

  // Assigns Git challenges to enemies.
  setGitChallenge(entity, gitChallengeId, gitChallengeText) {
    // Dummy answer, these are challenges without an answer. You pass the challenge when 0 tests fail.
    // @todo: hide the answer box on git challenges
    var answer = '🤗 secret answer 🤗';
    var branch = 'challenge-' + gitChallengeId + '-' + this.app.state.profile.nickname;
    entity.challenge = {
      prompt: 'Hoo hoo! Hoo Hoo! Git challenge! Step 1: Git clone the master branch from git@104.236.47.47:solutions.git. The password is "solution". Step 2: ' + gitChallengeText + ' Step 3: whenever you are finished, push to the "' + branch + '" branch. This will trigger some tests that will take few minutes to run. Check back with me about a minute after pushing to see if the tests passed! Hoo hoo!',
      answer: answer
    }
    entity.gitChallengeId = gitChallengeId;
    entity.gitChallengeText = gitChallengeText;
  }

  // Checks the status of a git challenge (when you bump into a monster)
  checkGitChallenge(entity) {
    if (!entity.gitChallengeId || !entity.gitChallengeText) {
      console.log('error checking git challenge');
      return;
    }
    var answer = '🤗 secret answer 🤗';
    var branch = 'challenge-' + entity.gitChallengeId + '-' + this.app.state.profile.nickname;
    $.get('/api/testresults', {branch: branch})
      .done(function(results) {
        if (results.branch === branch) {
          var failures = results.failures;
          if (failures === 0) {
            window.game.console.log('All tests passed! Congratulations, you passed the challenge!');
            entity.dead = true;
            window.game.entityManager.update();
            this.app.setState({currentEnemy: undefined});
          }
          else {
            entity.challenge = {
              prompt: 'Hoo hoo! Hoo Hoo! Almost there! ' + failures + ' tests are still failing. Try the git challenge again by pushing another solution to the "' + branch + '" branch on git@104.236.47.47:solutions.git. The password is "solution". The challenge is: ' + entity.gitChallengeText + ' Check back with me about a minute after pushing to see if the tests passed! Hoo Hoo!',
              answer: answer
            }
          }
        }
      }.bind(this))
      .fail(function(error) {
         console.log('Error');
      });
  }

  //////////////////////
  // SQUARE RENDERING //
  //////////////////////

  // See renderer.prototype.drawTileToCanvas and renderer.prototype.draw

  // Update the app state with the newly defined images/tiles (received from the renderer)
  drawSquare(x, y, char) {
    var gridNumber = (y * 10) + (x + 1);
    var contents = null;
    var tile = null;

    if (char === '@') {
      contents = 'player';
    } else {
      if (mapCharToType[char]) {
        contents = mapCharToType[char];
        tile = 'tile';
      } else if (entityCharToType[char]) {
        contents = entityCharToType[char];
        tile = 'entity';
      } else if (itemCharToType[char]) {
        contents = itemCharToType[char];
        tile = 'item'
      } else {
        return; // If the character doesn't match up to anything known
      }
    }

    this.grid[gridNumber] = {
      id: gridNumber,
      image: contents,
      tile: tile
    };

  }

  // Update the grid with the newly defined squares (in drawSquare). This is run
  // by the renderer when all the squares have been drawn.
  updateGrid() {
    this.app.setState({
      grid: this.grid
    });
  }
};
