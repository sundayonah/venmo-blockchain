// const { artifacts } = require("truffle");

// import { artifacts } from "truffle";

const Transactions = artifacts.require("Transactions");

module.exports = function (deployer) {
  deployer.deploy(Transactions);
};
