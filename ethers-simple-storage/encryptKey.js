const ethers = require("ethers");
const fs = require("fs-extra");
require("dotenv").config();

async function main() {
  // 使用私钥生成钱包
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY);
  // 使用密码生成钱包json
  const encryptJsonKey = await wallet.encrypt(
    process.env.PRIVATE_KEY_PASSWORD,
    process.env.PRIVATE_KEY
  );
  console.log(encryptJsonKey, "encryptJsonKey");
  fs.writeFileSync("./.encryptKey.json", encryptJsonKey);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
