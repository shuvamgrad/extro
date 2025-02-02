import type {
  StandardEventsListeners,
  StandardEventsNames,
  StandardEventsOnMethod,
  Wallet,
  WalletAccount,
} from "@wallet-standard/core";
import { ReadonlyWalletAccount } from "@wallet-standard/core";

export abstract class AbstractWallet implements Wallet {
  #listeners: { [E in StandardEventsNames]?: StandardEventsListeners[E][] } =
    {};

  protected _accounts: ReadonlyWalletAccount[];

  get version() {
    return "1.0.0" as const;
  }

  abstract get name(): Wallet["name"];
  abstract get icon(): Wallet["icon"];
  abstract get chains(): Wallet["chains"];
  abstract get features(): Wallet["features"];

  get accounts() {
    return this._accounts.slice();
  }

  constructor(accounts: ReadonlyWalletAccount[]) {
    this._accounts = accounts;
  }

  protected on: StandardEventsOnMethod = (event, listener) => {
    if (!this.#listeners[event]) {
      this.#listeners[event] = [];
    }
    this.#listeners[event].push(listener);

    return (): void => this.off(event, listener);
  };

  protected emit<E extends StandardEventsNames>(
    event: E,
    ...args: Parameters<StandardEventsListeners[E]>
  ): void {
    const listeners = this.#listeners[event];
    if (listeners) {
      for (const listener of listeners) {
        listener.apply(null, args);
      }
    }
  }

  protected off<E extends StandardEventsNames>(
    event: E,
    listener: StandardEventsListeners[E]
  ): void {
    this.#listeners[event] = this.#listeners[event]?.filter(
      (existingListener) => listener !== existingListener
    );
  }
}

export abstract class PossiblyLedgerWalletAccount extends ReadonlyWalletAccount {
  abstract readonly ledger: boolean;
}

export class SignerWalletAccount extends PossiblyLedgerWalletAccount {
  get ledger() {
    return false;
  }

  constructor(account: WalletAccount) {
    super(account);
    if (new.target === SignerWalletAccount) {
      Object.freeze(this);
    }
  }
}

export class LedgerWalletAccount extends PossiblyLedgerWalletAccount {
  get ledger() {
    return true;
  }

  constructor(account: WalletAccount) {
    super(account);
    if (new.target === LedgerWalletAccount) {
      Object.freeze(this);
    }
  }
}
