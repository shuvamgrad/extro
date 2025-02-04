import { Copy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../ui/button";

interface ReceiveSolProps {
  address: string;
}
export const ReceiveSol = ({ address }: ReceiveSolProps) => {
  const onDone = () => {
    window.location.hash = "account";
  };
  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(address)
      .then(() => {
        toast("Address copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
        toast("Failed to copy address");
      });
  };
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold tracking-wide text-center flex-grow text-green-400">
          Copy & Share your address
        </h2>
      </div>

      <div className="bg-green-900 border border-green-600 rounded-lg p-4 text-sm text-white space-y-3">
        <div className="flex justify-between">
          <span className="truncate">{`${address.slice(0, 6)}...${address.slice(
            -6
          )}`}</span>
          <Copy className="w-4 h-4 cursor-pointer" onClick={copyToClipboard} />
        </div>
      </div>

      <div className="flex space-x-2 space-y-2">
        <Button
          type="button"
          variant="default"
          className="w-full mt-2"
          onClick={onDone}
        >
          BACK TO DASHBOARD
        </Button>
      </div>
    </div>
  );
};
