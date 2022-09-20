import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

import "hardhat-gas-reporter";
import "solidity-coverage";
import "hardhat-deploy";
import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();
const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL || "";
const PRIVATE_KEY = process.env.PRIVATE_KEY || "";
const EHTERSCAN_API_KEY = process.env.EHTERSCAN_API_KEY || "";
const COINMARKETCAP_KEY = process.env.COINMARKETCAP_KEY || "";

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.17",
      },
      {
        version: "0.6.6",
      },
    ],
  },
  defaultNetwork: "hardhat",
  namedAccounts: {
    deployer: {
      default: 0,
    },
    simpleERC20Beneficiary: 1,
  },
  networks: {
    // defaultNetwork: "hardhat",
    goerli: {
      url: GOERLI_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 5,
    },
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: {
      goerli: EHTERSCAN_API_KEY,
    },
    customChains: [
      {
        network: "goerli",
        chainId: 5,

        urls: {
          apiURL: "http://api-goerli.etherscan.io/api", // https => http
          browserURL: "https://goerli.etherscan.io/",
        },
      },
    ],
  },
  gasReporter: {
    enabled: false,
    outputFile: "gas-report.txt",
    noColors: true,
    currency: "USD",
    coinmarketcap: COINMARKETCAP_KEY,
    // token: "MATIC",
  },
};

export default config;
