import { ethers, run, network } from "hardhat"
import "@nomiclabs/hardhat-etherscan"
async function main() {
    const SimpleStorage = await ethers.getContractFactory("SimpleStorage")
    console.log("Deploying contract")
    const simpleStorage = await SimpleStorage.deploy()
    await simpleStorage.deployed()

    console.log(`deployed to ${simpleStorage.address}`)
    if (network.config.chainId !== 31337 && !!process.env.EHTERSCAN_API_KEY) {
        await simpleStorage.deployTransaction.wait(6)
        await verify(simpleStorage.address, [])
    }
    const currentValue = await simpleStorage.retrieve()
    console.log(`current Value is: ${currentValue}`)

    const transactionResponse = await simpleStorage.store(42)
    await transactionResponse.wait(1)
    const updateValue = await simpleStorage.retrieve()
    console.log(`updateValue is ${updateValue}`)
}

async function verify(contractAddress: string, args: any) {
    console.log("verify contract ", contractAddress, args)
    try {
        await run("verify:verify", {
            address: contractAddress,
            contractArguments: args,
        })
    } catch (e) {
        console.log(e, "error")
    }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
