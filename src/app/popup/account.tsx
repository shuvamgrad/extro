import type { AccountData } from "@/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Menu, Plus } from "lucide-react";
import { Sheet, SheetContent, SheetTitle } from "~/components/ui/sheet";
import { Wallet } from "~/components/wallet";
import { Message, sendMessage } from "~/lib/messaging";

interface AccountHeaderProps {
  readonly current_account: AccountData | null | undefined;
}

const AccountHeader = ({ current_account }: AccountHeaderProps) => {
  return (
    <div className="pb-2 bg-dark-900 border-dark-700 text-white">
      <div className="flex justify-between items-center">
        <div className="flex justify-start items-center">
          <Menu className="w-5 h-5 cursor-pointer mr-2" />
          <Wallet.Account current_account={current_account} />
        </div>
        <div className="flex space-x-4">
          <a
            href="popup.html#add-options"
            className="underline hover:no-underline"
          >
            <Plus className="w-5 h-5 cursor-pointer" />
          </a>
        </div>
      </div>
    </div>
  );
};

export const Account = () => {
  const { data: current_account } = useQuery({
    queryKey: [Message.ACCOUNT],
    queryFn: () => sendMessage(Message.ACCOUNT, undefined),
  });
  if (!current_account) return <Wallet.AddOptions />;
  return (
    <div className="w-[23rem] px-4">
      <AccountHeader current_account={current_account} />
      <Wallet.CryptoDashboard current_acccount={current_account} />
    </div>
  );
};

export const SendSol = () => {
  const { data: current_account } = useQuery({
    queryKey: [Message.ACCOUNT],
    queryFn: () => sendMessage(Message.ACCOUNT, undefined),
  });
  if (!current_account) return <Wallet.AddOptions />;
  return <Wallet.Send account={current_account} />;
};

export const ReceiveSol = () => {
  const { data: current_account } = useQuery({
    queryKey: [Message.ACCOUNT],
    queryFn: () => sendMessage(Message.ACCOUNT, undefined),
  });
  if (!current_account) return <Wallet.AddOptions />;
  return <Wallet.ReceiveSol address={current_account.publicKey} />;
};

export const AccountOptions = () => {
  return <Wallet.AddOptions />;
};

export const CreateAccount = () => {
  const queryClient = useQueryClient();
  const handleCreateAccount = () => {
    queryClient.invalidateQueries({
      queryKey: [Message.ACCOUNT],
    });
    queryClient.invalidateQueries({
      queryKey: [Message.ACCOUNTS],
    });
    window.location.hash = "#account";
  };
  return (
    <Sheet open={true} onOpenChange={handleCreateAccount}>
      <SheetContent side="bottom">
        <SheetTitle>Create Account</SheetTitle>
        <Wallet.CreateAccount onClose={() => handleCreateAccount()} />
      </SheetContent>
    </Sheet>
  );
};

export const ImportAccount = () => {
  const queryClient = useQueryClient();
  const handleImportAccount = () => {
    queryClient.invalidateQueries({
      queryKey: [Message.ACCOUNT],
    });
    queryClient.invalidateQueries({
      queryKey: [Message.ACCOUNTS],
    });
    window.location.hash = "#account";
  };
  return (
    <Sheet open={true} onOpenChange={handleImportAccount}>
      <SheetContent side="bottom">
        <SheetTitle>Import Account</SheetTitle>
        <Wallet.ImportAccount onClose={() => handleImportAccount()} />
      </SheetContent>
    </Sheet>
  );
};
