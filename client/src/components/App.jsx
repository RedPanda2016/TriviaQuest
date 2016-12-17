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
      score: {
        attempted: 0,
        success: 0,
        fail: 0
      },
      // changes state to swap between game view and profile view
      showPlayerProfile: false,
      freePlay: false,
      currentWorld: 'Earth', // !!! Needs to be updated to get the current world !!!
      highScores: [
      // Dummy data for rendering, will come from DB.
        {
          attempted: '0',
          success: '10',
          fail: '0',
          world: 'Earth'
        },
        {
          attempted: '10',
          success: '10',
          fail: '0',
          world: 'Earth'
        },
        {
          attempted: '10',
          success: '10',
          fail: '0',
          world: 'Earth'
        }
      ]
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
      this.setState({profile: profile}, () => {window.gameAppConnector.assignGitChallenges();});
    });
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
          score: {
            attempted: prevState.score.attempted += 1,
            success: prevState.score.success += 1,
            // No change
            fail: prevState.score.fail
          }
        };
      });
    } else {
      // Decrement the user's health
      this.game.player.decrementPlayerHealth(this.options.damage);

      // If the user's answer was incorrect, +1 to the number of fails
      this.setState((prevState, props) => {
        return {
          score: {
            attempted: prevState.score.attempted += 1,
            success: prevState.score.success, // No change
            fail: prevState.score.fail += 1
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
      // On success call reload.
    console.log('!!HERE IS WHERE TO ADD FUNCTIONALITY FOR SAVE USERINFO!!');
    location.reload();
  }


  swapProfileView() {
    // Swaps out grid with player view
    this.state.showPlayerProfile ? this.setState({showPlayerProfile: false}) : this.setState({showPlayerProfile: true});
  }

  render() {
    // **Variables beginning with _ are meant ot be used as references only. Do not mutate them.**
    var _grid = this.state.grid;
    var _health = this.state.playerHealth;
    var toRender;
    var gameInfoText = "";

    const style = {
      margin:47
    };

    // Show login screen if user is not yet logged in.
    if (!this.idToken && !this.state.freePlay) {
      this.setState({freePlay: true});
      this.lock.show();
    } else {
      // Make ajax call to server to get user information for loading.
        // On success do the return statement below,
        // Note -> For now send the grid to the DB for the current board.
      console.log('!!HERE IS WHERE TO ADD FUNCTIONALITY FOR LOAD USERINFO!!');
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
          iconElementRight={this.state.profile ? <div className="right-icon"><span className="github-name">{this.state.profile ? this.state.profile.name : ''}</span><a href="#" onClick={this.swapProfileView.bind(this)}><Avatar src={this.state.profile.picture} size={35} backgroundColor='transparent' /></a></div> : <RaisedButton type="submit" label="SIGN UP!" style={style} onClick={this.logout} />}
        />

        <div className= "game-display">
          <PlayerStatus health={_health} id="heart-display" />
          <Grid grid={_grid} state={this.state} />
          {this.state.showPlayerProfile ? (<UserProfile state={this.state} swapProfileView={this.swapProfileView.bind(this)} logout={this.logout.bind(this)} />) : ''}
          <Gameinfo id="gameinfo" gameInfoText={gameInfoText}/>
          <Textfield checkAnswer={this.checkAnswer.bind(this)}/>
          <GameOver actions={this.actions} health={_health}/>
        </div>
      </div>
    );
  }
}

export default App;
