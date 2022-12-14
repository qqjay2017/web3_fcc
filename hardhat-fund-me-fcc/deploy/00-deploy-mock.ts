import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import { getNamedAccounts, network } from "hardhat"
import {
  DECIMALS,
  developmentChains,
  INITIAL_ANSWER,
} from "../help-hardhat-config"
const func: DeployFunction = async ({
  deployments,
}: HardhatRuntimeEnvironment) => {
  // code here
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()
  const chainId = network.config.chainId
  console.log(network.name, chainId, "network.name")

  // developmentChains.includes(network.name)
  if (chainId == 31337) {
    console.log("Localhost network detected, Deploy mocks...")

    await deploy("MockV3Aggregator", {
      contract: "MockV3Aggregator",
      from: deployer,
      args: [DECIMALS, INITIAL_ANSWER],
      log: true,
    })
    console.log("Mock deployed")
    log("-----------------------------------------------")
  }
}
export default func

// TODO tags是啥意思?
func.tags = ["all", "mocks"]
// module.exports.tags = ["all", "mocks"];
