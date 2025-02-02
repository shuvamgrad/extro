import { Button } from "@/components/ui/button";
import { getBaseWallet } from "@/lib/dnetWallet";
import type { AccountData } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ArrowDownLeft, ArrowUpRight, DollarSign } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Card, CardContent } from "~/components/ui/card";
import { Message, sendMessage } from "~/lib/messaging";

const BalanceView = () => {
  const { data: current_account } = useQuery({
    queryKey: [Message.ACCOUNT],
    queryFn: () => sendMessage(Message.ACCOUNT, undefined),
  });
  const [account, setAccount] = useState(current_account);

  useEffect(() => {
    if (!account) return;
    mutate(account);
  }, [account]);

  const { mutate, isPending } = useMutation({
    mutationFn: async (account: AccountData) => {
      // const { data: current_account } = useQuery({
      //   queryKey: [Message.ACCOUNT],
      //   queryFn: () => sendMessage(Message.ACCOUNT, undefined),
      // });
      // console.log("current_account", current_account);
      const privatekey = account?.secretKey;
      if (!privatekey) return null;
      console.log("privatekey", privatekey);
      const wallet = getBaseWallet();
      await wallet.load(privatekey);

      const balance = await wallet.getBalance();
      console.log("balance", balance);

      console.log(wallet);
    },
    onError: (error) => toast.error(error.message),
    onSuccess: () => {
      toast.success("Account created successfully");
    },
  });
  return (
    <Card className="bg-dark-900 border-dark-700 border-green-600 text-white">
      <div className="flex space-y-1.5 p-6 space-x-2">
        <span className="text-4xl font-bold">$0.00</span>
        <span className="flex items-center text-sm w-fit bg-green-800 text-gray-300 py-1.5 px-2">
          0.00 (+0.00%)
        </span>
      </div>
      <CardContent className="flex space-x-4 mt-4">
        <Button className="bg-green-700 flex items-center px-2 py-1">
          SEND
          <ArrowUpRight className="ml-2" />
        </Button>
        <Button className="bg-green-700 flex items-center px-2 py-1">
          RECEIVE
          <ArrowDownLeft className="ml-2" />
        </Button>
        <Button className="bg-green-700 flex items-center px-2 py-1">
          BUY
          <DollarSign className="ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
};

interface CurrencyItemProps {
  name: string;
  amount: number;
  symbol: string;
  price: number;
}

const CurrencyItem = ({ name, amount, symbol, price }: CurrencyItemProps) => {
  return (
    <Card className="flex justify-between items-center border-green-900 border-spacing-3 bg-green-800 text-white mt-2">
      <div className="flex items-center space-x-3 p-2">
        <span className="text-lg text-green-400 uppercase">{name}</span>
        <p className="text-green-200 text-sm">
          {amount} {symbol}
        </p>
      </div>
      <div className="text-right bg-green-600 p-2">
        <p className="text-lg text-green-400 font-bold">${price}</p>
        <p className="text-green-500 text-sm">+0.05%</p>
      </div>
    </Card>
  );
};

export const CryptoDashboard = () => {
  return (
    <div className="bg-dark-900 text-white">
      <BalanceView />
      <h2 className="text-lg mt-6 uppercase text-gray-300">Currencies</h2>
      <CurrencyItem name="Solana" amount={0.5} symbol="SOL" price={0.0} />
      <CurrencyItem name="Ethereum" amount={0.5} symbol="ETH" price={0.0} />
      <CurrencyItem name="Bitcoin" amount={0.5} symbol="BTC" price={0.0} />
    </div>
  );
};
