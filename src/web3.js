import Web3 from 'web3';

const web3 = new Web3(window.web3.currentProvider);
//If receive error then change the above statement to 
//const web3 = new Web3(window.web3.currentProvider.enable());
//After changing the statement and do npm start, change the statement back to the original and npm start again

export default web3;