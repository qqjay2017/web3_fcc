import { assert, expect } from "chai"
import { deployments, ethers, getNamedAccounts, network } from "hardhat"
import { FundMe, MockV3Aggregator } from "../../typechain-types"
import { developmentChains } from "../../help-hardhat-config"

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("FundMe", async () => {
      let fundMe: FundMe

      let deployer
      let mockV3Aggregator: MockV3Aggregator
      const sendValue = ethers.utils.parseEther("10")

      beforeEach(async function () {
        // const accounts = await ethers.getSigners();
        deployer = (await getNamedAccounts()).deployer

        await deployments.fixture()

        fundMe = await ethers.getContract("FundMe", deployer)
        mockV3Aggregator = await ethers.getContract(
          "MockV3Aggregator",
          deployer
        )
      })
      describe("constructor", async () => {
        it("sets the aggregator address", async () => {
          // 价格获取器
          const response = await fundMe.getPriceFeed()
          assert(response, mockV3Aggregator.address)
        })
      })
      describe("fund", async () => {
        // 转账金额是否足够
        // https://ethereum-waffle.readthedocs.io/en/latest/matchers.html
        // could also do assert.fail
        it("Fails if you don't send enough ether", async () => {
          await expect(fundMe.fund()).to.be.revertedWith("Didn't send enough!")
        })
        it("Update the amount funded data structure", async () => {
          await fundMe.fund({
            value: sendValue,
          })
          const response = await fundMe.getAddressToAmountFunded(deployer)
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
          const response = await fundMe.getFunder(0)
          assert.equal(response, deployer)
        })
      })

      describe("withdraw", async () => {
        beforeEach(async () => {
          await fundMe.fund({
            value: sendValue,
          })
        })
        it("withdraw ETH from a single founder", async () => {
          // Arrange
          const startingFundMeBalance = await ethers.provider.getBalance(
            fundMe.address
          )
          const startingDeployerBalance = await fundMe.provider.getBalance(
            deployer
          )
          // Act
          const transactionResponse = await fundMe.withdraw()
          const transactionReceipt = await transactionResponse.wait(1)
          const { gasUsed, effectiveGasPrice } = transactionReceipt
          // 消耗的gas
          const gasCost = gasUsed.mul(effectiveGasPrice)
          const endingFundMeBalance = await fundMe.provider.getBalance(
            fundMe.address
          )
          const endingDeployerBalance = await fundMe.provider.getBalance(
            deployer
          )
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
        it("alow us to withdraw with multiple funders", async () => {
          const accounts = await ethers.getSigners()
          for (let i = 0; i < 6; i++) {
            const fundMeConnectedContract = await fundMe.connect(accounts[i])
            await fundMeConnectedContract.fund({
              value: sendValue,
            })
          }
          const startingFundMeBalance = await ethers.provider.getBalance(
            fundMe.address
          )
          const startingDeployerBalance = await fundMe.provider.getBalance(
            deployer
          )
          // Act
          // const transactionResponse = await fundMe.withdraw()
          const transactionResponse = await fundMe.withdraw()
          const transactionReceipt = await transactionResponse.wait(1)
          const { gasUsed, effectiveGasPrice } = transactionReceipt
          const gasCost = gasUsed.mul(effectiveGasPrice)
          const endingFundMeBalance = await fundMe.provider.getBalance(
            fundMe.address
          )
          const endingDeployerBalance = await fundMe.provider.getBalance(
            deployer
          )
          // Assert
          assert.equal(endingFundMeBalance.toString(), "0")
          //
          assert.equal(
            startingFundMeBalance.add(startingDeployerBalance).toString(),
            endingDeployerBalance.add(gasCost).toString()
          )
          await expect(fundMe.getFunder(0)).to.be.reverted
          for (let i = 0; i < 6; i++) {
            const balance = await fundMe.getAddressToAmountFunded(
              accounts[i].address
            )
            assert.equal(balance.toString(), "0")
          }
        })
        it("only alow owner to withdraw", async () => {
          const accounts = await ethers.getSigners()
          // const attacker =
          const fundMeConnectedContract = await fundMe.connect(accounts[1])
          await expect(
            fundMeConnectedContract.withdraw()
            // 测试自定义错误
          ).to.be.revertedWithCustomError(
            fundMeConnectedContract,
            "FundMe__NotOwner"
          )
        })
      })

      describe("cheaperWithdraw", async () => {
        beforeEach(async () => {
          await fundMe.fund({
            value: sendValue,
          })
        })
        it("cheaperWithdraw ETH from a single founder", async () => {
          // Arrange
          const startingFundMeBalance = await ethers.provider.getBalance(
            fundMe.address
          )
          const startingDeployerBalance = await fundMe.provider.getBalance(
            deployer
          )
          // Act
          const transactionResponse = await fundMe.cheaperWithdraw()
          const transactionReceipt = await transactionResponse.wait(1)
          const { gasUsed, effectiveGasPrice } = transactionReceipt
          // 消耗的gas
          const gasCost = gasUsed.mul(effectiveGasPrice)
          const endingFundMeBalance = await fundMe.provider.getBalance(
            fundMe.address
          )
          const endingDeployerBalance = await fundMe.provider.getBalance(
            deployer
          )
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
        it("alow us to cheaperWithdraw with multiple funders", async () => {
          const accounts = await ethers.getSigners()
          for (let i = 0; i < 6; i++) {
            const fundMeConnectedContract = await fundMe.connect(accounts[i])
            await fundMeConnectedContract.fund({
              value: sendValue,
            })
          }
          const startingFundMeBalance = await ethers.provider.getBalance(
            fundMe.address
          )
          const startingDeployerBalance = await fundMe.provider.getBalance(
            deployer
          )
          // Act
          // const transactionResponse = await fundMe.withdraw()
          const transactionResponse = await fundMe.cheaperWithdraw()
          const transactionReceipt = await transactionResponse.wait(1)
          const { gasUsed, effectiveGasPrice } = transactionReceipt
          const gasCost = gasUsed.mul(effectiveGasPrice)
          const endingFundMeBalance = await fundMe.provider.getBalance(
            fundMe.address
          )
          const endingDeployerBalance = await fundMe.provider.getBalance(
            deployer
          )
          // Assert
          assert.equal(endingFundMeBalance.toString(), "0")
          //
          assert.equal(
            startingFundMeBalance.add(startingDeployerBalance).toString(),
            endingDeployerBalance.add(gasCost).toString()
          )
          await expect(fundMe.getFunder(0)).to.be.reverted
          for (let i = 0; i < 6; i++) {
            const balance = await fundMe.getAddressToAmountFunded(
              accounts[i].address
            )
            assert.equal(balance.toString(), "0")
          }
        })
        it("only alow owner to cheaperWithdraw", async () => {
          const accounts = await ethers.getSigners()
          // const attacker =
          const fundMeConnectedContract = await fundMe.connect(accounts[1])
          await expect(
            fundMeConnectedContract.cheaperWithdraw()
            // 测试自定义错误
          ).to.be.revertedWithCustomError(
            fundMeConnectedContract,
            "FundMe__NotOwner"
          )
        })
      })
    })
