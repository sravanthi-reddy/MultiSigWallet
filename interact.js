const Web3 = require('web3');
const fs = require('fs');

// Set up web3 connection to local Ganache network
//const contractABI = require("./project-abi.json");

const contractJson = require("./build/contracts/MultiSigWallet.json");
const contractABI = contractJson.abi;
//const bytecode = contractJson.bytecode;

const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));

// Get contract instance and deployed address
const contractAddress = '0x652E9F4629605ad265aeb394E1E7F7CbD425E12D'; // Replace with actual deployed contract address
const contractInstance = new web3.eth.Contract(contractABI, contractAddress);

// Set up accounts to use for testing
const accounts = ['0xFC4E737651e9Ff45b09b3415ad2e9B2489b4eff5', '0x34c6823600ae6Ea44d6f07050b2b055E38fD7B80']; // Replace with actual account addresses

const owner_account = ["0xa93a9357D8aA7F32a9118aa04f3D47f178C2dAa9","0x39f894B642C7649D3750C7A031A5Ee0D4c16779C"]
const private_keys = ['24c53e02c6738d9175c2b55472a03e85a4459ecb39774eb04c18b903a0515c31',
'9f09104efc12d3019d634a3964a7f345f511f5b5285335707594a141549138d6'
] 
// Test the deposit function
const deposit = async () => {
  const sender = accounts[0];
  const value = web3.utils.toWei('1', 'ether');
  const receipt = await contractInstance.methods.deposit().send({ from: sender, value: value });
  console.log('Deposit receipt:', receipt);
};

// Test the submitTransaction function
const submitTransaction = async () => {
  const to = accounts[0]; // Replace with actual recipient address
  const value = web3.utils.toWei('2', 'ether');
  const data = '0x';
  const nonce = await contractInstance.methods.nonce().call();
  const messageHash = await contractInstance.methods.getMessageHash(to, value, data, nonce).call();
  const signature = web3.eth.accounts.sign(messageHash, private_keys[0]); // Replace with actual private key
  const receipt = await contractInstance.methods.submitTransaction(to, value, data, signature.signature).send({ from: owner_account[0] ,gas: 500000});
  console.log('Submit transaction receipt:', receipt);
};

const getTransactions = async (transactionIndex) => {
  contractInstance.methods.transactions(transactionIndex).call()
  .then(transaction => {
    console.log('Transaction:', transaction);
  })
  .catch(error => {
    console.error('Error:', error);
  });
  //console.log('Submit transaction receipt:', receipt);
};

// Test the confirmTransaction function
const confirmTransaction = async (transactionId, owner_address) => {
  const receipt = await contractInstance.methods.confirmTransaction(transactionId).send({ from: owner_address, gas: 5000000});
  console.log('Confirm transaction receipt:', receipt);
};

const getIsOwner = async (address) => {
  console.log( await contractInstance.methods.isOwner(address).call());
}

const isConfirmed = async (id) => {
  console.log( await contractInstance.methods.isConfirmed(id).call());
}


// Call the `required` variable of your smart contract
const getRequired = async() => {
  console.log( await contractInstance.methods.required().call());
}

// Test the executeTransaction function
const executeTransaction = async (transactionId) => {
  //const transactionId = 0; // Replace with actual transaction ID
  const receipt = await contractInstance.methods.executeTransaction(transactionId).send({ from: owner_account[0], gas: 5000000});
  console.log('Execute transaction receipt:', receipt);
};

async function interactIsConfirmed(transactionId) {
  try {
    const confirmed = await contractInstance.methods.isConfirmed(transactionId).call();
    console.log(`Transaction ${transactionId} is confirmed: ${confirmed}`);
    return confirmed;
  } catch (error) {
    console.error(error);
  }
}

// Test all functions
(async () => {
  await submitTransaction();
 // await getTransactions(2);
 // await getIsOwner('0x39f894B642C7649D3750C7A031A5Ee0D4c16779C');
  //await getRequired();
 //await isConfirmed(1);
 // await interactIsConfirmed(0)

// await confirmTransaction(1,owner_account[1] )
  //await executeTransaction(1);

})();


