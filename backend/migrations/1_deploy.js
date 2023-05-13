// const { artifacts } = require("truffle");

// import { artifacts } from "truffle"

const MIgrations = artifacts.require("Migrations")

module.exports = function (deployer) {
    deployer.deploy(MIgrations)
}
