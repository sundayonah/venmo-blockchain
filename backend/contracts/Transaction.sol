//SPDX-License-Identifier:UNLICENSED

pragma solidity ^0.8.15;

contract Transaction {
    //Number of transactions
    uint256 transactionCount;

    //This will be an event that will be fired when a Transaction is made
    event Transfer(
        address from,
        address reciever,
        uint256 amount,
        string message,
        uint timestamp
    );

    //Struct of the transaction that will be storing on chain.
    struct TransactionStruct {
        address sender;
        address reciever;
        uint256 amount;
        string message;
        uint256 timestamp;
    }

    //Array of transactions
    TransactionStruct[] transactions;

    //Constructor
    //Function to add a transaction to the blockchain with our struct.
    function addBlockchain(
        address payable reciever,
        uint amount,
        string memory message
    ) public {
        transactionCount += 1;
        transactions.push(
            TransactionStruct(
                msg.sender,
                reciever,
                amount,
                message,
                block.timestamp
            )
        );
        //emit the event we created earlier
        emit Transfer(msg.sender, reciever, amount, message, block.timestamp);
    }

    //Function to get all the Transaction.
    function getAllTransaction()
        public
        view
        returns (TransactionStruct[] memory)
    {
        return transactions;
    }
}
