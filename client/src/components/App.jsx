'use strict';

import React from 'react';
import Gameinfo from './Gameinfo.jsx';
import Textfield from './Textfield.jsx';
import Grid from './Grid.jsx';
import AppBar from 'material-ui/AppBar';
import Avatar from 'material-ui/Avatar';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import PlayerStatus from './PlayerStatus.jsx';
import GameOver from './GameOver.jsx';
import RaisedButton from 'material-ui/RaisedButton';
import UserProfile from './UserProfile.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // Objects with and ID, an optional challenge, and optional "image".
      grid: {},
      // Score object to track challenges attempted, succeeded, and failed, so we can show stats.
      currentScore: {
        attempted: 0,
        success: 0,
        fail: 0
      },
      highScores: [
        {// DUMMY DATA!!
          attempted: 0,
          success: 0,
          fail: 0
        },
        {
          attempted: 0,
          success: 0,
          fail: 0
        }
      ],
      currentWorld: 'Earth', // !!! Needs to be updated to get the current world !!!
      // changes state to swap between game view and profile view
      freePlay: false,
      // changes state to allow free play without signup
      showPlayerProfile: false,
    };

    this.options = {
      // Number of spaces on the gameboard
      numSpaces: 100,
      // How much to decrement health by
      damage: 20
    };

    this.swapProfileView.bind(this);
  }

  ////////////////////
  // INITIALIZATION //
  ////////////////////

  componentWillMount() {
    // See https://davidwalsh.name/react-authentication
    this.createLock();
    // **Variables beginning with _ are meant to be used as references only. Do not mutate them.**
    var _grid = this.state.grid;
    // Connect the roguelike-game to window so App can access it.
    window.gameAppConnector = new GameAppConnector(this);
    // Access information about the game with this variable.
    this.game = window.game;

    // Store the player health in the state
    // The roguelike game will update this
    this.setState({
      playerHealth: this.game.player.health
    });

    // Initial rendering of the gameboard.
    for (let i = 1; i <= this.options.numSpaces; i++) {
      _grid[i] = {
        id: i,
        image: 'water'
      };
    }
    this.setState((prevState) => {
      return {
        grid: _grid,
      }
    });
    this.idToken = this.getIdToken();
    this.setProfile();
  }

  createLock() {
    this.lock = new Auth0Lock('ITJ9uy1UUcFlT13R31uKWEP06hII7eZ0', 'tretuna.auth0.com');
  }

  setProfile() {
    this.lock.getProfile(this.idToken, (err, profile) => {
      if (err) {
        console.log("Error loading the Profile", err);
        return;
      }
      // As soon as we have the profile data, assign the git challenges (which depend on the nickname profile data being available)
      this.setState({profile: profile}, () => {
        this.getUserData(function(res) {
          this.setState({
            grid: res[0].grid,
            currentScore: res[0].currentScore,
            highScores: res[0].highScores,
            playerHealth: res[0].health,
            currentWorld: res[0].currentWorld,
          });
          window.gameAppConnector.assignGitChallenges();
        }.bind(this));
      });
    })

  }


  componentDidMount() {
    this.game.renderer.draw();
  }

  // Check answer
  checkAnswer(e, input) {
    // Prevent the page from refreshing
    e.preventDefault();
    // Clear the input field
    $('#answer').val('');

    // If the player bumped into an enemy
    if (this.state.currentEnemy) {
      if (input === this.state.currentEnemy.challenge.answer) {
        // Kill the enemy
        this.state.currentEnemy.dead = true;
        // Remove the dead enemy from the grid
        this.game.entityManager.update();
        // Increase the player's score
        this.updateScore(true);
        // Remove the enemy from the state
        this.setState({
          currentEnemy: undefined
        });
      } else {
        // Decrement the player's score
        this.updateScore(false);
      }
    }

  }

  updateScore(correct) {
    // Regardless of whether the user's answer was correct,
    // Add +1 to the number of attempted questions
    if (correct) {
      // If the user's answer is correct, +1 to the number of successes
      this.setState((prevState, props) => {
        return {
          currentScore: {
            attempted: prevState.currentScore.attempted += 1,
            success: prevState.currentScore.success += 1,
            // No change
            fail: prevState.currentScore.fail
          }
        };
      });
    } else {
      // Decrement the user's health
      this.game.player.decrementPlayerHealth(this.options.damage);

      // If the user's answer was incorrect, +1 to the number of fails
      this.setState((prevState, props) => {
        return {
          currentScore: {
            attempted: prevState.currentScore.attempted += 1,
            success: prevState.currentScore.success, // No change
            fail: prevState.currentScore.fail += 1
          }
        };
      });
    }
  }

  getIdToken() {
    // First, check if there is already a JWT in local storage
    var idToken = localStorage.getItem('id_token');
    var authHash = this.lock.parseHash(window.location.hash);
    // If there is no JWT in local storage and there is one in the URL hash,
    // save it in local storage
    if (!idToken && authHash) {
      if (authHash.id_token) {
        idToken = authHash.id_token
        localStorage.setItem('id_token', authHash.id_token);
      }
      if (authHash.error) {
        // Handle any error conditions
        console.log("Error signing in", authHash);
      }
    }
    return idToken;
  }

  logout() {
    localStorage.removeItem('id_token');
    // Make an ajax call to the server here to save user information.
    this.addOrUpdateUser(function() {
      location.reload();
    }.bind(this));
  }

  signUp() {
    location.reload();
  }

  swapProfileView() {
    // Swaps out grid with player view
    this.state.showPlayerProfile ? this.setState({showPlayerProfile: false}) : this.setState({showPlayerProfile: true});
  };

  addOrUpdateUser(cb) {
    let assemble = {
      userName: this.state.profile.name,
      grid: this.state.grid,
      highScores: this.state.highScores,
      currentScore: this.state.currentScore,
      health: this.state.playerHealth,
      userId: this.state.profile.user_id,
      currentWorld: this.state.currentWorld,
      secret: "cats"
    }

   $.ajax({
      url: 'http://127.0.0.1:8000/api/userstats',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(assemble),
      success: function(res) {
        cb();
      }.bind(this),
      error: function(err) {
        console.error(err.toString());
      }.bind(this)
    });
  }

  getUserData(cb) {
    let reqData = {
      userId: this.state.profile.user_id,
      secret: 'cats'
    }

    $.ajax({
      url: 'http://127.0.0.1:8000/api/userstats',
      type: 'GET',
      contentType: 'application/json',
      data: reqData,
      success: function(res) {
        cb(res);
      }.bind(this),
      error: function(err) {
        console.error(err.toString());
      }.bind(this)
    });
  }

  render() {
    // **Variables beginning with _ are meant ot be used as references only. Do not mutate them.**
    var _grid = this.state.grid;
    var _health = this.state.playerHealth;
    var toRender;
    var gameInfoText = "";

    const style = {
      margin: 40
    };

    // Show login screen if user is not yet logged in.
    if (!this.idToken) {
      this.lock.show();
    }
    // If there is a challenge, display the challenge prompt
    if (this.state.currentEnemy) {
      gameInfoText = this.state.currentEnemy.challenge.prompt;
    }
    // Render the gameboard, gameinfo, and text input field
    return (
      <div id="app">
        <AppBar
          showMenuIconButton={false}
          iconElementRight={this.state.profile ? <div className="right-icon"><span className="github-name">{this.state.profile ? this.state.profile.name : ''}</span><a href="#" onClick={this.swapProfileView.bind(this)}><Avatar src={this.state.profile.picture} size={35} backgroundColor='transparent' /></a></div> : <RaisedButton type="submit" label="SIGN UP!" style={style} onClick={this.signUp} />}
        />
        <div className= "game-display">
          <PlayerStatus health={_health} id="heart-display" />
          <Grid grid={_grid} state={this.state} />
          <Gameinfo id="gameinfo" gameInfoText={gameInfoText}/>
          <Textfield state={this.state} checkAnswer={this.checkAnswer.bind(this)}/>
          <img id="draggable" class="ui-widget-content" src="../../img/bitcoin.png" className={this.state.showPlayerProfile ? 'hidden' : ''}></img>
          <GameOver actions={this.actions} health={_health}/>

        </div>
      </div>
    );
  }
}

export default App;
