import axios, { AxiosResponse } from "axios";
import {
  TransactionEtherscan,
  Transfer,
  EtherscanTokenTransfers,
} from "./models";
import { default as BN } from "bn.js";

export function filterTransferTransactions(
  transferTransactions: TransactionEtherscan[]
): Transfer[] {
  const transfers: Transfer[] = transferTransactions.map((etherscanTx) => {
    return {
      txHash: etherscanTx.hash,
      blockNumber: etherscanTx.blockNumber,
      to: etherscanTx.to,
      from: etherscanTx.from,
      valueRaw: new BN(etherscanTx.value).toString(),
      value: new BN(etherscanTx.value)
        .div(new BN("1000000000000000000"))
        .toString(),
      currency: "ETH",
      type:
        etherscanTx.to.toLocaleLowerCase() ===
        (process.env.ADDRESS || "").toLocaleLowerCase()
          ? "IN"
          : "OUT",
    };
  });
  return transfers;
}

export function filterTokenTransfers(
  tokenTransfers: EtherscanTokenTransfers[]
): Transfer[] {
  const transfers: Transfer[] = tokenTransfers.map(
    (etherscanTokenTx: EtherscanTokenTransfers) => {
      const divisor: BN =
        etherscanTokenTx.tokenSymbol === "USDC" ||
        etherscanTokenTx.tokenSymbol === "USDT"
          ? new BN("1000000")
          : new BN("1000000000000000000");
      return {
        txHash: etherscanTokenTx.hash,
        blockNumber: etherscanTokenTx.blockNumber,
        to: etherscanTokenTx.to,
        from: etherscanTokenTx.from,
        value: new BN(etherscanTokenTx.value).div(divisor).toString(),
        valueRaw: new BN(etherscanTokenTx.value).toString(),
        currency: etherscanTokenTx.tokenSymbol,
        type:
          etherscanTokenTx.to.toLocaleLowerCase() ===
          (process.env.ADDRESS || "").toLocaleLowerCase()
            ? "IN"
            : "OUT",
      };
    }
  );
  return transfers;
}

export async function getTokenTransactions(
  address: string,
  startBlock: number,
  endBlock: number
): Promise<EtherscanTokenTransfers[]> {
  const transfers: AxiosResponse = await axios.get(
    `https://api.etherscan.io/api?module=account&action=tokentx&address=${address}&startblock=${startBlock}&endblock=${endBlock}&sort=asc&apikey=${process.env.ETHERSCAN_API_KEY}`
  );
  let tokenTransfers;
  if (transfers.data && Array.isArray(transfers.data.result)) {
    tokenTransfers = transfers.data.result.filter(
      (transaction: any) => !new BN(transaction.value).isZero()
    );
  }
  return tokenTransfers;
}

export async function getTransferTransactions(
  address: string,
  startBlock: number,
  endblock: number
): Promise<TransactionEtherscan[]> {
  const transfers: AxiosResponse = await axios.get(
    `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=${startBlock}&endblock=${endblock}&sort=asc&apikey=${process.env.ETHERSCAN_API_KEY}`
  );
  let valueTransfers;
  if (transfers.data && Array.isArray(transfers.data.result)) {
    valueTransfers = transfers.data.result.filter(
      (transaction: any) => !new BN(transaction.value).isZero()
    );
  }
  return valueTransfers;
}
