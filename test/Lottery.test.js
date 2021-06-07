const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const { interface, bytecode } = require('../compile');

let lottery;
let accounts;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();

    lottery = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({ data: bytecode })
        .send({ from: accounts[0], gas: '1000000' });
});

//When thinking of what test to write, what behavior do you really care about the contract
describe('Lottery Contract', () => {
    it('Can deploy contract', () => {
        //assert.ok will make sure there is a value for that variable
        assert.ok(lottery.options.address);
    });


    it('Allows one account to enter', async () => {
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('0.02', 'ether')
        });

        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });

        assert.strictEqual(accounts[0], players[0]);
        assert.strictEqual(1, players.length);
    });


    it('Allows multiple accounts to enter', async () => {
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('0.02', 'ether')
        });
        await lottery.methods.enter().send({
            from: accounts[1],
            value: web3.utils.toWei('0.02', 'ether')
        });
        await lottery.methods.enter().send({
            from: accounts[2],
            value: web3.utils.toWei('0.02', 'ether')
        });

        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });

        assert.strictEqual(accounts[0], players[0]);
        assert.strictEqual(accounts[1], players[1]);
        assert.strictEqual(accounts[2], players[2]);
        assert.strictEqual(3, players.length);
    });


    it('Requires a minimum amount of ether to enter', async () => {
        try {
            await lottery.methods.enter().send({
                from: accounts[0],
                value: 1
            });
            assert(false); //statement to fail the test 
        } catch (err) {
            assert(err);
        }
    });


    it('Only manager can call pickWinner method', async () => {
        try {
            await lottery.methods.pickWinner().send({
                from: accounts[1]
            });
            assert(false); //statement to fail the test 
        } catch (err) {
            assert(err);
        }
    });


    it('Sends money to the winner and resets the players array', async () => {
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('2', 'ether')
        });

        //Balance before being picked as winner
        const initialBalance = await web3.eth.getBalance(accounts[0]);

        await lottery.methods.pickWinner().send({ from: accounts[0] });

        //Balance after being picked as winner
        const finalBalance = await web3.eth.getBalance(accounts[0]);

        //The amount of ETH won from the lottery
        const difference = finalBalance - initialBalance;

        //The ETH won from the lottery a bit lesser than the ETH provided because it is used for gas
        assert(difference > web3.utils.toWei('1.9', 'ether'));
    });

    it('Winner has been selected', async () => {
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('0.02', 'ether')
        });

        await lottery.methods.pickWinner().send({
            from: accounts[0]
        });

        const winner = await lottery.methods.getWinner().call({
            from: accounts[0]
        });

        assert.strictEqual(winner, accounts[0]);
    });
});