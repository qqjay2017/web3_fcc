import { assert, expect } from "chai"
import { deployments, ethers, getNamedAccounts } from "hardhat"
import { FundMe, MockV3Aggregator } from "../../typechain-types"
describe("FundMe", async () => {
  let fundMe: FundMe

  let deployer
  let mockV3Aggregator: MockV3Aggregator
  const sendValue = ethers.utils.parseEther("10")
  console.log(sendValue.toString(), "sendValue")
  beforeEach(async function () {
    // const accounts = await ethers.getSigners();
    deployer = (await getNamedAccounts()).deployer

    await deployments.fixture()

    fundMe = await ethers.getContract("FundMe", deployer)
    mockV3Aggregator = await ethers.getContract("MockV3Aggregator", deployer)
  })
  describe("constructor", async () => {
    it("sets the aggregator address", async () => {
      // 价格获取器
      const response = await fundMe.priceFeed()

      assert(response, mockV3Aggregator.address)
    })
  })
  describe("fund", async () => {
    // 转账金额是否足够
    // https://ethereum-waffle.readthedocs.io/en/latest/matchers.html
    // could also do assert.fail
    it("Fails if you don't send enough ether", async () => {
      await expect(fundMe.fund()).to.be.revertedWith(
        "you need to spend more eth"
      )
    })
    it("Update the amount funded data structure", async () => {
      await fundMe.fund({
        value: sendValue,
      })
      const response = await fundMe.addressToAmountFunded(deployer)
      console.log(
        response.toString(),
        sendValue.toString(),
        "转账金额和账户余额"
      )
      assert.equal(response.toString(), sendValue.toString())
    })
    it("adds funder to array of funders", async () => {
      await fundMe.fund({
        value: sendValue,
      })
      const response = await fundMe.funders(0)
      assert.equal(response, deployer)
    })
  })

  describe("withdraw", async () => {
    beforeEach(async () => {
      await fundMe.fund({
        value: sendValue,
      })
    })
    it("Withdraw ETH from a single founder", async () => {
      // Arrange
      const startingFundMeBalance = await ethers.provider.getBalance(
        fundMe.address
      )
      const startingDeployerBalance = await fundMe.provider.getBalance(deployer)
      // Act
      const transactionResponse = await fundMe.withdraw()
      const transactionReceipt = await transactionResponse.wait(1)
      const { gasUsed, effectiveGasPrice } = transactionReceipt
      // 消耗的gas
      const gasCost = gasUsed.mul(effectiveGasPrice)
      const endingFundMeBalance = await fundMe.provider.getBalance(
        fundMe.address
      )
      const endingDeployerBalance = await fundMe.provider.getBalance(deployer)
      // Assert
      // 提取后,账户余额应该为0
      assert.equal(endingFundMeBalance.toString(), "0")
      //
      assert.equal(
        startingFundMeBalance.add(startingDeployerBalance).toString(),
        endingDeployerBalance.add(gasCost).toString()
      )
      // assert.equal(
      //   startingFundMeBalance.sub(endingFundMeBalance).toString(),
      //   sendValue.toString()
      // )
    })
  })
})
