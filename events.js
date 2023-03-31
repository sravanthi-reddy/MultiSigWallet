const Web3 = require('web3');
const fs = require('fs');

// Set up web3 connection to local Ganache network
//const contractABI = require("./project-abi.json");

const contractJson = require("./build/contracts/MultiSigWallet.json");
const contractABI = contractJson.abi;
//const bytecode = contractJson.bytecode;

const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));

// Get contract instance and deployed address
const contractAddress = '0x315Ed58E2625E30d467aB55e0F88A9032A7d1ad1'; // Replace with actual deployed contract address
const contract = new web3.eth.Contract(contractABI, contractAddress);

// Set up accounts to use for testing
const accounts = ['0xFC4E737651e9Ff45b09b3415ad2e9B2489b4eff5', '0x34c6823600ae6Ea44d6f07050b2b055E38fD7B80']; // Replace with actual account addresses

const owner_account = ["0x447696dc3d738C9aaB05AE7Dc5722416395836bb","0x24892C8a7dE1B627a3Fe6c9C6864Cca8c872E6cF","0x970cfE70F007a74a06ad09E54dB6473E970cC02c"]
const private_keys = ['8fc455e80bce04d522919be1f4c2e3e37add739084a00d875f718e24efe90f1a',
'00533f667db87eb7aa45bd149831b67d08cec6f03bf66747928266ef8cb3a3e4',
'dba98ef6d2223d5cb63d49aa8c1c5a4733eb48772351b9233d8133efe5a260a4'
] 

//Listens to FoodItemAdded event and logs the information
//Only way to know what is happening in txns
//No console logs in solidity as they are expensive

contract.events.Deposit()
  .on('data', event => {
    console.log(`Deposit event received: ${JSON.stringify(event.returnValues)}`);
  })
  .on('error', error => {
    console.error(`Error while listening for Deposit event: ${error}`);
  });

  contract.events.Confirmation({ fromBlock: "latest" })
  .on("data", function (event) {
    console.log("Confirmation event:", event.returnValues);
  })
  .on("error", console.error);

  contract.events.Execution({ fromBlock: "latest" })
  .on("data", function (event) {
    console.log("Execution event:", event.returnValues);
  })
  .on("error", console.error);

  contract.events.Deposit({ fromBlock: "latest" })
  .on("data", function (event) {
    console.log("Deposit event:", event.returnValues);
  })
  .on("error", console.error);

contract.events.TransactionSubmitted({ fromBlock: "latest" })
  .on("data", function (event) {
    console.log("TransactionSubmitted event:", event.returnValues);
  })
  .on("error", console.error);