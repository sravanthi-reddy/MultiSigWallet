require('dotenv').config('./env')
const Web3 = require('web3')

const contractJson = require('./build/contracts/MultiSigWallet.json')
const abi = contractJson.abi
const bytecode = contractJson.bytecode

// create a new web3 instance using the HTTP provider
const web3 = new Web3(new Web3.providers.HttpProvider(process.env.GANACHE_URL))

// create a new account to deploy the contract from
const account = web3.eth.accounts.privateKeyToAccount(process.env.deployer_pk)

// set the account as the default account
web3.eth.defaultAccount = account.address

//assign some owner account and corresponding private keys from ganache
const owner_account = [process.env.owner1_address, process.env.owner2_address]

// deploy the contract using the compiled bytecode and constructor arguments
const contract = new web3.eth.Contract(abi)
contract
  .deploy({
    data: bytecode,
    arguments: [
      owner_account,
      2 // required number of confirmations
    ]
  })
  .send({
    from: account.address,
    gas: 4000000
  })
  .then((instance) => {
    console.log(`Contract deployed at address ${instance.options.address}`)
  })
  .catch((error) => {
    console.log(`Failed to deploy contract: ${error}`)
  })
