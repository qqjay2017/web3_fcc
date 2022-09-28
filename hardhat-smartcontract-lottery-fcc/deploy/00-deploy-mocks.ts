import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import { ethers, getNamedAccounts, network } from "hardhat"
import {
  DECIMALS,
  developmentChains,
  INITIAL_ANSWER,
} from "../help-hardhat-config"
// 请求vft需要的link
const BASE_FEE = ethers.utils.parseEther("0.25")
// link per gas
const GAS_PRICE_LINK = "1000000000"
const func: DeployFunction = async ({
  deployments,
}: HardhatRuntimeEnvironment) => {
  const { deploy, log } = deployments
  const { deployer, player } = await getNamedAccounts()
  const chainId = network.config.chainId
  const args = [BASE_FEE, GAS_PRICE_LINK]

  if (developmentChains.includes(network.name)) {
    log("local network detected! deploying mocks")

    await deploy("VRFCoordinatorV2Mock", {
      from: deployer,
      args: args,
      log: true,
    })
    log("Mocks Deployed!")
    log("---------------------------------------------")
  }
}

export default func
