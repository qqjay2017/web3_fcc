import { ethers, run, network } from "hardhat"
export async function verify(contractAddress: string, args: any) {
  console.log("verify contract ", contractAddress, args)
  try {
    await run("verify:verify", {
      address: contractAddress,

      constructorArguments: args,
    })
  } catch (e) {
    console.log(e, "合同校验失败")
  }
}
