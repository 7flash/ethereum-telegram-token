const HDWalletProvider = require('truffle-hdwallet-provider');
const fs = require("fs");
const path = require("path");
const solc = require("solc");
const Web3 = require("web3");

const config = require('./config.json');

const network = config.mainnet ? "https://mainnet.infura.io" : "https://ropsten.infura.io";
const web3 = new Web3(new HDWalletProvider(config.serviceMnemonic, network));

const sources = {
  'Manager.sol': fs.readFileSync(path.resolve(__dirname, 'Manager.sol')).toString(),
  'ERC20.sol': fs.readFileSync(path.resolve(__dirname, 'ERC20.sol')).toString(),
  'Ownable.sol': fs.readFileSync(path.resolve(__dirname, 'Ownable.sol')).toString()
}

const output = solc.compile({ sources }, 1);

const bytecode = output.contracts['Manager.sol:Manager'].bytecode;
const abi = output.contracts['Manager.sol:Manager'].interface;

const Manager = new web3.eth.Contract(JSON.parse(abi), '0x79f9483ed12bd606e756bb704285ef1817048b3e', {
  from: config.serviceAddress,
  gas: config.gas,
  gasPrice: config.gasPrice
});

Promise.resolve().then((instance) => {
  instance = Manager;
  console.log(`Address: ${instance.options.address}`);

  instance.methods.changeDailyLimit(config.dailyLimit).send().then(result => {
    console.log(`Tx: ${result.transactionHash}`);

    return instance.methods.transferOwnership(config.ownerAddress).send().then(result => {
      console.log(`Tx: ${result.transactionHash}`);
    });
  })
})

fs.writeFile(path.resolve(__dirname, 'Manager.abi'), abi, {}, (error, result) => {
  if(error) return console.error(error);

  console.log(`Manager.abi <== ABI saved here`);
});