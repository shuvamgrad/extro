import type {
  SendOptions,
  Transaction,
  TransactionSignature,
  VersionedTransaction,
} from "@solana/web3.js";
import type { PublicKey } from "@solana/web3.js";

export interface DnetWalletEvents {
  connect(...args: unknown[]): unknown;
  disconnect(...args: unknown[]): unknown;
  accountChanged(newPublicKey: PublicKey): unknown;
}

export interface DnetWalletEventEmitter {
  on<E extends keyof DnetWalletEvents>(
    event: E,
    listener: DnetWalletEvents[E],
    context?: any
  ): void;
  off<E extends keyof DnetWalletEvents>(
    event: E,
    listener: DnetWalletEvents[E],
    context?: any
  ): void;
}

export interface Dnet extends DnetWalletEventEmitter {
  isDnet?: boolean;
  publicKey?: { toBytes(): Uint8Array };
  isConnected: boolean;
  signTransaction<T extends Transaction | VersionedTransaction>(
    transaction: T
  ): Promise<T>;
  signAllTransactions<T extends Transaction | VersionedTransaction>(
    transactions: T[]
  ): Promise<T[]>;
  signAndSendTransaction<T extends Transaction | VersionedTransaction>(
    transaction: T,
    options?: SendOptions
  ): Promise<{ signature: TransactionSignature }>;
  signMessage(message: Uint8Array): Promise<{ signature: Uint8Array }>;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
}
