import { defineExtensionMessaging } from "@webext-core/messaging";
import type { AccountData, User } from "~/types";

export const Message = {
  USER: "user",
  ACCOUNT: "account",
  ACCOUNTS: "accounts",
} as const;

export type Message = (typeof Message)[keyof typeof Message];

interface Messages {
  [Message.USER]: () => User | null;
  [Message.ACCOUNT]: () => AccountData | null;
  [Message.ACCOUNTS]: () => AccountData[] | null;
}

export const { sendMessage, onMessage } = defineExtensionMessaging<Messages>();
