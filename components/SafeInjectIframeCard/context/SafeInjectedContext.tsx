// Modified from https://github.com/impersonator-eth/impersonator/blob/c27320c4d9029735c1ff5a03ab659e44e274966f/src/contexts/SafeInjectContext.tsx
// Respect to the original author @impersonator-eth
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
  PropsWithChildren,
} from "react";
import { providers, utils } from "ethers";
import { useAppCommunicator } from "../helpers/communicator";
import {
  InterfaceMessageIds,
  InterfaceMessageProps,
  Methods,
  MethodToResponse,
  RequestId,
  RPCPayload,
  SignMessageParams,
  SignTypedMessageParams,
  Transaction,
} from "../types";
import { useEthersProvider } from "@/utils/hooks/ViemAdapter";

interface TransactionWithId extends Transaction {
  id: number;
}

type SafeInjectContextType = {
  address: string | undefined;
  appUrl: string | undefined;
  //rpcUrl: string | undefined;
  iframeRef: React.RefObject<HTMLIFrameElement> | null;
  latestTransaction: TransactionWithId | undefined;
  setAddress: React.Dispatch<React.SetStateAction<string | undefined>>;
  setAppUrl: React.Dispatch<React.SetStateAction<string | undefined>>;
  //setRpcUrl: React.Dispatch<React.SetStateAction<string | undefined>>;
  sendMessageToIFrame: Function;
};

export const SafeInjectContext = createContext<SafeInjectContextType>({
  address: undefined,
  appUrl: undefined,
  //rpcUrl: undefined,
  iframeRef: null,
  latestTransaction: undefined,
  setAddress: () => {},
  setAppUrl: () => {},
  //setRpcUrl: () => {},
  sendMessageToIFrame: () => {},
});

export interface FCProps {
  children: React.ReactNode;
}

export const SafeInjectProvider: React.FunctionComponent<FCProps> = ({
  children,
}) => {
  const [address, setAddress] = useState<string | undefined>(
    "0xca6Ed3Fdc8162304d7f1fCFC9cA3A81632d5E5B0",
  );
  const [appUrl, setAppUrl] = useState<string>();
  // const [rpcUrl, setRpcUrl] = useState<string>();
  // const [provider, setProvider] = useState<providers.StaticJsonRpcProvider>();
  const ethersProvider = useEthersProvider();
  const provider =
    ((ethersProvider as providers.FallbackProvider)?.providerConfigs[0]
      ?.provider as providers.JsonRpcProvider) ||
    (ethersProvider as providers.JsonRpcProvider);
  const [latestTransaction, setLatestTransaction] =
    useState<TransactionWithId>();

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const communicator = useAppCommunicator(iframeRef);

  const sendMessageToIFrame = useCallback(
    function <T extends InterfaceMessageIds>(
      message: InterfaceMessageProps<T>,
      requestId?: RequestId,
    ) {
      const requestWithMessage = {
        ...message,
        requestId: requestId || Math.trunc(window.performance.now()),
        version: "0.4.2",
      };

      if (iframeRef) {
        iframeRef.current?.contentWindow?.postMessage(
          requestWithMessage,
          appUrl!,
        );
      }
    },
    [iframeRef, appUrl],
  );

  // useEffect(() => {
  //   if (!rpcUrl) return;

  //   setProvider(new providers.StaticJsonRpcProvider(rpcUrl));
  // }, [rpcUrl]);

  useEffect(() => {
    if (!provider) return;

    communicator?.on(Methods.getSafeInfo, async () => {
      const ret = {
        safeAddress: address,
        chainId: (await provider.getNetwork()).chainId,
        owners: [],
        threshold: 1,
        isReadOnly: false,
      };
      return ret;
    });

    communicator?.on(Methods.getEnvironmentInfo, async () => ({
      origin: document.location.origin,
    }));

    communicator?.on(Methods.rpcCall, async (msg) => {
      const params = msg.data.params as RPCPayload;

      try {
        const response = (await provider.send(
          params.call,
          params.params,
        )) as MethodToResponse["rpcCall"];
        return response;
      } catch (err) {
        return err;
      }
    });

    communicator?.on(Methods.sendTransactions, (msg) => {
      // @ts-expect-error explore ways to fix this
      const transactions = (msg.data.params.txs as Transaction[]).map(
        ({ to, ...rest }) => ({
          to: utils.getAddress(to), // checksummed
          ...rest,
        }),
      );
      setLatestTransaction({
        id: parseInt(msg.data.id.toString()),
        ...transactions[0],
      });
      // openConfirmationModal(transactions, msg.data.params.params, msg.data.id)
    });

    communicator?.on(Methods.signMessage, async (msg) => {
      const { message } = msg.data.params as SignMessageParams;

      // openSignMessageModal(message, msg.data.id, Methods.signMessage)
    });

    communicator?.on(Methods.signTypedMessage, async (msg) => {
      const { typedData } = msg.data.params as SignTypedMessageParams;

      // openSignMessageModal(typedData, msg.data.id, Methods.signTypedMessage)
    });
  }, [communicator, address, provider]);

  return (
    <SafeInjectContext.Provider
      value={{
        address,
        appUrl,
        //rpcUrl,
        iframeRef,
        latestTransaction,
        setAddress,
        setAppUrl,
        //setRpcUrl,
        sendMessageToIFrame,
      }}
    >
      {children}
    </SafeInjectContext.Provider>
  );
};

export const useSafeInject = () => useContext(SafeInjectContext);
