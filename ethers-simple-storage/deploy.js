const ethers = require("ethers");
const fs = require("fs-extra");
require("dotenv").config();

async function main() {
  // http://127.0.0.1:7545
  const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
  // 私钥
  const encryptedJson = fs.readFileSync("./.encryptKey.json", "utf-8");
  let wallet = new ethers.Wallet.fromEncryptedJsonSync(
    encryptedJson,
    process.env.PRIVATE_KEY_PASSWORD
  );
  wallet = await wallet.connect(provider);
  // const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf8");
  const binary = fs.readFileSync(
    "./SimpleStorage_sol_SimpleStorage.bin",
    "utf8"
  );
  /**
   * 合约工厂
   */
  const contractFactory = new ethers.ContractFactory(abi, binary, wallet);
  console.log("Deploying contract... , please wait...");
  const contract = await contractFactory.deploy();
  await contract.deployTransaction.wait(1);
  const currentFavoriteNumber = await contract.retrieve();
  // 返回一个BigNumber
  console.log("currentFavoriteNumber:", currentFavoriteNumber.toString());

  await contract.store("88888");
  await contract.deployTransaction.wait(1);
  const updateFavoriteNumber = await contract.retrieve();
  // 返回一个BigNumber
  console.log("updateFavoriteNumber:", updateFavoriteNumber.toString());
  /**
   * let's deploy with only transaction data
   */
  // const nonce = await wallet.getTransactionCount();
  // 手动发起交易
  // const tx = {
  //   nonce: nonce,
  //   gasLimit: 1000000,
  //   gasPrice: ethers.utils.parseUnits("1.0", "gwei"),
  //   data: "0x" + binary,
  //   value: 0,
  //   to: null,
  //   chainId: 1337,
  // };
  // const sentTxResponse = await wallet.sendTransaction(tx);
  // await sentTxResponse.wait(1);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
