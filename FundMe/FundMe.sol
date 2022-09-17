// SPDX-License-Identifier: MIT

pragma solidity ^0.8.8;

import "./PriceConverter.sol";

error NotOwner();

contract FundMe {
    using PriceConverter for uint256;
    // 1 usd
    //  constant 可以省gas
    uint256 public constant MINIMUM_USD = 1 * 1e18;

    address[] public funders;
    mapping(address => uint256) public addressToAmountFunded;

    address public immutable i_owner;

    constructor() {
        i_owner = msg.sender;
    }

    // 捐款
    function fund() public payable {
        require(
            msg.value.getConversionRate() >= MINIMUM_USD,
            "Didn't send enough!"
        );
        funders.push(msg.sender);
        addressToAmountFunded[msg.sender] = msg.value;
    }

    // 提现
    function withdraw() public onlyOwner {
        for (
            uint256 funderIndex = 0;
            funderIndex < funders.length;
            funderIndex = funderIndex + 1
        ) {
            address funder = funders[funderIndex];
            addressToAmountFunded[funder] = 0;
        }
        funders = new address[](0);
        // https://solidity-by-example.org/sending-ether/
        // transer
        //  payable(msg.sender ).transfer(address(this).balance);

        // send
        //  bool sendSuccess =  payable(msg.sender ).send(address(this).balance);
        //  require(sendSuccess,"Send Failed");

        // call
        (bool callSuccess, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(callSuccess, "Send Failed");
    }

    modifier onlyOwner() {
        if (msg.sender == i_owner) {
            revert NotOwner();
        }

        //  require(msg.sender == i_owner,"Sender is not owner");
        //  下划线指剩余代码
        _;
    }

    // https://solidity-by-example.org/fallback/
    receive() external payable {
        fund();
    }

    fallback() external payable {
        fund();
    }
}
