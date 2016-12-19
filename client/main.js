'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import BGMusicPlayer from './src/components/BackgroundMusic.jsx'
import App from './src/components/App.jsx';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';


function main() {
  return;
}

const muiTheme = getMuiTheme({
  appBar: {
    height: 5
  },
  palette: {
    primary1Color: 'rgba(0, 0, 0, 0)'
  }
});

const element = (
  <div>
    <BGMusicPlayer/>
  <div>
    <MuiThemeProvider muiTheme={muiTheme}>
      <App />
    </MuiThemeProvider>
  </div>
  </div>
);

ReactDOM.render(
  element,
  document.getElementById('main')
);
