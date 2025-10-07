import BN from 'bn.js';

// SOL has 9 decimals
const SOL_DECIMALS = 9;

export function formatSolAmount(lamports: string | number | BN): string {
  const amount = typeof lamports === 'string' ? new BN(lamports) : 
                 typeof lamports === 'number' ? new BN(lamports) : lamports;
  
  const solAmount = amount.toNumber() / Math.pow(10, SOL_DECIMALS);
  
  if (solAmount === 0) return '0 SOL';
  if (solAmount < 0.001) return '< 0.001 SOL';
  
  return `${solAmount.toFixed(3)} SOL`;
}

export function formatTokenAmount(amount: string | number | BN, decimals: number = 6): string {
  const tokenAmount = typeof amount === 'string' ? new BN(amount) : 
                     typeof amount === 'number' ? new BN(amount) : amount;
  
  const formattedAmount = tokenAmount.toNumber() / Math.pow(10, decimals);
  
  if (formattedAmount === 0) return '0';
  if (formattedAmount < 0.001) return '< 0.001';
  
  return formattedAmount.toFixed(3);
}

export function formatUSDValue(amount: number, price: number = 0): string {
  if (price === 0) return '$0.00';
  
  const usdValue = amount * price;
  return `$${usdValue.toFixed(2)}`;
}

export function hasClaimableFees(baseFee: string | number | BN, quoteFee: string | number | BN): boolean {
  const baseAmount = typeof baseFee === 'string' ? new BN(baseFee) : 
                    typeof baseFee === 'number' ? new BN(baseFee) : baseFee;
  const quoteAmount = typeof quoteFee === 'string' ? new BN(quoteFee) : 
                     typeof quoteFee === 'number' ? new BN(quoteFee) : quoteFee;
  
  return baseAmount.gt(new BN(0)) || quoteAmount.gt(new BN(0));
} 