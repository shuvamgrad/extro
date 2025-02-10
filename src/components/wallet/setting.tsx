import { Lock, Settings, Shield, Wallet } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";

export const SettingsView = () => {
  const handleManageAccounts = () => {
    window.location.hash = "manage_account";
  };
  return (
    <div className="w-[23rem] space-y-4 px-8">
      <h2 className="text-xl font-semibold text-green-300">Settings</h2>
      <Card
        className="flex items-center justify-between p-3 cursor-pointer"
        onClick={handleManageAccounts}
      >
        <div className="flex items-center space-x-2">
          <Settings className="text-green-500" />
          <p>Manage Accounts</p>
        </div>
      </Card>

      <Card className="flex items-center p-3 cursor-pointer">
        <Wallet className="text-green-500" />
        <p className="ml-2">Preferences</p>
      </Card>

      <Card className="flex items-center p-3 cursor-pointer">
        <Shield className="text-green-500" />
        <p className="ml-2">Security & Privacy</p>
      </Card>

      <Button variant="destructive" className="w-full">
        <Lock className="mr-2" /> Lock Wallet
      </Button>
    </div>
  );
};
