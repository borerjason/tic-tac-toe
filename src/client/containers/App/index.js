import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Board from '../Board';
import Home from '../Home';
import Welcome from '../Welcome';
import Scoreboard from '../Scoreboard';
import { Header, Wrapper, GameWrapper } from '../../components';
import { updateOpponent, onWinUpdateScoreboard } from './state-functions';
import { newGame, updateGameId, joinGame, confirmJoinNewGame } from '../../socket';

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      activeGame: false,
      gameId: '',
      message: '',
      role: '',
      name: '',
      opponent: 'TBD',
      userWins: 0,
      opponentWins: 0
    }
    
    updateGameId((err, gameId) => {
      this.setState({ 
        activeGame: true,
        gameId,
        message: `Send your game id to a friend to get started. Your game id is: ${gameId}`,
        role: 'X'
      });
    });

    confirmJoinNewGame((err, data) => {
      this.setState({
        activeGame: true,
        gameId: data.gameId,
        message: `You've joined, it is your opponents turn`,
        role: 'O',
        opponent: data.opponent
      });
    })

    this.onSignUpUpdateName = this.onSignUpUpdateName.bind(this);
    this.updateOpponent = this.updateOpponent.bind(this);
    this.onWinUpdateScoreboard = this.onWinUpdateScoreboard.bind(this);
  }

  updateOpponent(players) {
    const opponent = updateOpponent(this.state.name, players);  
    this.setState({ opponent });
  }

  onWinUpdateScoreboard(winner) {
    const newState = onWinUpdateScoreboard(this.state, winner);
    this.setState(newState); 
  }

  onSignUpUpdateName(name) {
    this.setState({ name });
  }
  
  render() {
    return (
      <Wrapper>
        <Header>Tic-Tac-Toe</Header>
        <Router>
          <Switch>
            <Route 
              exact path='/'
              render={() => (
                <Wrapper>
                  <Welcome
                    updateName={this.onSignUpUpdateName}
                  /> 
                </Wrapper>
              )}
            />
            <Route 
              path='/home'
              render={() => (
                <Wrapper>
                  <Home
                    name={this.state.name}
                  /> 
                </Wrapper>
              )}
            />
            <Route
              path='/game'
              render={() => (
                <GameWrapper>
                  <Board
                    message={this.state.message}
                    gameId={this.state.gameId}
                    updateOpponent={this.updateOpponent}
                    role={this.state.role}
                    name={this.state.name}
                    opponent={this.state.opponent}
                    updateScoreboard={this.onWinUpdateScoreboard}
                  />
                  <Wrapper>
                    <Scoreboard
                      name={this.state.name}
                      opponent={this.state.opponent}
                      userWins={this.state.userWins}
                      opponentWins={this.state.opponentWins}
                    />
                    <div> THis will be scoreboard {this.state.name} vs {this.state.opponent} </div>
                    <div> This will be chatService</div>
                  </Wrapper>
                </GameWrapper>
              )}
            />
          </Switch>
        </Router>
      </Wrapper>
    )
  }
};

export default App;
