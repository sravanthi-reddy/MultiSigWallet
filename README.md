# Multisig Wallet

This is a simple implementation of a multisig wallet using [Solidity](https://solidity.readthedocs.io/en/v0.8.7/) and [Web3.js](https://web3js.readthedocs.io/en/v1.5.2/).

## Table of Contents

- [Purpose](#purpose)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Purpose

The purpose of this project is to demonstrate how to create a basic multisig wallet smart contract and interact with it using Web3.js. The multisig wallet allows multiple users to control a single wallet, reducing the risk of a single point of failure or malicious activity.

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
2. Navigate to the project directory using `cd multisig-wallet`.
3. Install the required dependencies by running `npm install`.
4. Compile the smart contracts by running `truffle compile`.
5. Deploy the smart contracts to your local blockchain network by running `truffle migrate`.
6. Start the development server by running `npm start`.

You should now be able to interact with the multi-signature wallet by visiting http://localhost:3000 in your web browser.



## Usage

To use this project, follow these steps:

- Start Ganache.

- Deploy the multisig wallet contract to the Ganache network:
- Run the interact script using `node interact.js`
- run `truffle test` to test the whole smart contract 


This will run the test suite and output the results to the console.

## Functionality
The multisig wallet smart contract allows the following functionality:

- Multiple owners can control the funds
- A certain number of owners' signatures are required to approve a transaction
- Owners can propose a transaction, and other owners can approve or reject it
- The wallet balance can be checked

## Applications
MultiSigWallets can be used in a variety of applications, including:

- Corporate treasury management
- Crowdfunding platforms
- Escrow services
- Joint bank accounts
- Decentralized autonomous organizations (DAOs)
## Future Scope
In the future, we plan to add the following features to the MultiSigWallet:

- Move signature generation off-chain to reduce gas fees.
- Use an oracle to store signatures off-chain.
- Add support for additional token standards such as ERC-721 and ERC-1155.
## Contributing

Contributions to the MultiSigWallet are welcome! If you would like to contribute, please follow these steps:

- Fork the repository.
- Create a new branch for your changes.
- Make your changes and commit them to your branch.
- Submit a pull request.

Please make sure to include a detailed description of the changes you have made and any relevant information about the issue you are addressing. We also ask that you follow the code style guidelines and ensure that all tests pass before submitting your changes.

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).

npm run deploy

