import { useWeb3Contract } from "react-moralis";
import { abi, contractAddress } from "../constants";
import { useMoralis } from "react-moralis";
import { useEffect, useMemo, useState } from "react";
import { ethers } from "ethers";
import { useNotification } from "web3uikit";
export const LotteryEntrance = () => {
  const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
  const [entranceFee, setEntranceFee] = useState("0");
  const [numberOfPlayers, setNumberOfPlayers] = useState("0");
  const [recentWinner, setRecentWinner] = useState(null);
  const dispatch = useNotification();

  let chainId = parseInt(chainIdHex || "");
  console.log(chainId, "chainId");

  const raffleAddress =
    chainId && chainId in contractAddress
      ? (contractAddress as any)[chainId][0]
      : null;

  const { runContractFunction: enterRaffle } = useWeb3Contract({
    contractAddress: raffleAddress,
    abi: abi,
    functionName: "enterRaffle",
    params: {},
    msgValue: entranceFee,
  });
  const { runContractFunction: getEntranceFee } = useWeb3Contract({
    contractAddress: raffleAddress,
    abi: abi,
    functionName: "getEntranceFee",
    params: {},
  });

  const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
    contractAddress: raffleAddress,
    abi: abi,
    functionName: "getNumberOfPlayers",
    params: {},
  });

  const { runContractFunction: getRecentWinner } = useWeb3Contract({
    contractAddress: raffleAddress,
    abi: abi,
    functionName: "getRecentWinner",
    params: {},
  });

  const updateUI = async () => {
    const entranceFeeFromContract: any = await getEntranceFee();

    const numberOfPlayersFromCall: any = await getNumberOfPlayers();
    const recentPlayerFromCall: any = await getRecentWinner();
    setNumberOfPlayers(numberOfPlayersFromCall.toString());
    setEntranceFee(entranceFeeFromContract.toString());
    setRecentWinner(recentPlayerFromCall.toString());
  };

  useEffect(() => {
    if (!raffleAddress) {
      return;
    }
    if (isWeb3Enabled) {
      updateUI();
    }
  }, [isWeb3Enabled, getEntranceFee, raffleAddress]);
  const handleNewNotification = async (tx: any) => {
    dispatch({
      type: "info",
      title: "Transaction Notification",
      message: "Transaction complete!",

      icon: undefined,
      position: "topR",
    });
  };
  const handleSuccess = async (tx: any) => {
    await tx.wait(1);
    handleNewNotification(tx);
    updateUI();
  };
  const handleError = (error: any) => {
    console.log(error, "error");
  };

  return (
    <div>
      {raffleAddress ? (
        <h1>
          <div>
            <button
              onClick={async function () {
                await enterRaffle({
                  onSuccess: handleSuccess,
                  onError: handleError,
                });
              }}
            >
              enter raffle
            </button>
          </div>
          EntranceFee : {ethers.utils.formatUnits(entranceFee, "ether")} ETH
          <div>numberOfPlayers: {JSON.stringify(numberOfPlayers)}</div>
          <div>recentWinner: {JSON.stringify(recentWinner)}</div>
        </h1>
      ) : (
        <h1> No Raffle Address Deteched</h1>
      )}
    </div>
  );
};
