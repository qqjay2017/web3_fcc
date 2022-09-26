// SPDX-License-Identifier: MIT
// Pragma
pragma solidity ^0.8.8;

import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
// import "@chainlink/contracts/src/v0.8/interfaces/KeeperCompatibleInterface.sol";
import "hardhat/console.sol";

error Raffle__SendMoreToEnterRaffle();
error Raffle_TransferFailed();

/**@title A sample Raffle Contract
 * @author Patrick Collins
 * @notice This contract is for creating a sample raffle contract
 * @dev This implements the Chainlink VRF Version 2
 */

contract Raffle is VRFConsumerBaseV2 {
  /* Type declarations */
  // enum RaffleState {
  //   OPEN,
  //   CALCULATING
  // }
  /** State Varibles */
  // Chainlink VRF Variables
  VRFCoordinatorV2Interface private immutable i_vrfCoordinator;
  uint64 private immutable i_subscriptionId;
  bytes32 private immutable i_gasLane;
  uint32 private immutable i_callbackGasLimit;
  uint16 private constant REQUEST_CONFIRMATIONS = 3;
  uint32 private constant NUM_WORDS = 1;
  // Lottery Variables
  // uint256 private immutable i_interval;
  uint256 private immutable i_entranceFee;
  uint256 private s_lastTimeStamp;
  address private s_recentWinner;
  address payable[] private s_players;
  // RaffleState private s_raffleState;

  /** Events */
  event RaffleEnter(address indexed player);
  event RequestRaffleWinner(uint256 indexed requestId);
  event WinnerPicked(address indexed winner);

  constructor(
    address vrfCoordinatorV2,
    uint256 entranceFee,
    bytes32 gasLane,
    uint64 subscriptionId,
    uint32 callbackGasLimit
  ) VRFConsumerBaseV2(vrfCoordinatorV2) {
    i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinatorV2);
    i_entranceFee = entranceFee;
    i_gasLane = gasLane;
    i_subscriptionId = subscriptionId;
    i_callbackGasLimit = callbackGasLimit;
  }

  function enterRaffle() public payable {
    if (msg.value < i_entranceFee) {
      revert Raffle__SendMoreToEnterRaffle();
    }
    s_players.push(payable(msg.sender));
    emit RaffleEnter(msg.sender);
  }

  function pickRandomWinner() external {}

  function requestRandomWinner() external {
    uint256 requestId = i_vrfCoordinator.requestRandomWords(
      i_gasLane,
      i_subscriptionId,
      REQUEST_CONFIRMATIONS,
      i_callbackGasLimit,
      NUM_WORDS
    );
    emit RequestRaffleWinner(requestId);
  }

  function fulfillRandomWords(
    uint256, /**requestId */
    uint256[] memory randomWords
  ) internal override {
    uint256 indexOfWinner = randomWords[0] % s_players.length;
    address payable recentWinner = s_players[indexOfWinner];
    s_recentWinner = recentWinner;
    (bool success, ) = recentWinner.call{value: address(this).balance}("");
    if (!success) {
      revert Raffle_TransferFailed();
    }
    emit WinnerPicked(recentWinner);
  }

  /** Getter Functions */

  function getPlayers(uint256 index) public view returns (address) {
    return s_players[index];
  }

  function getNumWords() public pure returns (uint256) {
    return NUM_WORDS;
  }

  function getRequestConfirmations() public pure returns (uint256) {
    return REQUEST_CONFIRMATIONS;
  }

  function getRecentWinner() public view returns (address) {
    return s_recentWinner;
  }

  function getPlayer(uint256 index) public view returns (address) {
    return s_players[index];
  }

  function getLastTimeStamp() public view returns (uint256) {
    return s_lastTimeStamp;
  }

  // function getInterval() public view returns (uint256) {
  //   return i_interval;
  // }

  function getEntranceFee() public view returns (uint256) {
    return i_entranceFee;
  }

  function getNumberOfPlayers() public view returns (uint256) {
    return s_players.length;
  }
}
