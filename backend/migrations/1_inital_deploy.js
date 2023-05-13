const MIgrations = artifacts.require("Migratios")

module.exports = function (deployer) {
    deployer.deploy(MIgrations)
}
