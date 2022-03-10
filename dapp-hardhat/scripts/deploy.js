const { ethers } = require("hardhat");
require("dotenv").config({ path: ".env" });
const { WHITELIST_CONTRACT_ADDRESS, METADATA_URL } = require("../constants");

let contractAddress;

async function main() {
  // Address of the whitelist contract that you deployed in the previous module
  const whitelistContract = WHITELIST_CONTRACT_ADDRESS;
  // URL from where we can extract the metadata for a Crypto Dev NFT
  const metadataURL = METADATA_URL;
  /*
  A ContractFactory in ethers.js is an abstraction used to deploy new smart contracts,
  so cryptoDevsContract here is a factory for instances of our CryptoDevs contract.
  */
  const cryptoDevsContract = await ethers.getContractFactory("CryptoDevs");

  // deploy the contract
  const deployedCryptoDevsContract = await cryptoDevsContract.deploy(
    metadataURL,
    whitelistContract
  );

  // print the address of the deployed contract
  console.log(
    "Crypto Devs Contract Address:",
    deployedCryptoDevsContract.address
  );

  contractAddress = deployedCryptoDevsContract.address;

  saveAbi();
  saveContractAddress();
}

function saveAbi() {
  const fs = require("fs");

  const abiDir = __dirname + "/../../dapp-frontend/constants";

  if (!fs.existsSync(abiDir)) {
    fs.mkdirSync(abiDir);
  }

  const artifact = artifacts.readArtifactSync("CryptoDevs");

  fs.writeFileSync(
    abiDir + "/CryptoDevs.json",
    JSON.stringify(artifact, null, 2)
  );
}

function saveContractAddress() {
  const fs = require("fs");

  const abiDir = __dirname + "/../../dapp-frontend/constants";

  if (!fs.existsSync(abiDir)) {
    fs.mkdirSync(abiDir);
  }

  const data = `export const NFT_CONTRACT_ADDRESS = "${contractAddress}";`;

  fs.writeFileSync(abiDir + "/contract.js", data);
}

// Call the main function and catch if there is any error
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
