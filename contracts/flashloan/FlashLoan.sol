// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;

import {FlashLoanSimpleReceiverBase} from "@aave/core-v3/contracts/flashloan/base/FlashLoanSimpleReceiverBase.sol";
import {IPoolAddressesProvider} from "@aave/core-v3/contracts/interfaces/IPoolAddressesProvider.sol";
import {IERC20} from "@aave/core-v3/contracts/dependencies/openzeppelin/contracts/IERC20.sol";

contract FlashLoan is FlashLoanSimpleReceiverBase {

    address payable owner; 

    constructor(address _addressProvider) 
    FlashLoanSimpleReceiverBase(IPoolAddressesProvider(_addressProvider)) {
        owner = payable(msg.sender);
    }

    // This function we have taken as instructed by the AAVE Docs
    // 
    // Here we approving the aave contract to permission to withdraw the amount of asset 
    // with premium after the function is done executing 
    //  
    function executeOperation(
        address asset, 
        uint256 amount, 
        uint256 premium,
        address /* initiator */,
        bytes calldata /* params */) 
        external override returns (bool) {
            // we already have the loan amount now we can add the custom logic 

            uint256 amountOwed = amount + premium;
            IERC20(asset).approve(address(POOL), amountOwed);

            return true;
        }

    function requestFlashloan(address _asset, uint256 _amount) public {
        address receiverAddress = address(this);
        address asset = _asset;
        uint256 amount = _amount;
        bytes memory params = "";
        uint16 referralCode = 0;

        POOL.flashLoanSimple(receiverAddress, asset, amount, params, referralCode);
    }

    function getBalance(address _tokenAddress) public view returns (uint256) {
        return IERC20(_tokenAddress).balanceOf(address(this));
    }

    function withdraw(address _tokenAddress) external {
        IERC20 token = IERC20(_tokenAddress);
        token.transfer(payable(owner), token.balanceOf(address(this)));
    }

    receive() external payable {}
}