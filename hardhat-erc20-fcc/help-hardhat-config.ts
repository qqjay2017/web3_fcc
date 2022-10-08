import { ethers } from "hardhat"

export const networkConfig: Record<
  number,
  {
    name: string
    ethUsdPriceFeed?: string
    vrfCoordinatorV2?: string
    gasLane?: string
    interval?: string
    subscriptionId?: string | number
    callbackGasLimit?: string | number
    entranceFee?: any
  }
> = {
  31337: {
    name: "localhost",
    ethUsdPriceFeed: "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e",
    vrfCoordinatorV2: "0x2Ca8E0C643bDe4C2E08ab1fA0da3401AdAD7734D",
    entranceFee: ethers.utils.parseEther("0.01"),
    gasLane:
      "0x79d3d8832d904592c0bf9818b621522c988bb8b0c05cdc3b15aea1b6e8db0c15",
    subscriptionId: 2505,
    callbackGasLimit: "500000",
    interval: "50",
  },
  // Price Feed Address, values can be obtained at https://docs.chain.link/docs/reference-contracts
  5: {
    name: "goerli",
    ethUsdPriceFeed: "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e",
    vrfCoordinatorV2: "0x2Ca8E0C643bDe4C2E08ab1fA0da3401AdAD7734D",
    entranceFee: ethers.utils.parseEther("0.01"),
    gasLane:
      "0x79d3d8832d904592c0bf9818b621522c988bb8b0c05cdc3b15aea1b6e8db0c15",
    subscriptionId: 2505,
    callbackGasLimit: "500000",
    interval: "50",
  },
}

export const developmentChains = ["hardhat", "localhost"]

export const DECIMALS = 8
export const INITIAL_ANSWER = 100000000
