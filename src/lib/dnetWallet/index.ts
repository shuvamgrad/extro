import DnetWallet from "./wallet";
import DnetWalletAdapter from "./adapter";
import { initialize } from "./initialize";


function getBaseWallet(): DnetWallet {
  return new DnetWallet();
}


export { DnetWallet, DnetWalletAdapter, initialize, getBaseWallet };
