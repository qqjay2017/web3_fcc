// SPDX-License-Identifier: MIT
// Pragma
pragma solidity ^0.8.8;

import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";

error Raffle_NotEnghtEthEntered();

contract Raffle is VRFConsumerBaseV2 {
  /** State Varibles */
  uint256 private immutable i_entranceFee;
  address payable[] private s_players;

  // 随机数系列
  VRFCoordinatorV2Interface COORDINATOR;

  uint256[] public s_randomWords;
  uint256 public s_requestId;
  /** Events */
  event RaffleEnter(address indexed player);

  modifier onlyOwner() {
    require(msg.sender == s_owner);
    _;
  }

  constructor(address vrfCoordinatorV2, uint256 entranceFee)
    VRFConsumerBaseV2(vrfCoordinatorV2)
  {
    i_entranceFee = entranceFee;
    COORDINATOR = VRFCoordinatorV2Interface(vrfCoordinatorV2);
  }

  function enterRaffle() public payable {
    if (msg.value < i_entranceFee) {
      revert Raffle_NotEnghtEthEntered();
    }
    s_players.push(payable(msg.sender));
    emit RaffleEnter(msg.sender);
  }

  function pickRandomWinner() external {}

  // Assumes the subscription is funded sufficiently.
  function requestRandomWords() external onlyOwner {
    // Will revert if subscription is not set and funded.
    s_requestId = COORDINATOR.requestRandomWords(
      keyHash,
      s_subscriptionId,
      requestConfirmations,
      callbackGasLimit,
      numWords
    );
  }

  function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords)
    internal
    override
  {
    s_randomWords = randomWords;
  }

  function getEntranceFee() public view returns (uint256) {
    return i_entranceFee;
  }

  function getPlayers(uint256 index) public view returns (address) {
    return s_players[index];
  }
}
