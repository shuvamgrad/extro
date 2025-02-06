import { getKeyPairFromSK } from "@/lib/keys";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { browser } from "wxt/browser";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Message, sendMessage } from "~/lib/messaging";
import { StorageKey, useStorage } from "~/lib/storage";
import type { AccountData } from "~/types";

const importAccountSchema = z.object({
  name: z.string().min(3),
  secretKey: z.string(),
});

type ImportAccountData = z.infer<typeof importAccountSchema>;

interface ImportAccountProps {
  onClose: () => void;
}

export const ImportAccount: React.FC<ImportAccountProps> = ({ onClose }) => {
  const { data: accounts } = useQuery({
    queryKey: [Message.ACCOUNTS],
    queryFn: () => sendMessage(Message.ACCOUNTS, undefined),
  });
  const { set: setAccounts } = useStorage(StorageKey.ACCOUNTS);
  const { set: setAccount } = useStorage(StorageKey.ACCOUNT);

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: ImportAccountData) => {
      const accountName = data.name;
      if (accounts?.find((account) => account.name === accountName)) {
        throw new Error("Account name already exists");
      }
      const { publicKey, secretKey } = getKeyPairFromSK(data.secretKey);
      const account: AccountData = {
        name: data.name,
        publicKey,
        secretKey,
      };
      setAccounts([...(accounts || []), account]);
      setAccount(account);
      return account;
    },
    onError: (error) => toast.error(error.message),
    onSuccess: () => {
      onClose();
    },
  });

  const form = useForm<ImportAccountData>({
    resolver: zodResolver(importAccountSchema),
  });

  const onSubmit = (data: ImportAccountData) => {
    mutate(data);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{browser.i18n.getMessage("accountName")}</FormLabel>
              <FormControl>
                <Input placeholder="Enter account name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="secretKey"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Private Key</FormLabel>
              <FormControl>
                <Input placeholder="Enter account private key" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full mt-2" disabled={isPending}>
          Import Account
        </Button>
      </form>
    </Form>
  );
};
