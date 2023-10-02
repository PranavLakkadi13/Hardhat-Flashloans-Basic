const {ethers,network, getChainId} = require("hardhat");
const {verify} = require("../utils/verify");

module.exports = async ({getNamedAccounts,deployments}) => {
    const {deploy,log} = deployments;
    const {deployer} = await getNamedAccounts();
    const chainId = network.config.chainId;

    const flashloan = await deploy("FlashLoan", {
        from: deployer,
        args: ["0x012bAC54348C0E635dCAc9D5FB99f06F24136C9A"],
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    });

    log("contract deployed at: ", flashloan.address);

    if (chainId == "11155111") {
        log("The contract is being verified.....");
        await verify(flashloan.address,["0x012bAC54348C0E635dCAc9D5FB99f06F24136C9A"]);
    }
}