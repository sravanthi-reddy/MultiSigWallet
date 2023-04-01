const Web3 = require('web3');
const fs = require('fs');

// Set up web3 connection to local Ganache network
//const contractABI = require("./project-abi.json");

const contractJson = require("./build/contracts/MultiSigWallet.json");
const contractABI = contractJson.abi;
//const bytecode = contractJson.bytecode;
const web3 = new Web3(new Web3.providers.HttpProvider(process.env.GANACHE_URL));

// Get contract instance and deployed address
const contractAddress = '0x315Ed58E2625E30d467aB55e0F88A9032A7d1ad1'; // Replace with actual deployed contract address
const contract = new web3.eth.Contract(contractABI, contractAddress);

// Set up accounts to use for testing
const accounts = ['0xFC4E737651e9Ff45b09b3415ad2e9B2489b4eff5', '0x34c6823600ae6Ea44d6f07050b2b055E38fD7B80']; // Replace with actual account addresses

const owner_account = [process.env.owner1_address,process.env.owner2_address]
const private_keys = [process.env.owner1_pk, process.env.owner2_pk] 


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