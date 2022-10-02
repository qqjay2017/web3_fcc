import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import { ethers, getNamedAccounts, network } from "hardhat"
import {
  DECIMALS,
  developmentChains,
  INITIAL_ANSWER,
  networkConfig,
} from "../help-hardhat-config"
import {
  VRFConsumerBaseV2,
  VRFCoordinatorV2Mock,
  VRFCoordinatorV2Mock__factory,
} from "../typechain-types"
import { verify } from "../utils/verify"

const VRF_SUB_FUND_AMOUNT = ethers.utils.parseEther("30")

const func: DeployFunction = async ({
  deployments,
}: HardhatRuntimeEnvironment) => {
  const { deploy, log } = deployments
  const { deployer, player } = await getNamedAccounts()
  const chainId = network.config.chainId

  if (!chainId) {
    return
  }
  const currentNetworkConfig = networkConfig[chainId]
  if (!currentNetworkConfig) {
    return
  }
  let vRFCoordinatorV2Address, subscriptionId
  if (developmentChains.includes(network.name)) {
    const vRFCoordinatorV2Mock: VRFCoordinatorV2Mock = await ethers.getContract(
      "VRFCoordinatorV2Mock"
    )
    vRFCoordinatorV2Address = vRFCoordinatorV2Mock.address
    const transactionResponse = await vRFCoordinatorV2Mock.createSubscription()
    const transactionReceipt = await transactionResponse.wait(1)
    subscriptionId = transactionReceipt.events?.[0].args?.subId

    await vRFCoordinatorV2Mock.fundSubscription(
      subscriptionId,
      VRF_SUB_FUND_AMOUNT
    )
  } else {
    vRFCoordinatorV2Address = currentNetworkConfig.vrfCoordinatorV2
    subscriptionId = currentNetworkConfig.subscriptionId
  }
  const args = [
    vRFCoordinatorV2Address,
    currentNetworkConfig.entranceFee,
    currentNetworkConfig.gasLane,
    subscriptionId,
    currentNetworkConfig.callbackGasLimit,
    currentNetworkConfig.interval,
  ]
  const raffle = await deploy("Raffle", {
    from: deployer,
    args: args,
    log: true,
    waitConfirmations: 1,
  })
  if (
    !developmentChains.includes(network.name) &&
    process.env.EHTERSCAN_API_KEY
  ) {
    log("verifying...")
    await verify(raffle.address, args)
  }
  log("Enter lottery with command:")
  const networkName = network.name == "hardhat" ? "localhost" : network.name
  log(`yarn hardhat run scripts/enterRaffle.js --network ${networkName}`)
  log("----------------------------------------------------")
}
func.tags = ["all", "raffle"]
export default func
