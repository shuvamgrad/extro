import { useEffect, useState } from "react";
import { type WxtStorageItem, storage as browserStorage } from "wxt/storage";
import { type AccountData, Theme, type User } from "~/types";

export const StorageKey = {
  THEME: "local:theme",
  USER: "local:user",
  ACCOUNT: "local:account",
  ACCOUNTS: "local:accounts",
} as const;

export type StorageKey = (typeof StorageKey)[keyof typeof StorageKey];

const storage = {
  [StorageKey.THEME]: browserStorage.defineItem<Theme>(StorageKey.THEME, {
    fallback: Theme.SYSTEM,
  }),
  [StorageKey.USER]: browserStorage.defineItem<User | null>(StorageKey.USER, {
    fallback: null,
  }),
  [StorageKey.ACCOUNT]: browserStorage.defineItem<AccountData | null>(
    StorageKey.ACCOUNT,
    {
      fallback: null,
    }
  ),
  [StorageKey.ACCOUNTS]: browserStorage.defineItem<AccountData[]>(
    StorageKey.ACCOUNTS,
    {
      fallback: [],
    }
  ),
} as const;

type Value<T extends StorageKey> = (typeof storage)[T] extends WxtStorageItem<
  infer V,
  infer _
>
  ? V
  : never;

export const getStorage = <K extends StorageKey>(key: K) => {
  return storage[key];
};

export const useStorage = <K extends StorageKey>(key: K) => {
  const item = storage[key] as WxtStorageItem<
    Value<K>,
    Record<string, unknown>
  >;
  const [value, setValue] = useState<Value<K> | null>(null);

  useEffect(() => {
    const unwatch = item.watch((value) => {
      setValue(value);
    });

    return () => {
      unwatch();
    };
  }, [item]);

  useEffect(() => {
    (async () => {
      const value = await item.getValue();
      setValue(value);
    })();
  }, [item.getValue]);

  const remove = () => {
    void item.removeValue();
  };

  const set = (value: Value<K>) => {
    void item.setValue(value);
  };

  return { data: value ?? item.fallback, remove, set };
};
