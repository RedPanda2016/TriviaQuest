import React, { Component } from 'react'
import ReactHowler from 'react-howler'

var musicArray = [
  '../../sounds/music/Rolemusic_-_01_-_A_ninja_among_culturachippers.mp3',
  '../../sounds/music/Rolemusic_-_01_-_Bacterial_love.mp3',
  '../../sounds/music/Rolemusic_-_01_-_Shipwreck_In_The_Pacific_Ocean.mp3',
  '../../sounds/music/Rolemusic_-_01_-_Spell.mp3',
  '../../sounds/music/Rolemusic_-_02_-_Ants.mp3',
  '../../sounds/music/Rolemusic_-_02_-_ayVentura.mp3',
  '../../sounds/music/Rolemusic_-_02_-_Chasing_The_Port_Chains.mp3',
  '../../sounds/music/Rolemusic_-_02_-_Leafless_Quince_Tree.mp3',
  '../../sounds/music/Rolemusic_-_03_-_Another_beek_beep_beer_please.mp3',
  '../../sounds/music/Rolemusic_-_03_-_Crush_At_Maracas_Bar.mp3',
  '../../sounds/music/Rolemusic_-_03_-_Python.mp3',
  '../../sounds/music/Rolemusic_-_03_-_Straw_Fields.mp3',
  '../../sounds/music/Rolemusic_-_04_-_Scape_from_the_city.mp3',
  '../../sounds/music/Rolemusic_-_04_-_The_Pirate_And_The_Dancer.mp3',
  '../../sounds/music/Rolemusic_-_04_-_Yellow_Dust.mp3',
  '../../sounds/music/Rolemusic_-_05_-_Death_on_the_battlefield.mp3',
  '../../sounds/music/Rolemusic_-_05_-_Poppies.mp3',
  '../../sounds/music/Rolemusic_-_05_-_She_Is_My_Best_Treasure.mp3',
  '../../sounds/music/Rolemusic_-_06_-_Donsi_Killed_la_rioja_star_Familiar_live.mp3',
  '../../sounds/music/Rolemusic_-_06_-_He_Plays_Me_The_Best_Rhythms.mp3',
  '../../sounds/music/Rolemusic_-_07_-_Beach_Wedding_Dance.mp3',
  '../../sounds/music/Rolemusic_-_07_-_l3go.mp3'
];



var BGMusicPlayer = ({bgMusicPlayPause} = false) => {
  const shuffleMusic = (musicArray) => {
    let i = 0, j = 0, temp = 0;

    for (i = musicArray.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i+1));
      temp = musicArray[i];
      musicArray[i] = musicArray[j];
      musicArray[j] = temp;
    };

    return musicArray;
  };

  return (
    <ReactHowler
      src={shuffleMusic(musicArray)}
      playing={bgMusicPlayPause}
      volume={.1}
    />
  )
}

export default BGMusicPlayer;