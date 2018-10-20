import * as React from 'react';
import './App.css';

import logo from './logo.svg';

const enum Player {
  None = 0,
  One = 1, // you
  Two = 2 // computer
}

interface IState {
  board: Player[];
  currentPlayer: Player;
  status: string;
  isRunning: boolean;
  winningCells: number[]
}

class App extends React.Component<{}, IState> {
  
  public readonly baseState: IState = {
    board: [
      Player.None,
      Player.None,
      Player.None,
      Player.None,
      Player.None,
      Player.None,
      Player.None,
      Player.None,
      Player.None
    ],
    currentPlayer: Player.One,
    isRunning: true,
    status: `Click into game area to start`,
    winningCells: []
  }

  public readonly state: IState;

  constructor(props: {}) {
    super(props);
    this.state = {...this.baseState};
  }

  public installResetHandler = () => () => {    
    this.setState({ ...this.baseState});
  }

  public installClickHandler = (index: number) => () => {
    const { board, currentPlayer } = this.state;

    if(board[index] !== Player.None || this.state.isRunning === false) {
      return;
    }

    let newBoard = board.slice();
    newBoard[index] = currentPlayer;
    let nextPlayer = this.getNextPlayer(currentPlayer);
    
    let { status, isRunning, winningCells } = this.checkIfGameIsOver(newBoard, nextPlayer);

    if(isRunning === true) {
      
      // to simulate computer move
      const newBoardAfterComputerMove = this.makePlayerTwoMove(newBoard); 
      const nextAfterComputerPlayer = this.getNextPlayer(nextPlayer);
      // const { status, isRunning, winningCells } = this.checkIfGameIsOver(newBoard, nextPlayer);
      const computerResults = this.checkIfGameIsOver(newBoardAfterComputerMove, nextAfterComputerPlayer);

      newBoard = newBoardAfterComputerMove;
      nextPlayer = nextAfterComputerPlayer;
      status = computerResults.status;
      isRunning = computerResults.isRunning;
      winningCells = computerResults.winningCells;
    }
    
    this.setState({ 
      ...this.state, 
      board:newBoard, 
      currentPlayer: nextPlayer, 
      isRunning, 
      status, 
      winningCells 
    });    
  }


  public getNextPlayer(currentPlayer: Player): Player {
    return currentPlayer === Player.One ? Player.Two : Player.One;
  }

  public renderCell = (index:number) => {
    let isWinningCell = 'no';
    for(const winningCell of this.state.winningCells) {
      if(winningCell === index) {
        isWinningCell = 'yes';
      }
    }
    
    return <div 
        className="cell" 
        key={index} 
        id={index.toString()}
        onClick={this.installClickHandler(index)}
        data-player={this.state.board[index]}
        data-iswinningcell={isWinningCell}
      >
        {index}
      </div>;
  };

  public checkIfGameIsOver = (board: Player[], player: Player) => {
    let isRunning = false;
    let status = '';
    let winningCells: number[] = [];
    
    board.map( (c,i) => {
      if(c === 0) {
        isRunning = true;
      }
    });

    // rows
    if(board[0] === board[1] && board[0] === board[2] && board[0] !== Player.None) {
      status =  this.getWinningMessage(board, 0);
;     isRunning = false;
      winningCells = [0,1,2];
    } else if(board[3] === board[4] && board[3] === board[5] && board[3] !== Player.None) {
      status =  this.getWinningMessage(board, 3);
      winningCells = [3,4,5];
      isRunning = false;
    } else if (board[6] === board[7] && board[6] === board[8] && board[6] !== Player.None) {
      status =  this.getWinningMessage(board, 6);
      isRunning = false;
      winningCells = [6,7,8];
    }

    // cols
    if(board[0] === board[3] && board[0] === board[6] && board[0] !== Player.None) {
      status =  this.getWinningMessage(board, 0);
      isRunning = false;
      winningCells = [0,3,6];
    } else if(board[1] === board[4] && board[1] === board[7] && board[1] !== Player.None) {
      status =  this.getWinningMessage(board, 1);
      winningCells = [1,4,7];
      isRunning = false;
    } else if (board[2] === board[5] && board[2] === board[8] && board[2] !== Player.None) {
      status =  this.getWinningMessage(board, 2);
      winningCells = [2,5,8];
      isRunning = false;
    }

    // diagonally
    if(board[0] === board[4] && board[0] === board[8] && board[0] !== Player.None) {
      status =  this.getWinningMessage(board, 0);
      winningCells = [0,4,8];
      isRunning = false;
    } else if(board[2] === board[4] && board[2] === board[6] && board[2] !== Player.None) {
      status =  this.getWinningMessage(board, 2);
      winningCells = [2,4,6];
      isRunning = false;
    } 

    if(status !== '') {
      return {
        isRunning, status, winningCells
      };
    }
    status = isRunning ? '' : 'Game has finished. Nobody has won';
    return { isRunning, status, winningCells  };
  };

  public getWinningMessage(board: Player[], player:Player) {
    return (board[player] === Player.One) ? 'You won!' : 'Computer won!';
  }

  public makePlayerTwoMove(board: Player[]): Player[] {
    const availableCells: number[] = [];     
    board.map((c,i)=>{
      if(c === Player.None) {
        availableCells.push(i);
      }
    });
    if(availableCells.length > 0) {
      const randomNumber = Math.floor(Math.random() * availableCells.length); 
      const indexOnBoardToClick = availableCells[randomNumber];
      const newBoard = board.slice();
      newBoard[indexOnBoardToClick] = Player.Two;
      return newBoard;
    }     
    return board; // nothing
  }

  public renderStatus = () => {
    return <div className="status">{this.state.status}</div>;
  };

  public renderBoard = () => {
    const { board } = this.state;
    return <div className="board-container">{board.map( (c, i) => this.renderCell(i) )}</div>;
  };
  
  public render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to Tic-tac-toe</h1>
        </header>
        <div className="App-intro">
          {this.renderStatus()}
          {this.renderBoard()}
        </div>
        <div className="restartBtn" onClick={this.installResetHandler()}>Restart</div>
      </div>
    );
  }
}

export default App;
