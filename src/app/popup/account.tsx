import { Menu, Pencil, Plus, Search } from "lucide-react";
import { Layout } from "~/components/layout/layout";
import { Wallet } from "~/components/wallet";

const AccountHeader = () => {
  return (
    <div className="pb-2 bg-dark-900 border-dark-700 text-white">
      <div className="flex justify-between items-center">
        <div className="flex justify-start items-center">
          <Menu className="w-5 h-5 cursor-pointer mr-2" />
          <Wallet.Account />
        </div>
        <div className="flex space-x-4">
          <Search className="w-5 h-5 cursor-pointer" />
          <Pencil className="w-5 h-5 cursor-pointer" />
          <Plus className="w-5 h-5 cursor-pointer" />
        </div>
      </div>
    </div>
  );
};

export const Account = () => {
  return (
    <Layout>
      <div className="w-[23rem] px-4">
        <AccountHeader />
        <Wallet.CryptoDashboard />
      </div>
    </Layout>
  );
};
