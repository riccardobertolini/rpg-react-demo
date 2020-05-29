import React from 'react';
import './App.css';
import AnimateOnChange from 'react-animate-on-change';
import { throttle } from 'lodash';

class App extends React.Component {
  constructor(props){
    super(props);
    
    this.state = {
      direction: '',
      conversationModal: false,
      lastDirection: 'down',
      mapSizeX: 15,
      mapSizeY: 18,
      cameraX: 0,
      cameraY: 0,
      heroPositionX: 90,
      heroPositionY: 90,
      pressedButton: 0,
      grid: [[]],
      obstacles: [
        {x: 40, y: 10, type: 'bush1left'},
        {x: 40, y: 20, type: 'bush2left'},
        {x: 40, y: 30, type: 'bush3left'},
        {x: 40, y: 40, type: 'bush4left'},
        {x: 50, y: 10, type: 'bush1'},
        {x: 50, y: 20, type: 'bush2'},
        {x: 50, y: 30, type: 'bush3'},
        {x: 50, y: 40, type: 'bush4'},

        {x: 20, y: 120, type: 'bush1left'},
        {x: 20, y: 130, type: 'bush2left'},
        {x: 20, y: 140, type: 'bush3left'},
        {x: 20, y: 150, type: 'bush4left'},
        {x: 30, y: 120, type: 'bush1'},
        {x: 30, y: 130, type: 'bush2'},
        {x: 30, y: 140, type: 'bush3'},
        {x: 30, y: 150, type: 'bush4'},

        {x: 30, y: 0, type: 'treeA'},
        {x: 30, y: 10, type: 'treeB'},
        {x: 120, y: 10, type: 'treeC'},
        {x: 120, y: 20, type: 'treeD'},
        {x: 50, y: 20, type: 'treeA'},
        {x: 50, y: 30, type: 'treeB'},
        {x: 60, y: 10, type: 'treeC'},
        {x: 60, y: 20, type: 'treeD'},
        {x: 70, y: 60, type: 'treeC'},
        {x: 70, y: 70, type: 'treeD'},
        {x: 80, y: 10, type: 'treeE'},
        {x: 80, y: 20, type: 'treeF'},
        {x: 90, y: 30, type: 'treeA'},
        {x: 90, y: 40, type: 'treeB'},        
        {x: 130, y: 130, type: 'treeA'},
        {x: 130, y: 140, type: 'treeB'},
        {x: 100, y: 100, type: 'treeC'},
        {x: 100, y: 110, type: 'treeD'},
        {x: 50, y: 130, type: 'treeE'},
        {x: 50, y: 140, type: 'treeF'},
        {x: 150, y: 100, type: 'treeC'},
        {x: 150, y: 110, type: 'treeD'},

        {x: 0, y: 0, type: 'bush1'},
        {x: 0, y: 10, type: 'bush2'},
        {x: 0, y: 20, type: 'bush2'},
        {x: 0, y: 30, type: 'bush2'},
        {x: 0, y: 40, type: 'bush2'},
        {x: 0, y: 50, type: 'bush2'},
        {x: 0, y: 60, type: 'bush2'},
        {x: 0, y: 70, type: 'bush2'},
        {x: 0, y: 80, type: 'bush2'},
        {x: 0, y: 90, type: 'bush2'},
        {x: 0, y: 100, type: 'bush2'},
        {x: 0, y: 110, type: 'bush3'},
        {x: 0, y: 120, type: 'bush4'},
        {x: 0, y: 130, type: 'bush5'},
        {x: 0, y: 140, type: 'bush1'},
        {x: 0, y: 150, type: 'bush2'},
        {x: 0, y: 160, type: 'bush3'},
        {x: 0, y: 170, type: 'bush4'},
        
        {x: 0, y: 140, type: 'bush1'},
        {x: 0, y: 150, type: 'bush2'},
        {x: 0, y: 160, type: 'bush3'},
        {x: 0, y: 170, type: 'bush4'}
      ],
      people: [
        {id: 0, x: 20, y: 50, type: 'person1', directionSight: 'down', conversationID: 1},
        {id: 1, x: 40, y: 80, type: 'person2', directionSight: 'left', conversationID: 2},
      ],
      conversation: [
        {
          id: 1,
          nLine: 1,
          user: "Jim",
          line: "I cannot find my compass anymore! I'm sure it was here, as always in my pocket..."
        },
        {
          id: 2,
          nLine: 1,
          user: "Adam",
          line: "What? I'm not lost, just resting a bit"
        }
      ]

    }
    this.handleKeyPress = throttle(this.handleKeyPress.bind(this), 100);
  }

  createGrid() {

    const matrix = [];
    for(var i=0; i<this.state.mapSizeY; i++) {
    matrix[i] = [];
      for(var j=0; j<this.state.mapSizeX; j++) {
        matrix[i][j] = true;
      }
    }
       
    this.state.obstacles.map((obstacle) => {
      const x = obstacle.x / 10;
      const y = obstacle.y / 10;
        matrix[y][x] = false
    })
    this.state.people.map((obstacle) => {
      const x = obstacle.x / 10;
      const y = obstacle.y / 10;
        matrix[y][x] = false
    })
    this.setState({
      grid: matrix
    });
  }

  isPathFree(x, y) {
    const xPath = x / 10;
    const yPath = y / 10;
    return this.state.grid[yPath][xPath];
  }

  restoreButtonPressed() {
    this.setState({ pressedButton: 0 })
  }

  handleKeyPress(e) {
    if(this.state.conversationModal) {
      this.setState({  conversationModal: false });
    }else{
      if(e.keyCode === 13) {
        // Enter
        const heroSight = this.state.lastDirection;

        this.state.people.map((person) => {
            if(heroSight === 'left' && person.x === this.state.heroPositionX - 10 ||
            heroSight === 'right' && person.x === this.state.heroPositionX + 10 ||
            heroSight === 'up' && person.y === this.state.heroPositionY - 10 ||
            heroSight === 'down' && person.y === this.state.heroPositionY + 10 ) {
              const peopleNew = [...this.state.people];
              peopleNew[person.id].directionSight = heroSight;
              this.setState({ people: peopleNew, conversationModal: person.conversationID });
              
            }
        })
      }

      if(e.keyCode === 37) {
        // Left
        if(this.state.heroPositionX > 0 && this.isPathFree(this.state.heroPositionX - 10, this.state.heroPositionY)) {
          this.setState({heroPositionX: this.state.heroPositionX - 10, cameraX: this.state.cameraX > 0 ? this.state.cameraX - 10 : this.state.cameraX, direction: 'heroLeft', lastDirection: 'left', pressedButton: 1});
        }else{
          this.setState({lastDirection: 'left'});
        }
      }

      if(e.keyCode === 38) {
        // Top
        if(this.state.heroPositionY / 10 > 0 && this.isPathFree(this.state.heroPositionX, this.state.heroPositionY - 10)) {
          this.setState({heroPositionY: this.state.heroPositionY - 10, cameraY: this.state.cameraY + 10, direction: 'heroUp', lastDirection: 'up', pressedButton: 1});
        }else{
          this.setState({lastDirection: 'up'});
        }
      }

      if(e.keyCode === 39) {
        // Right
        if((this.state.heroPositionX / 10) + 1  < this.state.grid[0].length && this.isPathFree(this.state.heroPositionX + 10, this.state.heroPositionY)) {
          this.setState({heroPositionX: this.state.heroPositionX + 10, cameraX: this.state.cameraX > 0 ? this.state.cameraX - 10 : this.state.cameraX, direction: 'heroRight', lastDirection: 'right', pressedButton: 1});
        }else{
          this.setState({lastDirection: 'right'});
        }
      }

      if(e.keyCode === 40) {
        //Down
        if((this.state.heroPositionY / 10) + 1 < this.state.grid.length && this.isPathFree(this.state.heroPositionX, this.state.heroPositionY + 10)) {
          this.setState({heroPositionY: this.state.heroPositionY + 10, cameraY: this.state.cameraY - 10, direction: 'heroDown', lastDirection: 'down', pressedButton: 1});
        }else{
          this.setState({lastDirection: 'down'});
        }
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

    return(
      <div className="gameArea" style={{ width: gridX * 10,  height: gridY * 10, marginTop: this.state.cameraY, marginLeft: this.state.cameraX }}>
        {
          this.state.obstacles.map((obstacle) => <div className={obstacle.type} style={{ top:obstacle.y, left: obstacle.x}}></div>)
        }
        
        {
          this.state.people.map((person) => {
            const classes = person.directionSight + ' ' + person.type;
            return <div className={classes} style={{ top:person.y, left: person.x}}>
            </div>
          })
        }
        {
          this.state.conversationModal &&
          <div className="conversation">
            {this.state.conversation.map((dialog) => {
              if(dialog.id === this.state.conversationModal) {
                return <div>
                  
                  <p><strong>{dialog.user}:</strong> {dialog.line}</p>
                </div>
              }
            })}
          </div>
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
