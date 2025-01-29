import { generateKeypair } from "@/lib/keys";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
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

const accountNameSchema = z.object({
  name: z.string().min(3),
});

type AccountNameData = z.infer<typeof accountNameSchema>;

interface CreateAccountProps {
  onClose: () => void;
}

export const CreateAccount: React.FC<CreateAccountProps> = ({ onClose }) => {
  const { data: accounts } = useQuery({
    queryKey: [Message.ACCOUNTS],
    queryFn: () => sendMessage(Message.ACCOUNTS, undefined),
  });
  const { set: setAccounts } = useStorage(StorageKey.ACCOUNTS);
  const { set: setAccount } = useStorage(StorageKey.ACCOUNT);

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: AccountNameData) => {
      const accountName = data.name;
      if (accounts?.find((account) => account.name === accountName)) {
        throw new Error("Account name already exists");
      }
      const { publicKey, secretKey } = generateKeypair();
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
      window.location.hash = "#account";
      onClose();
    },
  });

  const form = useForm<AccountNameData>({
    resolver: zodResolver(accountNameSchema),
  });

  const onSubmit = (data: AccountNameData) => {
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

        <Button type="submit" className="w-full mt-2" disabled={isPending}>
          {isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            browser.i18n.getMessage("createAccount")
          )}
        </Button>

        {/* <Button
          type="button"
          variant="destructive"
          onClick={onClose}
          className="w-full bg-green-900"
          disabled={isPending}
        >
          Close
        </Button> */}
      </form>
    </Form>
  );
};
