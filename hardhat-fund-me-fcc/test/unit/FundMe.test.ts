import { assert } from "chai";
import { deployments, ethers, getNamedAccounts } from "hardhat";
import { FundMe, MockV3Aggregator } from "../../typechain-types";
describe("FundMe", async () => {
  let fundMe: FundMe;
  let deployer;
  let mockV3Aggregator: MockV3Aggregator;
  beforeEach(async function () {
    // const accounts = await ethers.getSigners();
    deployer = (await getNamedAccounts()).deployer;

    await deployments.fixture(["all"]);

    fundMe = await ethers.getContract("FundMe", deployer);
    mockV3Aggregator = await ethers.getContract("MockV3Aggregator", deployer);
  });
  describe("constructor", async () => {
    it("sets the aggregator address", async () => {
      const response = await fundMe.priceFeed();

      assert(response, mockV3Aggregator.address);
    });
  });
});
