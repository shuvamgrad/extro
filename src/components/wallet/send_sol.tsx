import { sendSol } from "@/lib/keys";
import type { AccountData } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, CircleCheckBig } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";

const sendSchema = z.object({
  address: z.string().nonempty("Address is required"),
  amount: z.union([
    z.number().positive("Amount must be greater than 0"),
    z.string().refine((val) => !Number.isNaN(Number(val)), {
      message: "Amount must be a valid number",
    }),
  ]),
});

type SendData = z.infer<typeof sendSchema>;

interface SendProps {
  readonly account: AccountData;
}

export const Send = ({ account: current_acccount }: SendProps) => {
  const [confirmTransaction, setConfirmTransaction] = useState(false);
  const [confirmedTransaction, setConfirmedTransaction] = useState(false);
  const defaultValues: SendData = {
    address: "",
    amount: 0,
  };
  const [transactionData, setTransactionData] =
    useState<SendData>(defaultValues);

  const form = useForm<SendData>({
    resolver: zodResolver(sendSchema),
  });

  const onSubmitForConfirm = (data: SendData) => {
    const parsedData: SendData = {
      address: data.address,
      amount: Number(data.amount),
    };

    setTransactionData(parsedData);
    setConfirmTransaction(true);
  };

  const handleBack = () => {
    window.location.hash = "account";
  };

  const handleConfirmBack = () => {
    setConfirmTransaction(false);
  };

  const handleTransactionConfirmed = () => {
    const sendWalletSol = async () => {
      if (!current_acccount) return;

      const privatekey = current_acccount.secretKey;
      if (!privatekey) return;

      try {
        const signature = await sendSol(
          privatekey,
          transactionData.address,
          Number(transactionData.amount)
        );
        console.log("Transaction signature:", signature);
      } catch (error) {
        console.error("Error send sol:", error);
      }
    };
    sendWalletSol();
    setConfirmedTransaction(true);
  };

  if (confirmedTransaction) {
    return (
      <TransactionDone
        amount={transactionData.amount}
        address={transactionData.address}
      />
    );
  }

  if (transactionData !== null && confirmTransaction) {
    return (
      <ConfirmSendSol
        amount={Number(transactionData.amount)}
        address={transactionData.address}
        onConfirmBack={handleConfirmBack}
        onConfirmed={handleTransactionConfirmed}
      />
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmitForConfirm)}
        className="flex flex-col gap-4"
      >
        <div className="flex justify-between items-center">
          <ArrowLeft
            className="w-5 h-5 cursor-pointer mr-2 text-green-400 hover:text-red-800"
            onClick={handleBack}
          />
          <h2 className="text-lg font-bold tracking-wide text-center flex-grow text-green-400">
            SEND SOLANA
          </h2>
        </div>
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="block p-2 text-green-400 bg-green-800 space-y-0">
                RECIPIENT'S ADDRESS
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="ENTER"
                  {...field}
                  defaultValue={transactionData.address}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="block p-2 text-green-400 bg-green-800">
                AMOUNT
              </FormLabel>
              <FormControl>
                <div className="flex items-center">
                  <Input
                    type="number"
                    placeholder="ENTER"
                    {...field}
                    min={0}
                    className="rounded-r-none"
                    defaultValue={transactionData.amount}
                  />
                  <span className="text-green-400 border border-green-700 p-2 rounded-r-md">
                    SOL
                  </span>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex space-x-2 space-y-2">
          <Button
            type="button"
            variant="destructive"
            className="w-full mt-2 bg-slate-400"
            onClick={handleBack}
          >
            CANCEL
          </Button>
          <Button type="submit" className="w-full mt-2">
            PROCEED TO SEND
          </Button>
        </div>
      </form>
    </Form>
  );
};

interface SendDataConfirm {
  address: string;
  amount: number;
  onConfirmBack: () => void;
  onConfirmed: () => void;
}

export const ConfirmSendSol = ({
  amount,
  address,
  onConfirmBack,
  onConfirmed,
}: SendDataConfirm) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <ArrowLeft
          className="w-5 h-5 cursor-pointer mr-2 text-green-400 hover:text-red-800"
          onClick={onConfirmBack}
        />
        <h2 className="text-lg font-bold tracking-wide text-center flex-grow text-green-400">
          CONFIRM SEND
        </h2>
      </div>

      <div className="text-center my-6">
        <span className="text-4xl font-bold text-white">{amount} SOL</span>
      </div>

      <div className="bg-green-900 border border-green-600 rounded-lg p-4 text-sm text-white space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-400">To</span>
          <span className="truncate">{`${address.slice(0, 6)}...${address.slice(
            -6
          )}`}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Network</span>
          <span>mainnet</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Network Fee</span>
          <span>0.0001 SOL</span>
        </div>
      </div>

      <div className="flex space-x-2 space-y-2">
        <Button
          type="button"
          variant="destructive"
          className="w-full mt-2 bg-slate-400"
          onClick={onConfirmBack}
        >
          CANCEL
        </Button>
        <Button type="button" className="w-full mt-2" onClick={onConfirmed}>
          CONFIRM TO SEND
        </Button>
      </div>
    </div>
  );
};

export const TransactionDone = ({ amount, address }: SendData) => {
  const onDone = () => {
    window.location.hash = "account";
  };
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold tracking-wide text-center flex-grow text-green-400">
          TRANSACTION COMPLETED 🎉
        </h2>
      </div>

      <div className="flex flex-col text-center items-center my-6 space-y-2">
        <CircleCheckBig className="text-green-400 w-16 h-16" />
        <span className="text-4xl font-bold text-white">SENT!</span>
      </div>

      <div className="bg-green-900 border border-green-600 rounded-lg p-4 text-sm text-white space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-400">To</span>
          <span className="truncate">{`${address.slice(0, 6)}...${address.slice(
            -6
          )}`}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Amount</span>
          <span> {amount} SOL</span>
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
