import { ethers, getNamedAccounts } from "hardhat"
import { FundMe } from "../typechain-types"

async function main() {
  const deployer = (await getNamedAccounts()).deployer

  const fundMe: FundMe = await ethers.getContract("FundMe", deployer)
  console.log("withdraw...")
  const transactionResponse = await fundMe.withdraw()
  await transactionResponse.wait(1)
  console.log("withdraw!")
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
