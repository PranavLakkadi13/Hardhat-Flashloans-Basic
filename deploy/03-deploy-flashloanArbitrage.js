const {  network } = require("hardhat");
const { verify } = require("../utils/verify");

module.exports = async ({ getNamedAccounts, deployments }) => {
    let {deployer} = (await getNamedAccounts());
    const { deploy, log} = deployments;
    const chainId = network.config.chainId;

    log("---------------------------------------------");
    const args = ["0x012bAC54348C0E635dCAc9D5FB99f06F24136C9A"];
    const FlashLoanArbitrage = await deploy("FlashLoanArbitrage", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations : network.config.blockConfirmations || 1
    })

    log("deployed contract!!!.. ");
    log("contract deployed at : ", FlashLoanArbitrage.address);

    if (
      chainId == "11155111"
    ) {
        log("Verifying the contract....");
        await verify(FlashLoanArbitrage.address, args);
        log("---------------------------------------------");
    }
}

module.exports.tags = ["flashLoanArbitrage", "all"];