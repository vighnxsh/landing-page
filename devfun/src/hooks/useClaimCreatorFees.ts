import { useState } from 'react';
import { toast } from 'sonner';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, Transaction } from '@solana/web3.js';
import BN from 'bn.js';

type ClaimCreatorFeesOptions = {
  onSuccess?: (signature: string) => void;
  onError?: (error: string) => void;
};

type ClaimCreatorFeesParams = {
  pool: string;
  maxBaseAmount?: string;
  maxQuoteAmount?: string;
  receiver?: string;
};

export function useClaimCreatorFees() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [signature, setSignature] = useState<string | null>(null);
  const { publicKey, signTransaction } = useWallet();

  const claimCreatorFees = async (
    params: ClaimCreatorFeesParams,
    options: ClaimCreatorFeesOptions = {}
  ) => {
    if (!publicKey || !signTransaction) {
      const walletError = new Error('Wallet not connected');
      setError(walletError);
      toast.error('Wallet not connected. Please connect your wallet.');
      options.onError?.(walletError.message);
      return null;
    }

    setIsLoading(true);
    setError(null);
    setSignature(null);

    try {
      // Create the claim transaction via API
      const response = await fetch('/api/claim', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          creator: publicKey.toString(),
          pool: params.pool,
          maxBaseAmount: params.maxBaseAmount,
          maxQuoteAmount: params.maxQuoteAmount,
          receiver: params.receiver,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create claim transaction');
      }

      const { transaction: serializedTransaction } = await response.json();

      // Deserialize and sign the transaction
      const transaction = Transaction.from(Buffer.from(serializedTransaction, 'base64'));
      const signedTransaction = await signTransaction(transaction);

      // Send the signed transaction
      const sendResponse = await fetch('/api/send-transaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          signedTransaction: signedTransaction.serialize().toString('base64'),
        }),
      });

      if (!sendResponse.ok) {
        const errorData = await sendResponse.json();
        throw new Error(errorData.error || 'Failed to send transaction');
      }

      const { signature: txSignature } = await sendResponse.json();

      setSignature(txSignature);
      toast.success('Creator fees claimed successfully!');
      options.onSuccess?.(txSignature);
      return txSignature;
    } catch (error: any) {
      const errorMessage = error?.message || 'Unknown error';
      setError(error);
      toast.error(`Failed to claim creator fees: ${errorMessage}`);
      options.onError?.(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    claimCreatorFees,
    isLoading,
    error,
    signature,
  };
} 