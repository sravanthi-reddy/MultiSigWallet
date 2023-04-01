// SPDX-License-Identifier: MIT
pragma solidity >=0.8.2 <0.9.0;

//multiple owners can sign and approve a single transaction
contract MultiSigWallet {
    //for uniqueness of each transaction
    //this combined in sign generation prevents reentrancy attack
    uint256 public nonce;

    //Number of owners approval required to execute the transaction
    uint256 public required;

    //easy to retrive whether a address is owner
    mapping(address => bool) public isOwner;

    //declared it as an array as we need to iterate over the owners where mapping is not suitable
    address[] public owners;

    //when confirmation matched to therequired approval then transaction executes
    //important to track confirmations got for each transaction and make sure the are not duplicates
    struct Transaction {
        address to;
        uint256 value;
        bytes data;
        bool executed;
        uint256 nonce;
        mapping(address => bool) confirmations;
    }

    //Need a way to keep the transaction history in the storage
    //in case owners want to revoke the executed transaction
    mapping(uint256 => Transaction) public transactions;

    //events to emit when condition is satified, so that
    //can listen to those event out side the smart contract and can do required actions
    event Confirmation(address indexed sender, uint256 indexed transactionId);
    event Execution(uint256 indexed transactionId);
    event Deposit(address indexed sender, uint256 value);
    event TransactionSubmitted(
        address indexed to,
        uint256 value,
        bytes data,
        uint256 nonce
    );

    modifier onlyOwner() {
        require(isOwner[msg.sender], "Only owner can access");
        _;
    }

    //to be able to set valid required count while setting up contract
    // and stores all the owners of the contract in owners array
    constructor(address[] memory _owners, uint256 _required) {
        require(_owners.length > 0, "Owners required");
        require(
            _required > 0 && _required <= _owners.length,
            "Invalid approval / required count"
        );

        for (uint256 i = 0; i < _owners.length; i++) {
            address owner = _owners[i];
            require(owner != address(0), "Invalid owner address");
            require(!isOwner[owner], "Duplicate owner");
            isOwner[owner] = true;
            owners.push(owner);
        }

        required = _required;
    }

    //able to receive payable transactions
    function deposit() external payable {
        emit Deposit(msg.sender, msg.value);
    }

    //ability to verify the transaction creator - most important step in providing security
    //generate hash considering nonce so that same signature can't be used for some other
    //transaction. prevents reentrancy attack
    //The signature must be valid and signed by one of the wallet owners.
    /**
    @dev Submits a new transaction to the multisig wallet.
    @param _to The address of the recipient of the transaction.
    @param _value The amount of ether to be sent.
    @param _data The data of the transaction.
    @param _signature The signature of the transaction.
    Effects : 
    Creates a new transaction with the given parameters.
    Records the confirmation of the transaction by the signer.
    Emits an event for the submitted transaction and the confirmation by the signer.
    */
    function submitTransaction(
        address _to,
        uint256 _value,
        bytes memory _data,
        bytes memory _signature
    ) external onlyOwner {
        require(_to != address(0), "Invalid recipient address");
        bytes32 messageHash = getMessageHash(_to, _value, _data, nonce);
        address signer = recoverSigner(messageHash, _signature);

        require(isOwner[signer], "Invalid signature");

        Transaction storage newTransaction = transactions[nonce];
        newTransaction.to = _to;
        newTransaction.value = _value;
        newTransaction.data = _data;
        newTransaction.executed = false;
        newTransaction.nonce = nonce;

        newTransaction.confirmations[signer] = true;

        emit TransactionSubmitted(_to, _value, _data, nonce);

        emit Confirmation(signer, nonce);

        nonce++; //increment the nonce for every new transaction
        //FutureScope - instead of starting from 0, we can consider some random numbers to provide more security
    }

    //gives other owners ability to approve the transaction.
    //once approval reaches required count then it automatically executes the transaction
    /**
    @dev Confirms a transaction by the owner.
    @param _id The ID of the transaction to confirm.
    Requirements:
    The transaction must not have already been executed.
    The owner must not have already confirmed the transaction.
    If the transaction is now confirmed by all required owners, it calls the {executeTransaction} function.
    */
    function confirmTransaction(uint256 _id) public onlyOwner {
        Transaction storage transaction = transactions[_id];

        require(!transaction.executed, "Transaction already executed");
        require(
            !transaction.confirmations[msg.sender],
            "Transaction already confirmed by owner"
        );

        transaction.confirmations[msg.sender] = true;

        emit Confirmation(msg.sender, _id);

        if (isConfirmed(_id)) {
            executeTransaction(_id);
        }
    }

    //executes the transaction and does relevent ether and data transfer to the recepient address
    //prevents double execution and validates approval count before executing
    function executeTransaction(uint256 _id) private onlyOwner {
        Transaction storage transaction = transactions[_id];

        require(
            isConfirmed(_id),
            "Transaction not confirmed by required number of owners"
        );
        require(!transaction.executed, "Transaction already executed");

        transaction.executed = true;

        (bool success, ) = transaction.to.call{value: transaction.value}(
            transaction.data
        );
        require(success, "Transaction execution failed");

        emit Execution(_id);
    }

    //private method to know whether transaction approved by required number of owners
    function isConfirmed(uint256 _id) private view returns (bool) {
        Transaction storage transaction = transactions[_id];
        uint256 count = 0;
        for (uint256 i = 0; i < owners.length; i++) {
            if (transaction.confirmations[owners[i]]) {
                count += 1;
            }
            if (count == required) {
                return true;
            }
        }
        return false;
    }

    //generates the message hash based on transaction data to verify the signature of the above
    //includes nonce to prevent reentrancy attack. It uses special string while generating hash to seperate regular
    //message signature from important value singatures
    function getMessageHash(
        address _to,
        uint256 _value,
        bytes memory _data,
        uint256 _nonce
    ) public view returns (bytes32) {
        bytes32 messageHash = keccak256(
            abi.encodePacked(
                "\x19Ethereum Signed Message:\n32",
                keccak256(abi.encode(address(this), _to, _value, _data, _nonce))
            )
        );
        return messageHash;
    }

    /**
     * @dev Recovers the signer of a message given its hash and signature parameters.
     * @param _messageHash The hash of the signed message.
     * @param _signature The signature parameters in the format of [r, s, v].
     * @return The address of the signer recovered from the signature, or address(0) if the signature is invalid.
     */
    function recoverSigner(
        bytes32 _messageHash,
        bytes memory _signature
    ) public pure returns (address) {
        bytes32 r;
        bytes32 s;
        uint8 v;

        // Check the signature length
        if (_signature.length != 65) {
            return address(0);
        }

        // Extract the signature parameters
        assembly {
            r := mload(add(_signature, 32))
            s := mload(add(_signature, 64))
            v := and(mload(add(_signature, 65)), 255)
        }

        // EIP-2 still allows signature malleability for ecrecover(). Remove this possibility and make the signature
        // unique. Appendix F in the Ethereum Yellow paper (https://ethereum.github.io/yellowpaper/paper.pdf),
        // defines the signed message hash as the message that is hashed with the prefix
        bytes32 prefixedHash = keccak256(
            abi.encodePacked("\x19Ethereum Signed Message:\n32", _messageHash)
        );

        return ecrecover(prefixedHash, v, r, s);
    }
}
