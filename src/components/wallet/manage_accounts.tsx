import { ChevronLeft, Edit, MoreVertical, Plus } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";

interface ManageAccountsProps {
  onBack: () => void;
}

export const ManageAccounts = ({ onBack }: ManageAccountsProps) => {
  const handleEditAccount = () => {
    window.location.hash = "edit_account";
  };
  const handleAddAccount = () => {
    window.location.hash = "add-options";
  };
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
      <Card
        className="flex items-center justify-between p-3 cursor-pointer"
        onClick={handleEditAccount}
      >
        <div className="flex items-center space-x-2">
          <div className="bg-green-500 text-white p-2 rounded-full">A1</div>
          <p>Account 1</p>
        </div>
        <MoreVertical className="text-gray-500" />
      </Card>
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

interface EditAccountProps {
  onBack: () => void;
}

export const EditAccount = ({ onBack }: EditAccountProps) => {
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
            A1
          </div>
          <button
            type="button"
            className="absolute bottom-0 right-0 bg-gray-800 p-1 rounded-full"
          >
            <Edit className="text-white" size={16} />
          </button>
        </div>
        <p className="text-lg mt-2">Account 1</p>
      </div>

      {/* Account Settings */}
      <Card className="p-3 flex justify-between cursor-pointer">
        <p>Account Name</p>
        <p className="text-gray-400">Account 1</p>
      </Card>

      <Card className="p-3 flex justify-between cursor-pointer">
        <p>Account Addresses</p>
        <p className="text-gray-400">2</p>
      </Card>

      <Card className="p-3 cursor-pointer">
        <p>Show Recovery Phrase</p>
      </Card>

      <Card className="p-3 cursor-pointer">
        <p>Show Private Key</p>
      </Card>
    </div>
  );
};
