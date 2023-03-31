// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MultiSigWallet {
    uint256 public nonce;
    uint256 public required;
    
    mapping(address => bool) public isOwner;
    address[] public owners;

    struct Transaction {
        address to;
        uint256 value;
        bytes data;
        bool executed;
        uint256 nonce;
        mapping(address => bool) confirmations;
    }

    mapping(uint256 => Transaction) public transactions;

    event Confirmation(address indexed sender, uint256 indexed transactionId);
    event Execution(uint256 indexed transactionId);
    event Deposit(address indexed sender, uint256 value);

    modifier onlyOwner() {
        require(isOwner[msg.sender], "Not an owner");
        _;
    }

    constructor(address[] memory _owners, uint256 _required) {
        require(_owners.length > 0, "Owners required");
        require(_required > 0 && _required <= _owners.length, "Invalid requirement");

        for (uint256 i = 0; i < _owners.length; i++) {
            address owner = _owners[i];
            require(owner != address(0), "Invalid owner address");
            require(!isOwner[owner], "Duplicate owner");

            isOwner[owner] = true;
            owners.push(owner);
        }

        required = _required;
    }

    function deposit() external payable {
        emit Deposit(msg.sender, msg.value);
    }

  function submitTransaction(address _to, uint256 _value, bytes memory _data, bytes memory _signature) external  onlyOwner  {
        require(_to != address(0), "Invalid recipient address");

        emit TransactionSubmitted(_to, _value, _data, nonce);

        bytes32 messageHash = getMessageHash(_to, _value, _data, nonce);

        address signer = recoverSigner(messageHash, _signature);

        //return signer;

        require(isOwner[signer], "Invalid signature");

        Transaction storage newTransaction = transactions[nonce];
        newTransaction.to = _to;
        newTransaction.value = _value;
        newTransaction.data = _data;
        newTransaction.executed = false;
        newTransaction.nonce = nonce;

        newTransaction.confirmations[signer] = true;

        emit Confirmation(signer, nonce);

        nonce++;
    }

    function confirmTransaction(uint256 _id) public onlyOwner {
        Transaction storage transaction = transactions[_id];

        require(!transaction.executed, "Transaction already executed");
        require(!transaction.confirmations[msg.sender], "Transaction already confirmed by owner");

        transaction.confirmations[msg.sender] = true;

        emit Confirmation(msg.sender, _id);
        
        // if (isConfirmed(_id)) {
        //     executeTransaction(_id);
        // }
    }

    function executeTransaction(uint256 _id) public onlyOwner { //make it private
        Transaction storage transaction = transactions[_id];

        require(isConfirmed(_id), "Transaction not confirmed by required number of owners");
        require(!transaction.executed, "Transaction already executed");

        transaction.executed = true;

        (bool success, ) = transaction.to.call{value: transaction.value}(transaction.data);
        require(success, "Transaction execution failed");

        emit Execution(_id);
    }
    function isConfirmed(uint256 _id) public view returns (bool) { //make it private
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
    // function getMessageHash(address _to, uint256 _value, bytes memory _data, uint256 _nonce) public view returns (bytes32) {
    //     return keccak256(abi.encodePacked(address(this), _to, _value, _data, _nonce));
    // }

    event TransactionSubmitted(address indexed to, uint256 value, bytes data, uint256 nonce);

       

    function getMessageHash(address _to, uint256 _value, bytes memory _data, uint256 _nonce) public view returns (bytes32) {
        bytes32 messageHash = keccak256(
            abi.encodePacked(
                "\x19Ethereum Signed Message:\n32",
                keccak256(
                    abi.encode(
                        address(this),
                        _to,
                        _value,
                        _data,
                        _nonce
                    )
                )
            )
        );
        return messageHash;
    }


    // function recoverSigner(bytes32 _hash, bytes memory _signature) public pure returns (address) {
    //     require(_signature.length == 65, "Invalid signature length");

    //     bytes32 r;
    //     bytes32 s;
    //     uint8 v;

    //     assembly {
    //         r := mload(add(_signature, 32))
    //         s := mload(add(_signature, 64))
    //         v := and(mload(add(_signature, 65)), 255)
    //     }

    //     if (v < 27) {
    //         v += 27;
    //     }

    //     require(v == 27 || v == 28, "Invalid signature v value");

    //     return ecrecover(_hash, v, r, s);
    // }

    function recoverSigner(bytes32 _messageHash, bytes memory _signature)
    public
    pure
    returns (address)
{
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
    bytes32 prefixedHash = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", _messageHash));

    return ecrecover(prefixedHash, v, r, s);
}

}
