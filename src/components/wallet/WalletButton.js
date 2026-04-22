import React from 'react';
import { useWeb3Modal } from './Web3Modal';

export const WalletButton = () => {
  const { isConnected, account, connect, disconnect } = useWeb3Modal();

  if (isConnected && account) {
    return (
      <div className="flex items-center gap-3">
        <div className="glass rounded-full px-4 py-2 flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-white font-mono text-sm">
            {account.slice(0,6)}...{account.slice(-4)}
          </span>
        </div>
        <button
          onClick={disconnect}
          className="bg-red-600/20 hover:bg-red-600/30 text-red-400 px-4 py-2 rounded-full text-sm transition"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={connect}
      className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white px-6 py-2 rounded-full font-semibold transition-all shadow-lg hover:shadow-xl"
    >
      Connect Wallet
    </button>
  );
};