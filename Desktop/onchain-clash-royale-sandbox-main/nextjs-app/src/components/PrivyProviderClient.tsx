"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { ReactNode } from "react";

export default function PrivyProviderClient({ children }: { children: ReactNode }) {
  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID || "";

  return (
    <PrivyProvider 
  appId="cmfz0azop0003ky0dcmxbm5kc"
  config={{
  "appearance": {
    "accentColor": "#a1a1a1",
    "theme": "#690202",
    "showWalletLoginFirst": false,
    "logo": "https://auth.privy.io/logos/privy-logo-dark.png",
    "walletChainType": "solana-only",
    "walletList": [
      "detected_wallets",
      "metamask",
      "phantom",
      "coinbase_wallet",
      "base_account",
      "rainbow",
      "solflare",
      "backpack",
      "okx_wallet",
      "wallet_connect"
    ]
  },
  "loginMethods": [
    "email",
    "twitter"
  ],
  "fundingMethodConfig": {
    "moonpay": {
      "useSandbox": true
    }
  },
  "embeddedWallets": {
    
    "showWalletUIs": true,
    "ethereum": {
      "createOnLogin": "off"
    },
    "solana": {
      "createOnLogin": "users-without-wallets"
    }
  },
  "mfa": {
    "noPromptOnMfaRequired": false
  },
  "externalWallets": {
    "solana": {
      
    }
  }
}}
>
  {children}
</PrivyProvider>
  );
}


