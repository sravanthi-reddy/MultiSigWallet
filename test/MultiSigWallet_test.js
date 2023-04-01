const MultiSigWallet = artifacts.require('MultiSigWallet')
require('dotenv').config('./env')

const { expect } = require('chai')

contract('MultiSigWallet', () => {
  let required = 2
  let wallet
  const accounts = [
    '0xFC4E737651e9Ff45b09b3415ad2e9B2489b4eff5',
    '0x34c6823600ae6Ea44d6f07050b2b055E38fD7B80'
  ]

  const owners = [process.env.owner1_address, process.env.owner2_address]
  console.log("owners",owners);
  const private_keys = [process.env.owner1_pk, process.env.owner2_pk]

  //executes once before the test cases start running
  before(async () => {
    required = 2
    wallet = await MultiSigWallet.new(owners, required)
  })

  // one of the owners of the contract should be able to create the transaction
  it('Transaction Creation - Positive - should submit a transaction', async () => {
    const to = accounts[0] // Replace with actual recipient address
    const value = web3.utils.toWei('2', 'ether')
    const data = '0x'
    const abc = await wallet.nonce() //await wallet.getNonce().call();//await wallet.nonce()//contractInstance.methods.nonce().call();
    const nonce = abc.toString()
    console.log('nonce', nonce)
    const ownersContract = await wallet.owners(0)
    console.log('owners of the contract', ownersContract)
    const messageHash = await wallet.getMessageHash(to, value, data, nonce)
    console.log('message info', to, value, data, nonce, messageHash)

    const signature = web3.eth.accounts.sign(messageHash, private_keys[0]) // Replace with actual private key
    const signer = await wallet.recoverSigner(messageHash, signature.signature)
    console.log('signature and signer', signature, signer)
    const receipt = await wallet.submitTransaction(
      to,
      value,
      data,
      signature.signature,
      { from: owners[0], gas: 5000000 }
    )
    console.log('Submit transaction receipt:', receipt)

    initialNonce = nonce
    const finalNonce = await wallet.nonce()

    expect(finalNonce - initialNonce).to.equal(1)

    const transaction = await wallet.transactions(initialNonce)

    expect(transaction.to).to.equal(to)
    expect(parseInt(transaction.value)).to.equal(parseInt(value))
    expect(transaction.data).to.equal(data)
    expect(transaction.executed).to.equal(false)
    expect(parseInt(transaction.nonce)).to.equal(parseInt(initialNonce))
    expect(transaction.confirmations[owners[0]]).to.equal(true)
    expect(transaction.confirmations[owners[1]]).to.equal(false)
    //expect(transaction.confirmations[owners[2]]).to.equal(false);
  })

  // we are creating transaction from non-owner account address
  it('Transaction Creation - Negative  - should not submit a transaction', async () => {
    const to = accounts[0] // Replace with actual recipient address
    const value = web3.utils.toWei('2', 'ether')
    const data = '0x'
    const abc = await wallet.nonce() //await wallet.getNonce().call();//await wallet.nonce()//contractInstance.methods.nonce().call();
    const nonce = abc.toString()
    console.log('nonce', nonce)
    const ownersContract = await wallet.owners(0)
    console.log('owners of the contract', ownersContract)
    const messageHash = await wallet.getMessageHash(to, value, data, nonce)
    console.log('message info', to, value, data, nonce, messageHash)

    const signature = web3.eth.accounts.sign(messageHash, private_keys[0]) // Replace with actual private key
    const signer = await wallet.recoverSigner(messageHash, signature.signature)
    console.log('signature and signer', signature, signer)
    const receipt = await wallet.submitTransaction(
      to,
      value,
      data,
      signature.signature,
      { from: '0xa93a9357D8aA7F32a9118aa04f3D47f178C2dAa9', gas: 5000000 }
    )
    console.log('Submit transaction receipt:', receipt)

    initialNonce = nonce
    const finalNonce = await wallet.nonce()

    expect(finalNonce - initialNonce).to.equal(1)

    const transaction = await wallet.transactions(initialNonce)

    expect(transaction.to).to.equal(to)
    expect(parseInt(transaction.value)).to.equal(parseInt(value))
    expect(transaction.data).to.equal(data)
    expect(transaction.executed).to.equal(false)
    expect(parseInt(transaction.nonce)).to.equal(parseInt(initialNonce))
    expect(transaction.confirmations[owners[0]]).to.equal(true)
    expect(transaction.confirmations[owners[1]]).to.equal(false)
  })

  //one of the owner(who has not confirmed yet) is trying to confirm the transaction 
  it('Transaction Confirmation - Positive - should confirm a transaction', async () => {
    const to = accounts[0]
    const value = web3.utils.toWei('1', 'ether')
    const data = '0x'

    console.log('data', to, value, data, owners[1])
    await wallet.submitTransaction(to, value, data, { from: owners[0] })
    const txId = await wallet.getTransactionCount()

    await wallet.confirmTransaction(txId, { from: owners[1] })

    const transaction = await wallet.transactions(txId)

    assert.isTrue(transaction.executed)
  })

  // already confirmed owner trying to confirm the transaction again
  it('Transaction Confirmation - Duplicate - should not confirm a transaction', async () => {
    const to = accounts[0]
    const value = web3.utils.toWei('1', 'ether')
    const data = '0x'

    console.log('data', to, value, data, owners[1])
    await wallet.submitTransaction(to, value, data, { from: owners[0] })
    const txId = await wallet.getTransactionCount()

    await wallet.confirmTransaction(txId, { from: owners[1] })

    const transaction = await wallet.transactions(txId)

    assert.isTrue(transaction.executed)
  })
  

  
  //non-owner is trying to confirm the transaction
  it('Transaction Confirmation - Positive - should not confirm a transaction', async () => {
    const to = accounts[0]
    const value = web3.utils.toWei('1', 'ether')
    const data = '0x'

    console.log('data', to, value, data, owners[1])
    await wallet.submitTransaction(to, value, data, { from: owners[0] })
    const txId = await wallet.getTransactionCount()

    await wallet.confirmTransaction(txId, { from: owners[1] })

    const transaction = await wallet.transactions(txId)

    assert.isTrue(transaction.executed)
  })
  

  // after confirmined by required owners transaction should automatically executed 
  it('Execute Transaction - Positive - should execute a transaction', async () => {
    // Get an instance of the MultiSig contract

    // Set up the initial transaction data
    const to = accounts[1]
    const value = web3.utils.toWei('1', 'ether') // 1 ETH
    const data = '0x'

    // Add a new transaction
    await wallet.submitTransaction(to, value, data, { from: owners[0] })

    // Get the transaction ID
    const txId = await wallet.getTransactionCount()

    // Sign the transaction

    await wallet.confirmTransaction(txId, { from: owners[1] })

    // Execute the transaction automatically
    
    // Check that the transaction was executed successfully
    expect(finalBalance.toString()).to.equal(
      initialBalance.add(value).toString()
    )
  })

  // approve the transaction only by owner out of 2
  it('Execute Transaction - Negative - should execute a transaction', async () => {
    // Get an instance of the MultiSig contract

    // Set up the initial transaction data
    const to = accounts[1]
    const value = web3.utils.toWei('1', 'ether') // 1 ETH
    const data = '0x'

    // Add a new transaction
    await wallet.submitTransaction(to, value, data, { from: owners[0] })

    // Get the transaction ID
    const txId = await wallet.getTransactionCount()
    // Sign the transaction
    
    // Check that the transaction was executed successfully
    expect(finalBalance.toString()).to.equal(
      initialBalance.add(value).toString()
    )
  })
})

