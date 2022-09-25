import { ethers } from "./ethers-5.6.esm.min.js";

const connectButton = document.getElementById("connectButton");
connectButton.onclick = connect;
const fundButton = document.getElementById("fundButton");
fundButton.onclick = () => {
  fund();
};

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

async function fund(ethAmount) {
  if (typeof window.ethereum !== "undefined") {
    //
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    console.log(signer);
  }
}
async function withDraw() {}
