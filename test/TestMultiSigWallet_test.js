const MultiSigWallet = artifacts.require("MultiSigWallet");
const multiSigWalletJson = require('../build/contracts/MultiSigWallet.json');

const { expect } = require("chai");

contract("MultiSigWallet", () => {
  let required = 2
  let wallet;
  let accounts = ['0xFC4E737651e9Ff45b09b3415ad2e9B2489b4eff5', '0x34c6823600ae6Ea44d6f07050b2b055E38fD7B80']; // Replace with actual account addresses

  let owners= ["0xa93a9357D8aA7F32a9118aa04f3D47f178C2dAa9","0x39f894B642C7649D3750C7A031A5Ee0D4c16779C"]
  const private_keys = ['24c53e02c6738d9175c2b55472a03e85a4459ecb39774eb04c18b903a0515c31',
  '9f09104efc12d3019d634a3964a7f345f511f5b5285335707594a141549138d6'
  ] 

  before(async () => {
    //owners = [accounts[0], accounts[1]];
    required = 2;
    wallet = await MultiSigWallet.new(owners, required);
  });

  it("should submit a transaction", async () => {
    const to = accounts[0]; // Replace with actual recipient address
  const value = web3.utils.toWei('2', 'ether');
  const data = '0x';
  const abc = await wallet.nonce();//await wallet.getNonce().call();//await wallet.nonce()//contractInstance.methods.nonce().call();
  const nonce = abc.toString();
  console.log("nonce", nonce)
  const ownersContract = await wallet.owners(0);
  console.log("owners of the contract", ownersContract)
  const messageHash = await wallet.getMessageHash(to, value, data, nonce);
  console.log("message info", to, value, data, nonce, messageHash)

  const signature = web3.eth.accounts.sign(messageHash, private_keys[0]); // Replace with actual private key
  const signer = await wallet.recoverSigner(messageHash, signature.signature);
  console.log("signature and signer", signature, signer)
  const receipt = await wallet.submitTransaction(to, value, data, signature.signature, { from: "0xa93a9357D8aA7F32a9118aa04f3D47f178C2dAa9" ,gas: 5000000});
  console.log('Submit transaction receipt:', receipt);

    initialNonce = nonce;
    const finalNonce = await wallet.nonce();

    expect(finalNonce - initialNonce).to.equal(1);

    const transaction = await wallet.transactions(initialNonce);

    expect(transaction.to).to.equal(to);
    expect(parseInt(transaction.value)).to.equal(parseInt(value));
    expect(transaction.data).to.equal(data);
    expect(transaction.executed).to.equal(false);
    expect(parseInt(transaction.nonce)).to.equal(parseInt(initialNonce));
    expect(transaction.confirmations[owners[0]]).to.equal(true);
    expect(transaction.confirmations[owners[1]]).to.equal(false);
    //expect(transaction.confirmations[owners[2]]).to.equal(false);
  });

  it("should confirm a transaction", async () => {
    const to = accounts[4];
    const value = web3.utils.toWei("1", "ether");
    const data = "0x";

    await multisig.submitTransaction(to, value, data, { from: accounts[1] });
    const txId = await multisig.getTransactionCount();

    await multisig.confirmTransaction(txId, { from: accounts[2] });

    const transaction = await multisig.transactions(txId);

    assert.isTrue(transaction.executed);
  });
  it('should execute a transaction', async () => {
    // Get an instance of the MultiSig contract

    // Set up the initial transaction data
    const to = accounts[1];
    const value = 1000000000000000000; // 1 ETH
    const data = '0x';

    // Add a new transaction
    await multisig.submitTransaction(to, value, data, {from: accounts[0]});

    // Get the transaction ID
    const txId = 0;

    // Sign the transaction
    await multisig.confirmTransaction(txId, {from: accounts[0]});

    // Execute the transaction
    const initialBalance = await web3.eth.getBalance(to);
    await multisig.executeTransaction(txId, {from: accounts[0]});
    const finalBalance = await web3.eth.getBalance(to);

    // Check that the transaction was executed successfully
    expect(finalBalance.toString()).to.equal(initialBalance.add(value).toString());
  });

});
