import React, { Component } from 'react'
import './App.css';
import web3 from './web3';
//import { render } from '@testing-library/react';
import lottery from './lottery';

class App extends Component {
  //Class based component needs to have state and render method
  state = {
    manager: '',
    players: [],
    balance: '0',
    value: '',
    message: ''
  };

  //This is like a constructor and it runs right after render method
  async componentDidMount() {
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);

    this.setState({ manager, players, balance });
  }

  //arrow function
  onSubmit = async (event) => {
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();

    this.setState({ message: 'Waiting for transaction to be approved...' });

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, 'ether')
    });

    this.setState({ message: 'You have entered the lottery!\nPlease refresh the page' });
  };

  onClick = async () => {
    const accounts = await web3.eth.getAccounts();

    this.setState({ message: 'Selecting winner, please wait...' });

    await lottery.methods.pickWinner().send({
      from: accounts[0]
    });

    const winner = await lottery.methods.getWinner().call({
      from: accounts[0]
    });

    this.setState({ message: 'Congratulations, The winner is ' + winner });
  };

  render() {
    return (
      <div>
        <h2>Ethereum Lottery</h2>
        <p>This contract is managed by {this.state.manager}
          <br />There are currently {this.state.players.length} people entered
          <br />The total prize pool is {web3.utils.fromWei(this.state.balance, 'ether')} ETH
        </p>

        <hr />

        <form onSubmit={this.onSubmit}>
          <h4>Want to try your luck?</h4>
          <div>
            <label>Amount of ETH to enter  </label>
            <input
              value={this.state.value}
              onChange={event => this.setState({ value: event.target.value })}
            />
          </div>
          <button>Enter</button>
        </form>

        <hr />
        <h4>Randomly select a winner</h4>
        <button onClick={this.onClick}>Select Winner</button>
        <hr />

        <h1>{this.state.message}</h1>

      </div>
    );
  }
}

export default App;
