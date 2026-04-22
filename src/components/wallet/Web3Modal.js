import React, { createContext, useContext, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { createWeb3Modal, defaultConfig } from '@web3modal/ethers/react';

const PROJECT_ID = "2bf2541340dc39fea57ec973a360f93b";

const mainnet = {
  chainId: 1,
  name: 'Ethereum',
  currency: 'ETH',
  explorerUrl: 'https://etherscan.io',
  rpcUrl: 'https://eth.llamarpc.com'
};

const metadata = {
  name: 'Vertex DEX',
  description: 'Decentralized Trading Platform',
  url: typeof window !== 'undefined' ? window.location.origin : '',
  icons: []
};

createWeb3Modal({
  ethersConfig: defaultConfig({ metadata }),
  chains: [mainnet],
  projectId: PROJECT_ID,
  enableAnalytics: false
});

const Web3ModalContext = createContext();

export const useWeb3Modal = () => {
  const context = useContext(Web3ModalContext);
  if (!context) {
    throw new Error('useWeb3Modal must be used within Web3ModalProvider');
  }
  return context;
};

export const Web3ModalProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [provider, setProvider] = useState(null);

  const connect = async () => {
    if (!window.ethereum) {
      alert('Please install MetaMask or Trust Wallet');
      return;
    }
    try {
      const ethProvider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await ethProvider.send('eth_requestAccounts', []);
      const network = await ethProvider.getNetwork();
      
      setAccount(accounts[0]);
      setChainId(network.chainId);
      setProvider(ethProvider);
      setIsConnected(true);
    } catch (error) {
      console.error('Connection failed:', error);
    }
  };

  const disconnect = () => {
    setAccount(null);
    setChainId(null);
    setProvider(null);
    setIsConnected(false);
  };

  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          const ethProvider = new ethers.providers.Web3Provider(window.ethereum);
          const network = await ethProvider.getNetwork();
          setAccount(accounts[0]);
          setChainId(network.chainId);
          setProvider(ethProvider);
          setIsConnected(true);
        }
      }
    };
    checkConnection();

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setIsConnected(true);
        } else {
          disconnect();
        }
      });
    }
  }, []);

  return (
    <Web3ModalContext.Provider value={{ isConnected, account, chainId, provider, connect, disconnect }}>
      {children}
    </Web3ModalContext.Provider>
  );
};