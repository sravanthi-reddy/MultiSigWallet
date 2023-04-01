# Multi Signature Wallet

This is a simple implementation of a multisig wallet using [Solidity](https://solidity.readthedocs.io/en/v0.8.7/) and [Web3.js](https://web3js.readthedocs.io/en/v1.5.2/).

![Alt text](./images/MultiSig.jpg?raw=true)

## Table of Contents

- [Purpose](#purpose)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)


## Purpose

The purpose of this project is to demonstrate how to create a basic multisig wallet smart contract and interact with it using Web3.js. The multisig wallet allows multiple users to control a single wallet, reducing the risk of a single point of failure or malicious activity.

- [Github Repo](https://github.com/sravanthi-reddy/MultiSigWallet)
## Prerequisites

### For Users

To use this multi-signature wallet, you will need:

- A compatible web3-enabled browser such as Google Chrome with the MetaMask extension installed.
- Knowledge of how to use MetaMask to interact with the Ethereum network.
- Access to the Ethereum network, either through a local node or a public node such as Infura.
- Ether or other ERC-20 tokens to send and receive.

### For Developers

To understand and modify the code of this multi-signature wallet, you will need:

- A basic understanding of Solidity programming language and smart contracts.
- Knowledge of digital signatures and how they work.
- Node.js installed on your machine.
- Truffle Suite installed on your machine.
- Access to a development blockchain network such as Ganache.
- Git installed on your machine to clone and contribute to the repository.

### Setting up the Environment

Once you have installed the prerequisites, follow these steps to set up the development environment:

1. Clone this repository to your local machine using `git clone  https://github.com/sravanthi-reddy/MultiSigWallet.git`.
2. Navigate to the project directory using `cd MutliSignatureWallet`.
3. Install the required dependencies by running `npm install`.
4. Take some account address and private keys from Ganache and pass it to the code when deploying or testing the application
5. Compile the smart contracts by running `truffle compile`.
6. Deploy the smart contracts to your local blockchain network by running `node deploy`.
7. Interact with the blcokchain using `node interact.js`.
8. Test the cases using `truffle test`
9. For linting the code use `npx solhint .\contracts\MultiSigWallet.sol`

## Deisgn 
#### Major things to consider while designing Multi Signature Wallet
##### Access control: 
The multisig wallet contract should have clear rules about who can access the wallet and who can approve transactions. Typically, the contract specifies a list of authorized addresses that can approve transactions.

##### Threshold: 
The contract should specify the number of approvals required for a transaction to be executed. This is usually set to a number that is less than or equal to the total number of authorized addresses.

##### Security: 
The contract should be designed to prevent unauthorized access and protect against attacks. Common security measures include using secure coding practices, testing the contract extensively before deploying it, and auditing the contract regularly.

## Usage

To use this project, follow these steps:

- Start Ganache.
- `truffle compile`
- Deploy the multisig wallet contract to the Ganache network using `node deploy.js`
- Run the interact script using `node interact.js`
- run `truffle test` to test the whole smart contract

This will run the test suite and output the results to the console.

## Functionality

The multisig wallet smart contract allows the following functionality:

- Multiple owners can control the funds
- A certain number of owners' signatures are required to approve a transaction
- Owners can propose a transaction, and other owners can approve or reject it
- The wallet balance can be checked

## Prevention against Security Attacks
#### Reentrancy Attack 
As we are using nonce while generating verifying signatures then bad actors can not use the 
same signature for approving different transaction

#### Private accessibility
Once the approval count is reached then transaction automatically executes and  there is accessibility to executeTransaction methods which may lead to security attacks. To prevent such attacks executeTransaction method is private and called by another method.

## Ways to Optimize Gas Fee
#### Issue with on-chain
If a Multi signature wallet required approval of 100 owners out of 200 owners then that 100 owners need to initite another transaction only to approve the main transaction which costs a gas fee. If you 100 users paying the gas fee then it is not efficient solution.
#### Off-chain storage
Using off-chain storage to receive and store those 100 signatures using Oracle and Chainlink. Once we have 100 signatures ready then we can do some computation and send this data to on-chain for signature verification. this way, all owners together are only paying one time trasaction fee to approve and execute the transaction

## Applications

MultiSigWallets can be used in a variety of applications, including:

- Corporate treasury management
- Crowdfunding platforms
- Escrow services
- Joint bank accounts
- Decentralized autonomous organizations (DAOs)


## Future Scope

Currently, signature generation is performed on-chain, which can be expensive in terms of gas fees. To reduce these costs, we can move signature generation off-chain while still keeping signature verification on-chain. This will require the use of an oracle to store the signatures off-chain.
This will allow the owners to save on gas fees while still maintaining the security and integrity of the wallet.

To implement this feature, we can follow these steps:

- Modify the existing smart contract to emit an event with the transaction details, such as recipient address, amount, and data, when a transaction is submitted.

- Set up an oracle to listen to these events and generate the signature off-chain using the private key of the required owner(s).

- Once the signature is generated, the oracle can store the signature off-chain, along with the transaction details.

- Modify the existing smart contract to add a new function to accept off-chain signatures from the oracle. This function should verify the signature and execute the transaction if the required number of signatures have been received.

- Update the user interface to show the status of off-chain signatures and transactions.
  Some resources to explore for off-chain signature storage using an oracle include:

- [Chainlink](https://chain.link/) - A decentralized oracle network that can be used to securely connect smart contracts to off-chain data and systems.
- OpenZeppelin Defender: A platform for managing the security of smart contracts that includes a feature for managing the signing and execution of transactions off-chain
- [How to Build a Chainlink Oracle on Ethereum](https://trufflesuite.com/tutorials/how-to-build-a-chainlink-oracle-on-ethereum)
- [Building a Decentralized Oracle with Chainlink](https://medium.com/swlh/building-a-decentralized-oracle-with-chainlink-5b91a5b49737)

## Contributing

Contributions to the MultiSigWallet are welcome! If you would like to contribute, please follow these steps:

- Fork the repository.
- Create a new branch for your changes.
- Make your changes and commit them to your branch.
- Submit a pull request.

Please make sure to include a detailed description of the changes you have made and any relevant information about the issue you are addressing. We also ask that you follow the code style guidelines and ensure that all tests pass before submitting your changes.

### References
https://www.coindesk.com/tech/2020/11/10/multisignature-wallets-can-keep-your-coins-safer-if-you-use-them-right/

