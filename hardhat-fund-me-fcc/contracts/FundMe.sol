// SPDX-License-Identifier: MIT
// Pragma
pragma solidity ^0.8.8;
// Import
import "./PriceConverter.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
// Error Codes
error FundMe__NotOwner();

/**
 * @title a contract for crowd  funding
 * @author huang
 * @notice this is demo
 * @dev 1
 */

contract FundMe {
  // Type declarations
  using PriceConverter for uint256;

  // State variables
  mapping(address => uint256) public addressToAmountFunded;
  //  constant 可以省gas
  uint256 public constant MINIMUM_USD = 1 * 1e18;

  address[] public funders;

  address private immutable i_owner;
  AggregatorV3Interface public priceFeed;

  // Modifiers
  modifier onlyOwner() {
    if (msg.sender != i_owner) {
      revert FundMe__NotOwner();
    }

    //  require(msg.sender == i_owner,"Sender is not owner");
    //  下划线指剩余代码
    _;
  }

  constructor(address priceFeedAddress) {
    i_owner = msg.sender;
    priceFeed = AggregatorV3Interface(priceFeedAddress);
  }

  // 捐款
  function fund() public payable {
    require(
      msg.value.getConversionRate(priceFeed) >= MINIMUM_USD,
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

  // https://solidity-by-example.org/fallback/
  receive() external payable {
    fund();
  }

  fallback() external payable {
    fund();
  }
}
