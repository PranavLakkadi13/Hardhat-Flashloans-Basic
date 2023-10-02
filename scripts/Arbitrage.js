const {ethers, getNamedAccounts} = require("hardhat");

async function Arbitrage() {
    const { deployer } = await getNamedAccounts();
    
    const daiAddress = "0xFF34B3d4Aee8ddCd6F9AFFFB6Fe49bD371b8a357";
    const usdcAddress = "0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8";
    const exchange = "0x08a681D79a2B43D37cF644AB5f2167281A045e34";
    const flashLoanArbitrageContractAddress = "0xf107cc3250fc9946461EdD14295EAF27f3b87a63";

    const DAI = await ethers.getContractAt("IERC20", daiAddress, deployer);
    const USDC = await ethers.getContractAt("IERC20", usdcAddress, deployer);
    const Exchange = await ethers.getContractAt("Exchange", exchange, deployer);
    const ArbitrageContract = await ethers.getContractAt("FlashLoanArbitrage", flashLoanArbitrageContractAddress, deployer);

    // aprove token to make a initail deposit into the DEX
    console.log("Approving the token to DEX")
    const approveDAIforExchange = await DAI.approve(Exchange.address,ethers.utils.parseEther("1501"));
    const approveUSDCforExchange = await USDC.approve(Exchange.address, "1501000000");
    console.log("Approved the tokens ")

    // tranfer the minimum deposit into the DEX to keep it liquid
    console.log("Transfering the tokens to DEX to keep minimum liquidity");
    const transferDAIintoDEX = await Exchange.depositDAI(ethers.utils.parseEther("1500"));
    const tranferUSDCintoDEX = await Exchange.depositUSDC("1500000000");
    console.log("Liquidity added....");

    // approving the Arbitrage contract the tokens for swap
    console.log("arbitrage contract approving the token to DEX") 
    const approveDAIforDEX = await ArbitrageContract.approveUSDC("1200000000");
    const approveUSDCforDEX = await ArbitrageContract.approveDAI(ethers.utils.parseEther("1101"));
    console.log("Approved the tokens ");

    console.log("THe balance of the tokens in arbitrage contract before loan");
    const balanceofDAIP = await ArbitrageContract.getBalance(daiAddress);
    console.log(balanceofDAIP.toString());
    const balanceofUSDCP = await ArbitrageContract.getBalance(usdcAddress);
    console.log(balanceofUSDCP.toString);

    const requestFlashloan = await ArbitrageContract.requestFlashLoan(usdcAddress, "1000000000");
    await requestFlashloan.wait(1);

    console.log("balance of tokens after the arbitrage");
    const balanceofDAI = await ArbitrageContract.getBalance(daiAddress);
    console.log(balanceofDAI.toString());
    const balanceofUSDC = await ArbitrageContract.getBalance(usdcAddress);
    console.log(balanceofUSDC.toString);
    
}

Arbitrage().then(() => process.exit(0)).catch((error) => {
    console.log(error)
    process.exit(1)
});