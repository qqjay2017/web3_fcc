import { assert, expect } from "chai"
import { deployments, ethers, network } from "hardhat"
import { developmentChains, networkConfig } from "../../help-hardhat-config"
import { Raffle, VRFCoordinatorV2Mock } from "../../typechain-types"

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("Raffle Unit Tests", function () {
      let raffle: Raffle,
        raffleContract: Raffle,
        vrfCoordinatorV2Mock: VRFCoordinatorV2Mock,
        raffleEntranceFee: any,
        interval: any,
        player: any // , deployer
      beforeEach(async () => {
        const accounts = await ethers.getSigners() // could also do with getNamedAccounts
        player = accounts[1]
        await deployments.fixture(["mocks", "raffle"])
        vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock")
        raffleContract = await ethers.getContract("Raffle")
        raffle = raffleContract.connect(player)
        raffleEntranceFee = await raffle.getEntranceFee()
        interval = await raffle.getInterval()
      })
      describe("constructor", async () => {
        it("initializes the raffle correctly", async () => {
          // Ideally, we'd separate these out so that only 1 assert per "it" block
          // And ideally, we'd make this check everything
          const raffleState = (await raffle.getRaffleState()).toString()
          // Comparisons for Raffle initialization:
          console.log(raffleState, "raffleState")
          assert.equal(raffleState, "0")
          console.log(interval.toString(), "interval.toString()")
          assert.equal(
            interval.toString(),
            networkConfig[(network as any).config.chainId]["interval"]
          )
        })
      })
      describe("enterRaffle", async () => {
        it("reverts when you don't pay enough", async () => {
          await expect(raffle.enterRaffle()).to.be.revertedWithCustomError(
            raffle,
            "Raffle__SendMoreToEnterRaffle"
          )
        })
        it("records player when they enter", async () => {
          await raffle.enterRaffle({ value: raffleEntranceFee })
          const contractPlayer = await raffle.getPlayer(0)
          assert.equal(player.address, contractPlayer)
        })
        it("emits event on enter", async () => {
          await expect(
            raffle.enterRaffle({ value: raffleEntranceFee })
          ).to.emit(
            // emits RaffleEnter event if entered to index player(s) address
            raffle,
            "RaffleEnter"
          )
        })
        it("doesn't allow entrance when raffle is calculating", async () => {
          await raffle.enterRaffle({ value: raffleEntranceFee })
          // for a documentation of the methods below, go here: https://hardhat.org/hardhat-network/reference
          await network.provider.send("evm_increaseTime", [
            interval.toNumber() + 1,
          ])
          await network.provider.request({ method: "evm_mine", params: [] })
          // we pretend to be a keeper for a second
          await raffle.performUpkeep([]) // changes the state to calculating for our comparison below
          await expect(
            raffle.enterRaffle({ value: raffleEntranceFee })
          ).to.be.revertedWithCustomError(
            raffle,
            // is reverted as raffle is calculating
            "Raffle__RaffleNotOpen"
          )
        })
      })
    })
