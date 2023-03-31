require("dotenv").config("./env");
const Web3 = require("web3");
//const abi = require("./project-abi.json");
//const { bytecode } = require("./project-bin"); //gets bytecode from function

const contractJson = require("./build/contracts/MultiSigWallet.json");
const abi = contractJson.abi;
const bytecode = contractJson.bytecode;

// create a new web3 instance using the HTTP provider
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));

// create a new account to deploy the contract from
//const account = web3.eth.accounts.create();

const account = web3.eth.accounts.privateKeyToAccount('26aa9dde9fc31bd5c99bb45a8f9976a42b445334db6d307d9ae208548d913ff2');
web3.eth.defaultAccount = account.address;

// set the account as the default account
//web3.eth.defaultAccount = account.address;

const owner_account = ["0xa93a9357D8aA7F32a9118aa04f3D47f178C2dAa9","0x39f894B642C7649D3750C7A031A5Ee0D4c16779C"]
const private_keys = ['24c53e02c6738d9175c2b55472a03e85a4459ecb39774eb04c18b903a0515c31',
'9f09104efc12d3019d634a3964a7f345f511f5b5285335707594a141549138d6'
] 
// deploy the contract using the compiled bytecode and constructor arguments
const contract = new web3.eth.Contract(abi);
contract.deploy({
  data: bytecode,
  arguments: [
    owner_account,
    2 // required number of confirmations
  ]
}).send({
  from: account.address,
  gas: 4000000
}).then((instance) => {
  console.log(`Contract deployed at address ${instance.options.address}`);
}).catch((error) => {
  console.log(`Failed to deploy contract: ${error}`);
});