import { task } from "hardhat/config"

export const blockNumberTask = (() => {
    task("block-number", "Print the current block number").setAction(
        async (taskArgs, hre) => {
            const blockNumber = await hre.ethers.provider.getBlockNumber()
            console.log(`Current block number: ${blockNumber}`)
        }
    )
})()
