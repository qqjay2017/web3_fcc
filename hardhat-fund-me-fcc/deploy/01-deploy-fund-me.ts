import { HardhatRuntimeEnvironment } from "hardhat/types"

import { getNamedAccounts, network } from "hardhat"
import { networkConfig, developmentChains } from "../help-hardhat-config"
import { verify } from "../utils/verify"
import { FundMe } from "../typechain-types"
const isDevelopmentChain = developmentChains.includes(network.name)
const func = async ({ deployments }: HardhatRuntimeEnvironment) => {
  // code here
  const { deploy, get, log } = deployments
  const { deployer } = await getNamedAccounts()
  const chainId = network.config.chainId
  if (!chainId) {
    return false
  }
  let ethUsdPriceFeedAddress
  // 本地开发环境
  if (isDevelopmentChain) {
    const ethUsdAggregator = await get("MockV3Aggregator")
    ethUsdPriceFeedAddress = ethUsdAggregator.address
  } else {
    ethUsdPriceFeedAddress = networkConfig[chainId].ethUsdPriceFeed
  }

  log("ethUsdPriceFeedAddress:", ethUsdPriceFeedAddress)
  const args = [ethUsdPriceFeedAddress]
  const fundMe = await deploy("FundMe", {
    from: deployer,
    args: args,
    log: true,
    waitConfirmations: isDevelopmentChain ? undefined : 6,
  })
  if (!isDevelopmentChain && process.env.EHTERSCAN_API_KEY) {
    await verify(fundMe.address, args)
  }
  log("---------------")
  return fundMe
}
export default func

// = ["all", "fundme"];
func.tags = ["all", "fundme"]
