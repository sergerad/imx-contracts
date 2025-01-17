const hardhat = require('hardhat');
const { ethers } = hardhat;
const { Wallet } = require('@ethersproject/wallet');

/**
 * main deploys a smart contract via a call to the deploySmartContract function. To
 * use this function please ensure your environment file (.env) is configured
 * with the correct values before invoking this script.
 */
async function main() {
    const [deployer] = await ethers.getSigners();
  
    console.log('Deploying Contracts with the account: ', deployer.address);
    console.log('Account Balance: ', (await deployer.getBalance()).toString());

    // Use any logic you want to determine these values
    const owner = process.env.CONTRACT_OWNER_ADDRESS;
    const name = process.env.CONTRACT_NAME;
    const symbol = process.env.CONTRACT_SYMBOL;

    await deploySmartContract(owner, name, symbol, hardhat.network.name);
}

/**
 * deploySmartContract compiles the solidity smart contract from the
 * contracts folder, and then deploys the contract onto one of the
 * nominated networks.
 * 
 * @param {string} owner - The address of the person that owns the contract
 * @param {string} name - Friendly name for the contract
 * @param {string} symbol - Symbol for the contract (e.g. 'GODS')
 * @param {string} network - ropsten or mainnet
 */
async function deploySmartContract(owner, name, symbol, network) {
    // Hard coded to compile and deploy the Asset.sol smart contract.
    const SmartContract = await ethers.getContractFactory('Asset');
    const imxAddress = getIMXAddress(network);
    const smartContract = await SmartContract.deploy(owner, name, symbol, imxAddress);
  
    console.log('Deployed Contract Address:', smartContract.address);

    const privateKey = process.env.DEPLOYER_ROPSTEN_PRIVATE_KEY
    const publicKey = new Wallet(privateKey).publicKey
    console.log('Public Key:', publicKey);
}

/**
 * Returns the IMX address for either network. DO NOT CHANGE these values.
 * @param {string} network - ropsten or mainnent
 * @returns {string} IMX address
 */
function getIMXAddress(network) {
    switch (network) {
        case 'ropsten':
            return '0x4527be8f31e2ebfbef4fcaddb5a17447b27d2aef';
        case 'mainnet':
            return '0x5FDCCA53617f4d2b9134B29090C87D01058e27e9';
    }
    throw Error('Invalid network selected');
}

main()
.then(() => process.exit(0))
.catch((error) => {
    console.error(error);
    process.exit(1);
});
