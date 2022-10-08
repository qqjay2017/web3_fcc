import { readFileSync, writeFileSync } from "fs"
import { ethers, network } from "hardhat"
import { DeployFunction } from "hardhat-deploy/types"

const FONT_END_ADDRESS_FILE =
  "../nextjs-smartcontract-lottery-fcc/constants/contractAddress.json"
const FONT_END_ABI_FILE =
  "../nextjs-smartcontract-lottery-fcc/constants/abi.json"
const func: DeployFunction = async () => {
  if (process.env.UPDATE_FRONT_END) {
    updateContractAddress()
    updateAbi()
  }
}

async function updateContractAddress() {
  const raffle = await ethers.getContract("Raffle")
  // const currentAddress = raffle.address;
  const chainId = network.config.chainId?.toString() || ""
  const currentAddress = JSON.parse(readFileSync(FONT_END_ADDRESS_FILE, "utf8"))
  if (chainId in currentAddress) {
    if (!currentAddress[chainId].includes(raffle.address)) {
      currentAddress[chainId].push(raffle.address)
    }
  } else {
    currentAddress[chainId] = [raffle.address]
  }
  writeFileSync(FONT_END_ADDRESS_FILE, JSON.stringify(currentAddress))
}
async function updateAbi() {
  const raffle = await ethers.getContract("Raffle")
  writeFileSync(
    FONT_END_ABI_FILE,
    raffle.interface.format(ethers.utils.FormatTypes.json) + ""
  )
}
func.tags = ["all", "frontend"]
export default func
