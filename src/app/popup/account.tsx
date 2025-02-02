import { useQueryClient } from "@tanstack/react-query";
import { Menu, Plus } from "lucide-react";
import { Sheet, SheetContent, SheetTitle } from "~/components/ui/sheet";
import { Wallet } from "~/components/wallet";
import { Message } from "~/lib/messaging";

const AccountHeader = () => {
  return (
    <div className="pb-2 bg-dark-900 border-dark-700 text-white">
      <div className="flex justify-between items-center">
        <div className="flex justify-start items-center">
          <Menu className="w-5 h-5 cursor-pointer mr-2" />
          <Wallet.Account />
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
  return (
    <div className="w-[23rem] px-4">
      <AccountHeader />
      <Wallet.CryptoDashboard />
    </div>
  );
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
