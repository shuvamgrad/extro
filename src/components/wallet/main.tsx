import { Button } from "@/components/ui/button";
import { getBaseWallet } from "@/lib/dnetWallet";
import type { AccountData } from "@/types";
import { ArrowDownLeft, ArrowUpRight, DollarSign } from "lucide-react";
import { useEffect, useState } from "react";
import { Card, CardContent } from "~/components/ui/card";
import { AddOptions } from "./add_options";

interface BalanceViewProps {
  balance: number;
}

const BalanceView = ({ balance }: BalanceViewProps) => {
  const handleSendSol = () => {
    window.location.hash = "send-sol";
  };
  return (
    <Card className="bg-dark-900 border-dark-700 border-green-600 text-white">
      <div className="flex space-y-1.5 p-6 space-x-2">
        <span className="text-4xl font-bold">{`${balance.toFixed(2)}`}</span>
        <span className="flex items-center text-sm w-fit bg-green-800 text-gray-300 py-1.5 px-2">
          {`${balance.toFixed(2)} (+0.00%)`}
        </span>
      </div>
      <CardContent className="flex space-x-4 mt-4">
        <Button
          className="bg-green-700 flex items-center px-2 py-1"
          onClick={handleSendSol}
        >
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
  balance: number;
  symbol: string;
  price: number;
}

const CurrencyItem = ({ name, balance, symbol, price }: CurrencyItemProps) => {
  return (
    <Card className="flex justify-between items-center border-green-900 border-spacing-3 bg-green-800 text-white mt-2">
      <div className="flex items-center space-x-3 p-2">
        <span className="text-lg text-green-400 uppercase">{name}</span>
        <p className="text-green-200 text-sm">
          {balance} {symbol}
        </p>
      </div>
      <div className="text-right bg-green-600 p-2">
        <p className="text-lg text-green-400 font-bold">${price}</p>
        <p className="text-green-500 text-sm">+0.05%</p>
      </div>
    </Card>
  );
};

interface CryptoDashboardProps {
  readonly current_acccount: AccountData | null | undefined;
}

export const CryptoDashboard = ({ current_acccount }: CryptoDashboardProps) => {
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    const loadWallet = async () => {
      if (!current_acccount) return;

      const privatekey = current_acccount.secretKey;
      if (!privatekey) return;

      const wallet = getBaseWallet();
      await wallet.load(privatekey);

      try {
        const walletBalance = await wallet.getBalance();
        setBalance(walletBalance);
      } catch (error) {
        console.error("Error getting balance:", error);
      }
    };

    loadWallet();
  }, [current_acccount]);
  if (!current_acccount) return <AddOptions />;
  if (balance == null) return <div>Loading...</div>;
  return (
    <div className="bg-dark-900 text-white">
      <BalanceView balance={balance} />
      <h2 className="text-lg mt-6 uppercase text-gray-300">Currencies</h2>
      <CurrencyItem name="Solana" balance={balance} symbol="SOL" price={0.0} />
    </div>
  );
};
