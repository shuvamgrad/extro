import type { AccountData } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  Edit,
  MoreVertical,
  Plus,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
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
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Sheet, SheetContent, SheetTitle } from "../ui/sheet";

interface ManageAccountsProps {
  onBack: () => void;
}

export const ManageAccounts = ({ onBack }: ManageAccountsProps) => {
  const { data: accounts } = useQuery({
    queryKey: [Message.ACCOUNTS],
    queryFn: () => sendMessage(Message.ACCOUNTS, undefined),
  });

  const [editAccount, setEditAccount] = useState<AccountData | null>(null);
  const accountsArray = accounts || [];

  const handleEditAccount = (account: AccountData) => {
    setEditAccount(account);
  };

  const handleAddAccount = () => {
    window.location.hash = "add-options";
  };

  if (editAccount) {
    return (
      <EditAccount account={editAccount} onBack={() => setEditAccount(null)} />
    );
  }

  return (
    <div className="w-[23rem] space-y-4 px-8">
      {/* Header with Back Button */}
      <div className="flex items-center space-x-2">
        <button type="button" onClick={onBack}>
          <ChevronLeft className="text-white" />
        </button>
        <h2 className="text-xl font-semibold">Manage Accounts</h2>
      </div>

      {/* Account List */}
      {accountsArray.map((account) => (
        <AccountCard
          key={account.name}
          account={account}
          onEdit={() => handleEditAccount(account)}
        />
      ))}

      {/* Add / Connect Wallet Button */}
      <Button
        variant="outline"
        className="w-full flex items-center justify-center"
        onClick={handleAddAccount}
      >
        <Plus className="mr-2" /> Add / Connect Wallet
      </Button>
    </div>
  );
};

interface AccountCardProps {
  readonly account: AccountData;
  onEdit: () => void;
}

const AccountCard = ({ account, onEdit }: AccountCardProps) => {
  return (
    <Card
      className="flex items-center justify-between p-3 cursor-pointer"
      onClick={onEdit}
    >
      <div className="flex items-center space-x-2">
        <div className="bg-green-500 text-white p-2 rounded-full">A</div>
        <p>{account.name}</p>
      </div>
      <MoreVertical className="text-gray-500" />
    </Card>
  );
};

interface EditAccountProps {
  onBack: () => void;
  account: AccountData;
}

export const EditAccount = ({ onBack, account }: EditAccountProps) => {
  const [modalContent, setModalContent] = useState<React.ReactNode | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (content: React.ReactNode) => {
    setModalContent(content);
    setIsModalOpen(true);
  };

  const onEditModelClose = () => {
    setIsModalOpen(false);
    onBack();
  };

  return (
    <div className="w-[23rem] space-y-4 px-8">
      {/* Header with Back Button */}
      <div className="flex items-center space-x-2">
        <button type="button" onClick={onBack}>
          <ChevronLeft className="text-white" />
        </button>
        <h2 className="text-xl font-semibold">Edit Account</h2>
      </div>

      {/* Account Info */}
      <div className="flex flex-col items-center">
        <div className="relative">
          <div className="bg-green-500 text-white p-6 rounded-full text-2xl">
            A
          </div>
          <button
            type="button"
            className="absolute bottom-0 right-0 bg-gray-800 p-1 rounded-full"
          >
            <Edit className="text-white" size={16} />
          </button>
        </div>
        <p className="text-lg mt-2">{account.name}</p>
      </div>

      {/* Account Name Edit */}
      <Card
        className="p-3 flex justify-between cursor-pointer"
        onClick={() =>
          openModal(
            <EditAccountName account={account} onClose={onEditModelClose} />
          )
        }
      >
        <p>Account Name</p>
        <p className="text-gray-400">{account.name}</p>
        <ChevronRight className="w-5 h-5" />
      </Card>

      {/* Show Public Key */}
      <Card
        className="p-3 flex justify-between cursor-pointer"
        onClick={() =>
          openModal(
            <ShowPublicKey
              publicKey={account.publicKey}
              onClose={() => setIsModalOpen(false)}
            />
          )
        }
      >
        <p>Public Key</p>
        <p className="text-gray-400">{account.publicKey?.slice(0, 6)}...</p>
        <ChevronRight className="w-5 h-5" />
      </Card>

      {/* Show Private Key */}
      <Card
        className="p-3 flex justify-between cursor-pointer"
        onClick={() =>
          openModal(
            <ShowPrivateKey
              privateKey={account.secretKey}
              onClose={() => setIsModalOpen(false)}
            />
          )
        }
      >
        <p>Show Private Key</p>
        <ChevronRight className="w-5 h-5" />
      </Card>

      {/* Modal Component */}
      <Sheet open={isModalOpen} onOpenChange={setIsModalOpen}>
        <SheetContent side="bottom">{modalContent}</SheetContent>
      </Sheet>
    </div>
  );
};

const accountNameSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
});

type AccountNameData = z.infer<typeof accountNameSchema>;

interface EditAccountNameProps {
  account: AccountData;
  onClose: () => void;
}

export const EditAccountName = ({ account, onClose }: EditAccountNameProps) => {
  const queryClient = useQueryClient();
  const { data: accounts } = useQuery({
    queryKey: [Message.ACCOUNTS],
    queryFn: () => sendMessage(Message.ACCOUNTS, undefined),
  });

  const { set: setAccounts } = useStorage(StorageKey.ACCOUNTS);
  const { set: setAccount } = useStorage(StorageKey.ACCOUNT);

  const form = useForm<AccountNameData>({
    resolver: zodResolver(accountNameSchema),
    defaultValues: { name: account.name },
  });

  const onSubmit = (data: AccountNameData) => {
    const updatedAccount = { ...account, name: data.name };

    setAccounts([
      ...(accounts || []).filter((acc) => acc.name !== account.name),
      updatedAccount,
    ]);
    setAccount(updatedAccount);

    queryClient.invalidateQueries({ queryKey: [Message.ACCOUNT] });
    queryClient.invalidateQueries({ queryKey: [Message.ACCOUNTS] });

    onClose();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <SheetTitle>Edit Account Name</SheetTitle>

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter account name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full mt-2">
          Save Changes
        </Button>
      </form>
    </Form>
  );
};

interface ShowPublicKeyProps {
  publicKey: string;
  onClose: () => void;
}

export const ShowPublicKey = ({ publicKey, onClose }: ShowPublicKeyProps) => {
  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(publicKey)
      .then(() => {
        toast("Address copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
        toast("Failed to copy address");
      });
  };
  return (
    <div>
      <SheetTitle>Public Key</SheetTitle>
      <p className="text-green-500 break-all p-4">{publicKey}</p>
      <Button
        variant="outline"
        className="mt-4 w-full"
        onClick={copyToClipboard}
      >
        <Copy className="w-4 h-4 cursor-pointer" />
        Copy to Clipboard
      </Button>
    </div>
  );
};

interface ShowPrivateKeyProps {
  privateKey: string;
  onClose: () => void;
}

export const ShowPrivateKey = ({
  privateKey,
  onClose,
}: ShowPrivateKeyProps) => {
  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(privateKey)
      .then(() => {
        toast("Address copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
        toast("Failed to copy address");
      });
  };
  return (
    <div>
      <SheetTitle>Private Key</SheetTitle>
      <p className="text-red-500 break-all p-4">{privateKey}</p>
      <Button
        variant="outline"
        className="mt-4 w-full"
        onClick={copyToClipboard}
      >
        <Copy className="w-4 h-4 cursor-pointer" />
        Copy to Clipboard
      </Button>
    </div>
  );
};
