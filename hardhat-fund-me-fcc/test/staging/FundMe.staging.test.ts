import { assert, expect } from "chai"
import { deployments, ethers, getNamedAccounts, network } from "hardhat"
import { FundMe, MockV3Aggregator } from "../../typechain-types"

import { developmentChains } from "../../help-hardhat-config"

developmentChains.includes(network.name)
  ? describe.skip
  : describe("FundMe", async function () {
      let fundMe: FundMe

      let deployer
      let mockV3Aggregator: MockV3Aggregator
      const sendValue = ethers.utils.parseEther("0.1")

      beforeEach(async function () {
        deployer = (await getNamedAccounts()).deployer

        fundMe = await ethers.getContract("FundMe", deployer)
      })
      it("allows people to fund and withdraw", async function () {
        this.timeout(9999999)
        const fundTxResponse = await fundMe.fund({
          value: sendValue,
        })

        const withdrawTxResponse = await fundMe.withdraw()

        const endingFundMeBalance = await fundMe.provider.getBalance(
          fundMe.address
        )

        assert.equal(endingFundMeBalance.toString(), "0")
      })
    })
