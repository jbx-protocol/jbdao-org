import useSWR, { Fetcher } from "swr";
import {
  RevisedSafeMultisigTransactionResponse,
  SafeBalanceUsdResponse,
  SafeDelegatesResponse,
  SafeInfoResponse,
} from "../../models/SafeTypes";
import { useCallback, useEffect, useState } from "react";
import { useAccount, useWalletClient } from "wagmi";
import SafeApiKit, {
  SafeMultisigTransactionListResponse,
} from "@safe-global/api-kit";
import { useEthersSigner } from "./ViemAdapter";
import Safe, {
  EthersAdapter,
  SafeTransactionOptionalProps,
} from "@safe-global/protocol-kit";
import { ethers } from "ethers";
import {
  MetaTransactionData,
  SafeTransaction,
  SafeTransactionDataPartial,
} from "@safe-global/safe-core-sdk-types";

const SAFE_SERVICE_API = "https://safe-transaction-mainnet.safe.global";
const SAFE_API_V1_ROOT = SAFE_SERVICE_API + "/api/v1/";
const SAFE_API = SAFE_API_V1_ROOT + "safes/";

function jsonFetcher(): Fetcher<SafeMultisigTransactionListResponse, string> {
  return async (url) => {
    const res = await fetch(url);
    if (res.status == 400) {
      throw new Error("Invalid data.");
    } else if (res.status == 422) {
      throw new Error("Invalid ethereum address.");
    } else if (res.status == 404) {
      throw new Error("Safe not found.");
    }
    const json = await res.json();

    return json;
  };
}

export function useMultisigTransactionOf(
  address: string,
  safeTxHash: string,
  shouldFetch: boolean = true,
) {
  return useSWR(
    shouldFetch
      ? `${SAFE_API}${address}/multisig-transactions/?safe_tx_hash=${safeTxHash}`
      : null,
    jsonFetcher(),
  );
}

export function useHistoryTransactions(
  address: string,
  limit: number = 10,
  shouldFetch: boolean = true,
) {
  return useSWR(
    shouldFetch
      ? `${SAFE_API}${address}/multisig-transactions/?executed=true&trusted=true&limit=${limit}`
      : null,
    jsonFetcher(),
  );
}

export function useQueuedTransactions(
  address: string,
  nonceGte: number,
  limit: number = 10,
  shouldFetch: boolean = true,
) {
  return useSWR(
    shouldFetch
      ? `${SAFE_API}${address}/multisig-transactions/?nonce__gte=${nonceGte}&trusted=true&limit=${limit}`
      : null,
    jsonFetcher(),
  );
}

export function useMultisigTransactions(
  address: string,
  limit: number = 10,
  shouldFetch: boolean = true,
) {
  return useSWR(
    shouldFetch
      ? `${SAFE_API}${address}/multisig-transactions/?trusted=true&limit=${limit}`
      : null,
    jsonFetcher(),
  );
}

// react hook wrapper for safe api kit
// FIXME this will trigger infinite re-rendering
export function useSafeAPIFunction<T>(
  functionWrapper: (safeApiKit: SafeApiKit) => Promise<T>,
  shouldFetch: boolean = true,
) {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState<T>();

  const { value: safeApiKit } = useSafeAPIKit();

  const _functionWrapper = useCallback(
    (safeApiKit: SafeApiKit) => functionWrapper(safeApiKit),
    [functionWrapper],
  );

  const refetch = async () => {
    if (!safeApiKit || !shouldFetch) {
      setError("Not connected to wallet or safe not found.");
      return;
    }

    try {
      setLoading(true);
      const val = await _functionWrapper(safeApiKit);
      setValue(val);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refetch();
  }, [safeApiKit, shouldFetch, functionWrapper]);

  return {
    value,
    error,
    loading,
    refetch,
  };
}

function balanceJsonFetcher(): Fetcher<SafeBalanceUsdResponse[], string> {
  return async (url) => {
    const res = await fetch(url);
    if (res.status == 404) {
      throw new Error("Safe not found.");
    } else if (res.status == 422) {
      throw new Error("Safe address checksum not valid.");
    }
    const json = await res.json();

    return json;
  };
}

export function useMultisigAssets(
  address: string,
  shouldFetch: boolean = true,
) {
  return useSWR(
    shouldFetch
      ? `${SAFE_API}${address}/balances/usd/?trusted=true&exclude_spam=true`
      : null,
    balanceJsonFetcher(),
  );
}

function safeInfoJsonFetcher(): Fetcher<SafeInfoResponse, string> {
  return async (url) => {
    const res = await fetch(url);
    if (res.status == 404) {
      throw new Error("Safe not found.");
    } else if (res.status == 422) {
      throw new Error("Safe address checksum not valid.");
    }
    const json = await res.json();

    return json;
  };
}

export function useSafeInfo(address: string, shouldFetch: boolean = true) {
  return useSWR<SafeInfoResponse, Error>(
    shouldFetch ? `${SAFE_API}${address}` : null,
    safeInfoJsonFetcher(),
    { shouldRetryOnError: false },
  );
}

function delegatesJsonFetcher(): Fetcher<SafeDelegatesResponse, string> {
  return async (url) => {
    const res = await fetch(url);
    if (res.status == 400) {
      throw new Error("Data not valid.");
    }
    const json = await res.json();

    return json;
  };
}

export function useSafeDelegates(address: string, shouldFetch: boolean = true) {
  return useSWR(
    shouldFetch ? `${SAFE_API_V1_ROOT}/delegates/?safe=${address}` : null,
    delegatesJsonFetcher(),
  );
}

export function useSafeAPIKit() {
  const [value, setValue] = useState<SafeApiKit>();
  const signer = useEthersSigner();

  useEffect(() => {
    if (!signer) {
      return;
    }

    const ethAdapter = new EthersAdapter({
      ethers,
      signerOrProvider: signer!,
    });
    const safeApiKit = new SafeApiKit({
      txServiceUrl: SAFE_SERVICE_API,
      ethAdapter,
    });
    setValue(safeApiKit);
  }, [signer]);

  return { value, loading: !value };
}

export function useSafe(safeAddress: string) {
  const [error, setError] = useState<string>();
  const [value, setValue] = useState<Safe>();
  const signer = useEthersSigner();

  useEffect(() => {
    if (!signer || !safeAddress) {
      return;
    }

    const ethAdapter = new EthersAdapter({
      ethers,
      signerOrProvider: signer,
    });
    Safe.create({
      ethAdapter,
      safeAddress,
    })
      .then((safe) => setValue(safe))
      .catch((err) => setError(err));
  }, [signer, safeAddress]);

  return { value, loading: !value, error };
}

export function useCreateTransaction(
  safeAddress: string,
  safeTransactionData: SafeTransactionDataPartial | MetaTransactionData[],
) {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState<SafeTransaction>();

  const { value: safe } = useSafe(safeAddress);

  useEffect(() => {
    if (!safe) {
      setError("Not connected to wallet or safe not found.");
      return;
    }

    setLoading(true);

    safe
      .createTransaction({ safeTransactionData, onlyCalls: true })
      .then((safeTransaction) => setValue(safeTransaction))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, [safe, safeTransactionData]);

  return {
    value,
    error,
    loading,
  };
}

export function useQueueTransaction(
  safeAddress: string,
  safeTransactionData: SafeTransactionDataPartial | MetaTransactionData[],
  nonce?: number,
) {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState<{ safeTxHash: string; nonce: string }>();

  const { data: walletClient } = useWalletClient();
  const { address, isConnecting, isDisconnected } = useAccount();
  const { value: safeApiKit } = useSafeAPIKit();
  const { value: safe } = useSafe(safeAddress);

  const trigger = async () => {
    if (!safe || !walletClient || !safeApiKit || !address) {
      setError("Not connected to wallet or safe not found.");
      return;
    }

    const options: SafeTransactionOptionalProps = {
      nonce, // Optional
    };

    setLoading(true);

    try {
      const safeTransaction = await safe.createTransaction({
        safeTransactionData,
        options,
        onlyCalls: true,
      });
      const senderAddress = address;
      const safeTxHash = await safe.getTransactionHash(safeTransaction);
      const signature = await safe.signTransactionHash(safeTxHash);

      // Propose transaction to the service
      await safeApiKit.proposeTransaction({
        safeAddress: await safe.getAddress(),
        safeTransactionData: safeTransaction.data,
        safeTxHash,
        senderAddress,
        senderSignature: signature.data,
      });

      setValue({
        safeTxHash: safeTxHash,
        nonce: safeTransaction.data.nonce.toString(),
      });
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    value,
    error,
    loading,
    trigger,
  };
}

async function fetchSafeWithAddress(url: string) {
  const res = await fetch(url);
  if (res.status !== 200) {
    return false;
  }
  const json = await res.json();
  return json.address !== undefined;
}

function validSafeFetcher(): Fetcher<any, string> {
  return fetchSafeWithAddress;
}

export function useIsValidAddress(
  address: string,
  shouldFetch: boolean = true,
) {
  return useSWR(
    shouldFetch ? `${SAFE_API}${address}` : null,
    validSafeFetcher(),
  );
}

export async function isValidSafe(address: string) {
  return fetchSafeWithAddress(`${SAFE_API}${address}`);
}
