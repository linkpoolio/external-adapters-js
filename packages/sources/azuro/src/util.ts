import { ethers } from 'ethers'

const { hexlify, base58, solidityKeccak256 } = ethers.utils

/**
 * Get Request Id
 * 
 * Emulates Chainlink Client in generating a valid bytes32 request id
 * @param address the consuming client contract address
 * @param count the request count
 */
export const getRequestId = (address: string, count: number): string => solidityKeccak256(["address", "uint256"], [address, count])

export const formatIpfsHash = (hash: string): string => hexlify(base58.decode(hash).slice(2))