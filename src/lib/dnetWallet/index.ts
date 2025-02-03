import DnetWalletAdapter from "./adapter";
import { initialize } from "./initialize";
import SecureWallet from "./wallet";

function getBaseWallet(): SecureWallet {
  return new SecureWallet();
}

export {
  SecureWallet as DnetWallet,
  DnetWalletAdapter,
  initialize,
  getBaseWallet,
};
