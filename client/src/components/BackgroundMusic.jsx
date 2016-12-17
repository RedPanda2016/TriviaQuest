import ReactHowler from 'react-howler'

class BGMusicPlayer extends Component {
  render () {
    return (
      <ReactHowler
        src='../../sounds/music/Rolemusic_-_01_-_A_ninja_among_culturachippers.mp3'
        playing={true}
      />
    )
  }
}