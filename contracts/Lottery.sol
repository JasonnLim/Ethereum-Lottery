pragma solidity ^0.4.17;

contract Lottery {
    address public manager;
    address[] public players;
    address public winner;
    
    //The account that deploys the contract is the manager
    function Lottery() public {
        manager = msg.sender;
    }
    
    //The account has to pay more than 0.01 ether to join the lottery
    function enter() public payable {
        require(msg.value > 0.01 ether);
        
        players.push(msg.sender);
    }
    
    //Get current block difficulty and current time and player address and hash all this values
    function random() public view returns (uint) {
        return uint(keccak256(block.difficulty, now, players));
    }
    
    //Only the manager is allowed to pick winner and the contracts balance will all go towards the winner selected by the random function
    function pickWinner() public restricted {
        uint index = random() % players.length;
        players[index].transfer(this.balance);
        winner = players[index];
        //Create new dynamic array of type address and set its size to 0 (Resets the lottery)
        players = new address[](0); 
    }
    
    modifier restricted() {
        require(msg.sender == manager);
        _;
    }
    
    function getPlayers() public view returns(address[]) {
        return players;
    }

    function getWinner() public view returns(address) {
        return winner;
    }
}