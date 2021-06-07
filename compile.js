const path = require('path');
const fs = require('fs');
const solc = require('solc');

//__dirname will auto find the current folder which is Lottery
const lotteryPath = path.resolve(__dirname, 'contracts', 'Lottery.sol');
const source = fs.readFileSync(lotteryPath, 'utf8');

//pass in source code and specify number of contracts to compile
module.exports = solc.compile(source, 1).contracts[':Lottery'];