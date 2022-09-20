import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { getNamedAccounts, network } from "hardhat";
import { networkConfig, developmentChains } from "../help-hardhat-config";
const func: DeployFunction = async ({
  deployments,
}: HardhatRuntimeEnvironment) => {
  // code here
  const { deploy, get, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;
  if (!chainId) {
    return false;
  }
  let ethUsdPriceFeedAddress;
  // 本地开发环境
  if (developmentChains.includes(network.name)) {
    const ethUsdAggregator = await get("MockV3Aggregator");
    ethUsdPriceFeedAddress = ethUsdAggregator.address;
  } else {
    ethUsdPriceFeedAddress = networkConfig[chainId].ethUsdPriceFeed;
  }

  log("ethUsdPriceFeedAddress:", ethUsdPriceFeedAddress);
  const fundMe = await deploy("FundMe", {
    from: deployer,
    args: [ethUsdPriceFeedAddress],
    log: true,
  });
  log("---------------");
};
export default func;

module.exports.tags = ["all", "fundme"];
