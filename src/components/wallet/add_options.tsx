import { Download, Eye, Key, Plus } from "lucide-react";
import type * as React from "react";

export function AddOptions() {
  return (
    <div>
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold tracking-wide text-center flex-grow">
          ADD / CONNECT WALLET
        </h2>
      </div>

      <div className="mt-6 flex flex-col gap-4">
        <AccountOption
          icon={<Plus />}
          title="CREATE NEW ACCOUNT"
          description="Add a New multi-chain account"
          url="popup.html#create-account"
        />
        <AccountOption
          icon={<Key />}
          title="IMPORT PRIVATE KEY"
          description="Import a single-chain account"
          url="popup.html#create-account"
        />
        <AccountOption
          icon={<Download />}
          title="IMPORT SECRET RECOVERY PHRASE"
          description="Import accounts from another wallet"
          url="popup.html#create-account"
        />
        <AccountOption
          icon={<Eye />}
          title="WATCH ADDRESS"
          description="Track any public wallet address"
          url="popup.html#create-account"
        />
      </div>
    </div>
  );
}

interface AccountOptionProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  url: string;
}

const AccountOption = ({
  icon,
  title,
  description,
  url,
}: AccountOptionProps) => {
  const handleCreateAccount = (url: string) => {
    window.location.href = url;
  };
  return (
    <button
      type="button"
      className="flex items-center gap-4 p-4 bg-green-900 text-green-400 border border-green-500 rounded-lg hover:bg-green-800 transition"
      onClick={() => handleCreateAccount(url)}
    >
      <div className="p-2 bg-green-800 rounded-md">{icon}</div>
      <div className="text-left">
        <h3 className="text-sm font-bold">{title}</h3>
        <p className="text-xs text-green-300">{description}</p>
      </div>
    </button>
  );
};

export default AccountOption;
