import { useEffect } from "react";
import { useMoralis } from "react-moralis";
import { getShortAccount } from "../utils/getShortAccount";
export default function ManualHeader() {
  const {
    enableWeb3,
    isWeb3Enabled,
    account,
    Moralis,
    deactivateWeb3,
    isWeb3EnableLoading,
  } = useMoralis();

  useEffect(() => {
    if (isWeb3Enabled) {
      return;
    }
    if (typeof window !== "undefined") {
      if (window.localStorage.getItem("connected")) {
        enableWeb3();
      }
    }
  }, [isWeb3Enabled, enableWeb3]);

  useEffect(() => {
    Moralis.onAccountChanged((_) => {
      if (_ === null) {
        window.localStorage.removeItem("connected");
        deactivateWeb3();
      } else {
        window.localStorage.setItem("connected", "inject");
      }
    });
  }, [Moralis]);
  return (
    <div>
      {account ? (
        <div>
          {getShortAccount({
            value: account,
          })}
        </div>
      ) : (
        <button
          disabled={isWeb3EnableLoading}
          onClick={async () => {
            await enableWeb3();
          }}
        >
          enableWeb3
        </button>
      )}
    </div>
  );
}
