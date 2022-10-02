import { ConnectButton } from "web3uikit";
export const Header = () => {
  return (
    <div>
      <ConnectButton moralisAuth={false} />
    </div>
  );
};
