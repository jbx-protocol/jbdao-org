import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { GraphQLClient, ClientContext } from "graphql-hooks";
import memCache from "graphql-hooks-memcache";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, http, fallback, useAccount } from "wagmi";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { gnosis, goerli, mainnet, optimism } from "wagmi/chains";

import { NextQueryParamProvider } from "next-query-params";

import { Flowbite } from "flowbite-react";
import { ErrorBoundary } from "@/components/Site";
import { Analytics } from "@vercel/analytics/react";

import { SessionProvider } from "next-auth/react";
import { RainbowKitSiweNextAuthProvider } from "@rainbow-me/rainbowkit-siwe-next-auth";
import { NetworkContext } from "../context/NetworkContext";
import { SNAPSHOT_HEADERS, SNAPSHOT_HUB } from "../constants/Snapshot";
import { SWRConfig } from "swr";
import console from "@/utils/functions/console.debug";
import { Toaster } from "react-hot-toast";
import { customChains } from "config/custom-chains";

console.debug("Hello from _app.tsx! 🚀");

const graphqlClient = new GraphQLClient({
  url: `${SNAPSHOT_HUB}/graphql`,
  headers: SNAPSHOT_HEADERS,
  cache: memCache({ size: 200 }),
});

const theme = {
  theme: {
    tooltip: {
      target: "",
      content: "relative z-20 max-w-[200px] lg:max-w-[300px] 2xl:max-w-[500px]",
    },
  },
};

const wagmiConfig = getDefaultConfig({
  appName: "Nance Interface",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "",
  chains: customChains as any,
  transports: {
    [mainnet.id]: fallback([
      http("https://eth.llamarpc.com"),
      http(
        `https://mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_KEY}`,
      ),
    ]),
    [optimism.id]: fallback([
      http("https://rpc.ankr.com/optimism"),
      http(
        `https://optimism-mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_KEY}`,
      ),
    ]),
    [gnosis.id]: http("https://rpc.ankr.com/gnosis"),
    [goerli.id]: fallback([
      http("https://rpc.ankr.com/eth_goerli"),
      http(`https://goerli.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_KEY}`),
    ]),
  },
});

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: any) {
  const { chain } = useAccount();
  const network = chain?.name || mainnet.name;

  return (
    <SessionProvider
      session={pageProps.session}
      // Re-fetch session every 5 minutes
      refetchInterval={5 * 60}
      // Re-fetches session when window is focused
      refetchOnWindowFocus={true}
    >
      <RainbowKitSiweNextAuthProvider>
        <RainbowKitProvider
          appInfo={{
            appName: "Nance",
            learnMoreUrl: "https://docs.nance.app",
          }}
        >
          <ClientContext.Provider value={graphqlClient}>
            <NextQueryParamProvider>
              <Flowbite theme={theme}>
                <ErrorBoundary>
                  <NetworkContext.Provider value={network}>
                    <SWRConfig value={{ revalidateOnFocus: false }}>
                      <Component {...pageProps} />
                    </SWRConfig>
                  </NetworkContext.Provider>
                </ErrorBoundary>
              </Flowbite>
            </NextQueryParamProvider>
          </ClientContext.Provider>
        </RainbowKitProvider>
      </RainbowKitSiweNextAuthProvider>
    </SessionProvider>
  );
}

function WagmiWrappedApp({ Component, pageProps }: any) {
  return (
    <>
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <Toaster />
          <MyApp Component={Component} pageProps={pageProps} />
        </QueryClientProvider>
      </WagmiProvider>

      <Analytics />
    </>
  );
}

export default WagmiWrappedApp;
