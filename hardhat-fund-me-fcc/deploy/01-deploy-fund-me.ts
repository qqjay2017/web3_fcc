import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { getNamedAccounts, network } from "hardhat";
import { networkConfig, developmentChains } from "../help-hardhat-config";
import { verify } from "../utils/verify";
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
  const args = [ethUsdPriceFeedAddress];
  const fundMe = await deploy("FundMe", {
    from: deployer,
    args: args,
    log: true,
    waitConfirmations: 6,
  });
  if (
    !developmentChains.includes(network.name) &&
    process.env.EHTERSCAN_API_KEY
  ) {
    await verify(fundMe.address, args);
  }
  log("---------------");
};
export default func;

// module.exports.tags = ["all", "fundme"];
// export const tags = ["all", "fundme"];
