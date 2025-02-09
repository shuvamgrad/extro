import { Button } from "@/components/ui/button";
import type { TokenAccountProps } from "@/lib/dnetWallet/wallet";
import { ArrowDownLeft, ArrowUpRight, DollarSign, X } from "lucide-react";
import { Card, CardContent } from "~/components/ui/card";

const SendReceiveView = () => {
  const handleSendSol = () => {
    window.location.hash = "send-sol";
  };
  const handleReceiveSol = () => {
    window.location.hash = "receive-sol";
  };
  return (
    <CardContent className="flex space-x-4 mt-4">
      <Button
        className="bg-green-700 flex items-center px-2 py-1"
        onClick={handleSendSol}
      >
        SEND
        <ArrowUpRight className="ml-2" />
      </Button>
      <Button
        className="bg-green-700 flex items-center px-2 py-1"
        onClick={handleReceiveSol}
      >
        RECEIVE
        <ArrowDownLeft className="ml-2" />
      </Button>
      <Button className="bg-green-700 flex items-center px-2 py-1">
        BUY
        <DollarSign className="ml-2" />
      </Button>
    </CardContent>
  );
};
interface BalanceViewProps {
  balance: number;
}

const BalanceView = ({ balance }: BalanceViewProps) => {
  return (
    <Card className="bg-dark-900 border-dark-700 border-green-600 text-white">
      <div className="flex space-y-1.5 p-6 space-x-2">
        <span className="text-4xl font-bold">{`${balance.toFixed(2)}`}</span>
        <span className="flex items-center text-sm w-fit bg-green-800 text-gray-300 py-1.5 px-2">
          {`${balance.toFixed(2)} (+0.00%)`}
        </span>
      </div>
      <SendReceiveView />
    </Card>
  );
};

interface CurrencyItemDetailsProps {
  token: TokenAccountProps;
  onBack: () => void;
}

export const CurrencyItemDetails = ({
  token,
  onBack,
}: CurrencyItemDetailsProps) => {
  return (
    <div className="flex flex-col space-y-2">
      <div className="flex justify-end">
        <X className="text-white h-5 w-5 cursor-pointer" onClick={onBack} />
      </div>
      <CurrencyItem token={token} />
      <SendReceiveView />
    </div>
  );
};

interface CurrencyItemProps {
  token: TokenAccountProps;
  onClick?: (token: TokenAccountProps) => void;
}

const CurrencyItem = ({ token, onClick }: CurrencyItemProps) => {
  return (
    <Card
      className="flex justify-between items-center border-green-900 border-spacing-3 bg-green-800 text-white mt-2 cursor-pointer"
      onClick={() => onClick?.(token)}
    >
      <div className="flex items-center space-x-3 p-2">
        <span className="text-lg text-green-400 uppercase">{token.name}</span>
        <p className="text-green-200 text-sm">
          {token.balance} {token.name}
        </p>
      </div>
      <div className="text-right bg-green-600 p-2">
        <p className="text-lg text-green-400 font-bold">${token.balance}</p>
        <p className="text-green-500 text-sm">+0.05%</p>
      </div>
    </Card>
  );
};

interface CryptoDashboardProps {
  readonly token_accounts: TokenAccountProps[];
  onTokenSelect: (token: TokenAccountProps) => void;
}

export const CryptoDashboard = ({
  token_accounts,
  onTokenSelect,
}: CryptoDashboardProps) => {
  let walletBalance = 0;

  const currencyItems = token_accounts.map((token) => {
    walletBalance += token.balance;
    return (
      <CurrencyItem
        onClick={() => onTokenSelect(token)}
        token={token}
        key={token.name}
      />
    );
  });

  return (
    <div className="bg-dark-900 text-white">
      <BalanceView balance={walletBalance} />
      <h2 className="text-lg mt-6 uppercase text-gray-300">Currencies</h2>
      {currencyItems}
    </div>
  );
};
