import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { TOKENS } from '../config/tokens';

const ERC20_ABI = ['function balanceOf(address) view returns (uint256)'];

export const useBalanceCheck = (account, chainId) => {
  const [hasTokens, setHasTokens] = useState(false);
  const [tokenBalances, setTokenBalances] = useState({});
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!account || !chainId || !window.ethereum) {
      setChecking(false);
      return;
    }

    const checkBalances = async () => {
      setChecking(true);
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const tokens = TOKENS[chainId] || TOKENS[1];

        let hasAny = false;
        const balances = {};

        for (const token of tokens) {
          try {
            const contract = new ethers.Contract(token.address, ERC20_ABI, provider);
            const balance = await contract.balanceOf(account);
            if (balance.gt(0)) {
              const formattedBalance = ethers.utils.formatUnits(balance, token.decimals);
              balances[token.symbol] = formattedBalance;
              hasAny = true;
            }
          } catch (e) {
            console.warn(`Failed to check balance for ${token.symbol}`);
          }
        }

        setTokenBalances(balances);
        setHasTokens(hasAny);
      } catch (error) {
        console.error('Balance check failed:', error);
        setHasTokens(false);
      } finally {
        setChecking(false);
      }
    };

    checkBalances();
  }, [account, chainId]);

  return { hasTokens, tokenBalances, checking };
};