const Migrations = artifacts.require.require("Migrations");

module.exports = function (deployer) {
  deployer.deploy(Migrations);
};
