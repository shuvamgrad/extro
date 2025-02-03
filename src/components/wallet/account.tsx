import type { AccountData } from "@/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { browser } from "wxt/browser";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTitle } from "~/components/ui/sheet";
import { Message, sendMessage } from "~/lib/messaging";
import { StorageKey, useStorage } from "~/lib/storage";
import { CreateAccount } from "./create_account";

interface AccountHeaderProps {
  readonly current_account: AccountData | null | undefined;
}

export const Account = ({ current_account }: AccountHeaderProps) => {
  const queryClient = useQueryClient();
  const { data: accounts } = useQuery({
    queryKey: [Message.ACCOUNTS],
    queryFn: () => sendMessage(Message.ACCOUNTS, undefined),
  });
  const { set: setAccount } = useStorage(StorageKey.ACCOUNT);

  const accountsArray = accounts || [];
  const handleSetAccount = (account: AccountData) => {
    setAccount(account);
    queryClient.invalidateQueries({ queryKey: [Message.ACCOUNT] });
  };
  const handleCreateAccount = () => {
    setIsCreateAccountOpen(false);
    queryClient.invalidateQueries({
      queryKey: [Message.ACCOUNT],
    });
    queryClient.invalidateQueries({
      queryKey: [Message.ACCOUNTS],
    });
  };
  const [isCreateAccountOpen, setIsCreateAccountOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button>
            {current_account
              ? current_account.name
              : browser.i18n.getMessage("selectAccount")}
            <ChevronDown className="ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {accountsArray.map((account) => (
            <DropdownMenuItem
              key={account.name}
              onClick={() => handleSetAccount(account)}
            >
              {account.name}
            </DropdownMenuItem>
          ))}
          <DropdownMenuItem
            key="create_account"
            onClick={() => setIsCreateAccountOpen(true)}
          >
            {browser.i18n.getMessage("addAccount")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Bottom-up modal for Create Account */}
      <Sheet open={isCreateAccountOpen} onOpenChange={setIsCreateAccountOpen}>
        <SheetContent side="bottom">
          <SheetTitle>
            Create Account
            {/* {browser.i18n.getMessage("createAccountTitle")} */}
          </SheetTitle>
          <CreateAccount onClose={() => handleCreateAccount()} />
        </SheetContent>
      </Sheet>
    </>
  );
};
