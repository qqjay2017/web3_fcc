import { ethers } from "./ethers-5.6.esm.min.js";
import { abi, contractAddress } from "./constants.js";
const connectButton = document.getElementById("connectButton");
connectButton.onclick = connect;
const fundButton = document.getElementById("fundButton");
fundButton.onclick = () => {
  fund();
};

const balanceButton = document.getElementById("balanceButton");
balanceButton.onclick = getBalance;
const withdrawButton = document.getElementById("withdrawButton");
withdrawButton.onclick = withdraw;
async function connect() {
  if (typeof window.ethereum !== "undefined") {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    console.log(accounts, "accounts");
    connectButton.innerHTML = "Connected";
  } else {
    connectButton.innerHTML = "please install metamask";
    console.log("no metamask");
  }
}

async function fund() {
  const ethAmount = document.getElementById("EthAmount").value;
  if (typeof window.ethereum !== "undefined") {
    //
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    try {
      const transactionResponse = await contract.fund({
        value: ethers.utils.parseEther(ethAmount),
      });
      console.log(transactionResponse, "transactionResponse");
      await listenForTransactionMine(transactionResponse, provider);
    } catch (error) {
      console.log(error, "error");
    }
  }
}
async function getBalance() {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const balance = await provider.getBalance(contractAddress);
    console.log(ethers.utils.formatEther(balance), "balance");
  }
}
async function withdraw() {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    try {
      const transactionResponse = await contract.withdraw();
      await listenForTransactionMine(transactionResponse, provider);
    } catch (error) {
      console.log(error, "withdraw error");
    }
  }
}

async function listenForTransactionMine(transactionResponse, provider) {
  return new Promise((resolve, reject) => {
    console.log(`Mining ${transactionResponse.hash}`);
    provider.once(transactionResponse.hash, (transactionReceipt) => {
      console.log(
        transactionReceipt.confirmations,
        "transactionReceipt.confirmations"
      );
      resolve();
    });
  });
}
