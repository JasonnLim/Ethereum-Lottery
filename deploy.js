const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const { interface, bytecode } = require('./compile'); //Get the abi and bytecode from compile.js

//Link to rinkeby network by using Infura and providing seed phrase of metamask wallet
const provider = new HDWalletProvider(
    'ivory honey fix online income decorate also top wish civil decorate illegal',
    'https://rinkeby.infura.io/v3/cae3e4c525ba4a75b6ae9ffe89ca6160',
);

const web3 = new Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();

    console.log('Attempting to deploy from account', accounts[0]);

    //Deploy contract to rinkeby network
    const result = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({ data: bytecode })
        .send({ gas: '1000000', from: accounts[0] });

    //Display the address of the contract 
    console.log('Contract deployed to ', result.options.address);
    console.log(interface);
};

deploy();