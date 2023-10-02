const {  network } = require("hardhat");
const { verify } = require("../utils/verify");

module.exports = async ({ getNamedAccounts, deployments }) => {
    let {deployer} = (await getNamedAccounts());
    const { deploy, log} = deployments;
    const chainId = network.config.chainId;

    log("---------------------------------------------");
    const args = [];
    const Exchange = await deploy("Exchange", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations : network.config.blockConfirmations || 1
    })

    log("deployed contract!!!.. ");
    log("contract deployed at : ", Exchange.address);

    if (
      chainId == "11155111"
    ) {
        log("Verifying the contract....");
        await verify(Exchange.address, args);
        log("---------------------------------------------");
    }
}

module.exports.tags = ["Exchange", "all"];