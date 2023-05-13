// SPDX-License-Identifier: MIT

pragma solidity ^0.8.15;

contract Transactions {
    //Number of transactions
    uint256 transactionCount;

    //This will be an event that will be fired when a Transactions is made
    event Transfer(
        address from,
        address reciever,
        uint256 amount,
        string message,
        uint256 timestamp
    );

    //Struct of the transaction that will be storing on chain.
    struct TransactionsStruct {
        address sender;
        address reciever;
        uint256 amount;
        string message;
        uint256 timestamp;
    }

    //Array of transactions
    TransactionsStruct[] transactions;

    //Function to add a transaction to the blockchain with our struct.
    function addBlockchain(address payable reciever, uint256 amount, string memory message) public {
        transactionCount += 1;
        transactions.push(
            TransactionsStruct(msg.sender, reciever, amount, message, block.timestamp)
        );
        //emit the events we created earlier
        emit Transfer(msg.sender, reciever, amount, message, block.timestamp);
    }

    //Function to get all the Transactions.
    function getAllTransaction() public view returns (TransactionsStruct[] memory) {
        return transactions;
    }

    //function to get all the number of transactions
    function getTransactionCount() public view returns (uint256) {
        return transactionCount;
    }

    //View keyword means that the function can only be used to view the date.
    //Therefore no ether needed to run this function.
}
