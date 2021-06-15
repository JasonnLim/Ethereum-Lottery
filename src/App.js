import React, { Component } from 'react'
import './App.css';
import web3 from './web3';
import lottery from './lottery';
import { Header, Icon, Segment, Button, Input, Grid} from 'semantic-ui-react';


class App extends Component {
  //Class based component needs to have state and render method
  state = {
    players: [],
    balance: '0',
    value: '',
    message: ''
  };

  //This is like a constructor and it runs right after render method
  async componentDidMount() {
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);

    this.setState({ players, balance });
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

    this.setState({ message: 'You have entered the lottery! Please refresh the page' });
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
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.4.1/semantic.min.css"></link>
        <Header as='h2' dividing color='red'>
          <Icon name='ethereum'/>
          <Header.Content>Ethereum Lottery        
          <Header.Subheader>Come join us for guranteed prizes</Header.Subheader>
          </Header.Content>
        </Header>
        <Segment>
          <Header as='h2' textAlign='center'>Total Prize Pool</Header>
          <Header as='h1' textAlign='center' color='red'> {web3.utils.fromWei(this.state.balance, 'ether')} ETH</Header>
          <Header as='h4' textAlign='center'>{this.state.players.length} players have entered</Header>

        <Grid><Grid.Row centered><Grid.Column width={4}>
          <form onSubmit={this.onSubmit}>
            <div>
              <Input
                label={{ basic: true, content: 'ETH' }}
                labelPosition='right'
                placeholder='Enter ETH amount'
                value={this.state.value}
                onChange={event => this.setState({ value: event.target.value })}
                fluid
              />
            </div>
            <Button content = "Join Now" icon = "add circle" secondary fluid/>
          </form>
        </Grid.Column></Grid.Row></Grid>
        </Segment>   

        <Header as='h2' textAlign='center'>{this.state.message}</Header>
        <br/>
        <Segment>
          <Header as='h2' textAlign='center'>Admin Only</Header>
          <Grid><Grid.Row centered><Grid.Column width={3}>
            <Button onClick={this.onClick} content='Select Winner' fluid></Button>  
          </Grid.Column></Grid.Row></Grid>
        </Segment>
      </div>
    );
  }
}

export default App;
