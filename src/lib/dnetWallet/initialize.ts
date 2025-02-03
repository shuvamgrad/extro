import { registerWallet } from "./register";
import { SecureWallet } from "./wallet";

export function initialize(): void {
  registerWallet(new SecureWallet());
}
