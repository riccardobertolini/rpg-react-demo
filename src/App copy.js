import React from 'react';
import './App.css';
import AnimateOnChange from 'react-animate-on-change';

class App extends React.Component {
  constructor(props){
    super(props);
    
    this.state = {
      direction: '',
      lastDirection: 'down',
      heroPositionX: 0,
      heroPositionY: 0,
      pressedButton: 0,
      grid: [[]],
      obstacles: [
        {x: 10, y: 10},
        {x: 20, y: 10},
        {x: 30, y: 10},
        {x: 40, y: 10},
        {x: 60, y: 10},
      ]
    }
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  createGrid() {

    const matrix = [];
    for(var i=0; i<9; i++) {
    matrix[i] = [];
      for(var j=0; j<9; j++) {
        matrix[i][j] = true;
      }
    }
       
    this.state.obstacles.map((obstacle) => {
      const x = obstacle.x / 10;
      const y = obstacle.y / 10;
        matrix[x][y] = false
    })
    this.setState({
      grid: matrix
    });
  }

  isPathFree(x, y) {
    return this.state.grid[x / 10][y / 10];
  }

  restoreButtonPressed() {
    this.setState({ pressedButton: 0 })
  }

  handleKeyPress(e) {
    if(e.keyCode === 37) {
      // Left
      if(this.state.heroPositionX > 0 && this.isPathFree(this.state.heroPositionX - 10, this.state.heroPositionY)) {
        this.setState({heroPositionX: this.state.heroPositionX - 10, direction: 'heroLeft', lastDirection: 'left', pressedButton: 1});
      }else{
        this.setState({lastDirection: 'left'});
      }
    }

    if(e.keyCode === 38) {
      // Top
      if(this.state.heroPositionY / 10 > 0 && this.isPathFree(this.state.heroPositionX, this.state.heroPositionY - 10)) {
        this.setState({heroPositionY: this.state.heroPositionY - 10, direction: 'heroUp', lastDirection: 'up', pressedButton: 1});
      }else{
        this.setState({lastDirection: 'up'});
      }
    }

    if(e.keyCode === 39) {
      // Right
      if((this.state.heroPositionX / 10) + 1  < this.state.grid[0].length && this.isPathFree(this.state.heroPositionX + 10, this.state.heroPositionY)) {
        this.setState({heroPositionX: this.state.heroPositionX + 10, direction: 'heroRight', lastDirection: 'right', pressedButton: 1});
      }else{
        this.setState({lastDirection: 'right'});
      }
    }

    if(e.keyCode === 40) {
      //Down
      if(this.state.heroPositionY / 10 < this.state.grid.length && this.isPathFree(this.state.heroPositionX, this.state.heroPositionY + 10)) {
        this.setState({heroPositionY: this.state.heroPositionY + 10, direction: 'heroDown', lastDirection: 'down', pressedButton: 1});
      }else{
        this.setState({lastDirection: 'down'});
      }
    }
  }
  
  componentDidMount() {
    this.createGrid();
    document.addEventListener('keydown', this.handleKeyPress);
  }
  
  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyPress);
  }
  render() {
    const gridX = this.state.grid[0] && this.state.grid[0].length;
    const gridY = this.state.grid && this.state.grid.length;
    console.log(this.state)
    return(
      <div className="gameArea" style={{ width: gridX * 10,  height: gridY * 10  }}>
        {
          this.state.obstacles.map((obstacle) => <div className="obstacle" style={{ top:obstacle.y, left: obstacle.x}}></div>)
        }
        <AnimateOnChange
            baseClassName={`hero ${this.state.lastDirection}`}
            animationClassName={this.state.direction}
            animate={this.state.pressedButton === 1}
            onAnimationEnd={() => this.restoreButtonPressed()}
            style={{
                top: this.state.heroPositionY,
                left: this.state.heroPositionX
              }} />
      </div>
    );
  }
}


export default App;
