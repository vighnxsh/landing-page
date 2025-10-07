'use client';

import { createContext, useContext, ReactNode, useState, useCallback, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

interface SignatureContextType {
  hasSigned: boolean;
  requestSignature: () => Promise<boolean>;
  isSigning: boolean;
}

const SignatureContext = createContext<SignatureContextType | undefined>(undefined);

export const useSignature = () => {
  const context = useContext(SignatureContext);
  if (!context) {
    throw new Error('useSignature must be used within a SignatureProvider');
  }
  return context;
};

export const SignatureProvider = ({ children }: { children: ReactNode }) => {
  const { publicKey, signMessage, connected } = useWallet();
  const [hasSigned, setHasSigned] = useState(false);
  const [isSigning, setIsSigning] = useState(false);

  const getSessionKey = useCallback(() => {
    if (!publicKey) return null;
    return `signedIn-${publicKey.toBase58()}`;
  }, [publicKey]);

  useEffect(() => {
    const sessionKey = getSessionKey();
    if (sessionKey) {
      const signed = sessionStorage.getItem(sessionKey) === 'true';
      setHasSigned(signed);
    } else {
      setHasSigned(false);
    }
  }, [publicKey, getSessionKey]);

  useEffect(() => {
    if (!connected) {
      const sessionKey = getSessionKey();
      if (sessionKey) {
          sessionStorage.removeItem(sessionKey);
      }
      setHasSigned(false);
    }
  }, [connected, getSessionKey]);


  const requestSignature = useCallback(async () => {
    if (!connected || !publicKey || !signMessage) {
      return false;
    }

    const sessionKey = getSessionKey();
    if (!sessionKey) return false;

    if (sessionStorage.getItem(sessionKey) === 'true') {
        setHasSigned(true);
        return true;
    }

    setIsSigning(true);
    try {
      const message = new TextEncoder().encode('logging in to goonr.fun');
      await signMessage(message);
      sessionStorage.setItem(sessionKey, 'true');
      setHasSigned(true);
      return true;
    } catch (error) {
      console.error('Sign message failed', error);
      setHasSigned(false);
      sessionStorage.removeItem(sessionKey);
      return false;
    } finally {
      setIsSigning(false);
    }
  }, [connected, publicKey, signMessage, getSessionKey]);

  useEffect(() => {
    if(connected && publicKey && !hasSigned) {
        const sessionKey = getSessionKey();
        if (sessionKey && sessionStorage.getItem(sessionKey) !== 'true') {
            requestSignature();
        }
    }
  }, [connected, publicKey, hasSigned, requestSignature, getSessionKey]);


  return (
    <SignatureContext.Provider value={{ hasSigned, requestSignature, isSigning }}>
      {children}
    </SignatureContext.Provider>
  );
}; 