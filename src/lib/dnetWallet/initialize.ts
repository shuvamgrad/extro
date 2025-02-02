import { registerWallet } from './register';
import { DnetWallet } from './wallet';


export function initialize(): void {
  registerWallet(new DnetWallet());
}
