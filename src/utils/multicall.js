import { Contract, Interface } from 'ethers';
import { MULTICALL_ADDRESS } from '../config/permit2Addresses';

const MULTICALL_ABI = [
  'function aggregate3(tuple(address target, bool allowFailure, bytes callData)[] calls) view returns (tuple(bool success, bytes returnData)[])'
];

export const multicall = async (provider, abi, calls) => {
  const multicallContract = new Contract(MULTICALL_ADDRESS, MULTICALL_ABI, provider);
  
  const iface = new Interface(abi);
  
  const encodedCalls = calls.map(call => ({
    target: call.target,
    allowFailure: true,
    callData: iface.encodeFunctionData(call.function, call.args)
  }));
  
  const results = await multicallContract.aggregate3(encodedCalls);
  
  return results.map(result => {
    if (!result.success) return 0n;
    const decoded = iface.decodeFunctionResult('balanceOf', result.returnData);
    return decoded[0];
  });
};