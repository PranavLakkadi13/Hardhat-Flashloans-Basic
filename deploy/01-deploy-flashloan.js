const {ethers,network} = require("hardhat");
const {PoolAddressProvider} = require("../helper-hardhat-config");


module.exports = async ({getNamedAccounts,deployments}) => {
    const {deploy,log} = deployments;
    const {deployer} = await getNamedAccounts();

    const args = [PoolAddressProvider];

    const flashloan = await deploy("FlashLoan", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    });
}