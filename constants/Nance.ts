export const NANCE_API_URL = process.env.NEXT_PUBLIC_NANCE_API_URL || "https://api.nance.app";
export const NANCE_PROXY_API_URL = "/api/nance";
// FIXME should not has fixed value for generic nance.app
export const NANCE_DEFAULT_JUICEBOX_PROJECT: number = 1;
export const NANCE_DEFAULT_IPFS_GATEWAY = 'https://nance.infura-ipfs.io';
export const NANCE_PUBLIC_ADDRESS = '0x50e70c43a5DD812e2309eAcea61348041011b4BA';

export const proposalSetStatuses = {
  0: "Discussion",
  1: "Draft",
  2: "Revoked",
  3: "Archived",
};

export const SUPPORTED_NFTS = [
  "0x8250e3cE89c8C380449de876882F5EDAA6EF44c7", // GGG NFT on OP Mainnet
  "0xAabC2A962301b75F691AfF5dcc6d31A255c037A5", // test NFT on OP Mainnet
];