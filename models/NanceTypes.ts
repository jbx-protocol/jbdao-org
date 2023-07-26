import { Interface } from "ethers/lib/utils";

export interface APIResponse<T> {
  success: boolean;
  error?: string;
  data: T;
}

export type SpaceInfo = {
  name: string;
  currentCycle: number;
  currentEvent: {
    title: string;
    start: string;
    end: string;
  };
  snapshotSpace: string;
  juiceboxProjectId: string;
  dolthubLink: string;
};

export type ProposalInfo = {
  proposalIdPrefix: string;
  minTokenPassingAmount: number;
};

export type ProposalsPacket = { proposalInfo: ProposalInfo, proposals: Proposal[], privateProposals: Proposal[] };

export type ProposalsPacketWithoutBody = { proposalInfo: ProposalInfo, proposals: Omit<Proposal, 'body'>[] };

export type ProposalUploadPayload = {
  hash: string;
}

export type APIErrorResponse = APIResponse<undefined>;

interface BaseRequest {
  space: string;
}

export interface ProposalsRequest extends BaseRequest {
  cycle: number | null | undefined;
  keyword: string | null | undefined;
  limit: number | null | undefined;
  page: number | null | undefined;
}

export type SpaceInfoRequest = BaseRequest;

export interface ProposalRequest extends BaseRequest {
  hash: string;
}

export interface FetchReconfigureRequest extends BaseRequest {
  version: string;
  address: string;
  datetime: string;
  network: string;
}

export interface SubmitTransactionRequest extends BaseRequest {
  version: string;
  datetime: string;
  signature: Signature
}

export interface FetchReconfigureData {
  transaction: NanceBasicTransaction;
  nonce: string;
  safe: string;
}

export interface NanceBasicTransaction {
  address: string;
  bytes: string;
}

export interface Signature {
  address: string;
  signature: string;
  timestamp: number;
}

export interface ProposalUploadRequest {
  proposal: Pick<Proposal, "hash" | "title" | "body" | "notification" | "actions" | "status">;
}

export interface ProposalDeleteRequest {
  hash: string;
}

export interface ConfigSpaceRequest {
  config: CreateFormValues;
  calendar?: string;
}

export type CreateFormValues = {
  name: string;
  discord: DiscordConfig;
  proposalIdPrefix: string;
}

export type DiscordConfig = {
  guildId: string;
  roleIds: DiscordConfigRoles;
  channelIds: DiscordConfigChannels;
}

export type DiscordConfigChannels = {
  proposals: string;
}

export type DiscordConfigRoles = {
  governance: string;
}

export type JuiceboxConfig = {
  projectId: string;
  gnosisSafeAddress: string;
}

export type SnapshotConfig = {
  space: string;
  minTokenPassingAmount: number;
  passingRatio: number;
}

export type CreateFormKeys = 'name' | 'propertyKeys.proposalIdPrefix' |
  `discord.${keyof DiscordConfig}` |
  `discord.channelIds.${keyof DiscordConfigChannels}`|
  `discord.roleIds.${keyof DiscordConfigRoles}` |
  `snapshot.${keyof SnapshotConfig}` |
  `juicebox.${keyof JuiceboxConfig}`

export type ConfigSpacePayload = {
  space: string;
  spaceOwner: string;
}

// from https://github.com/jigglyjams/nance-ts/blob/main/src/types.ts
type ProposalType = 'Payout' | 'ReservedToken' | 'ParameterUpdate' | 'ProcessUpdate' | 'CustomTransaction';

export interface Proposal {
  hash: string;
  title: string;
  body?: string;
  translation?: {
    body?: string;
    language?: string;
  },
  notification?: Notification;
  url: string;
  governanceCycle?: number;
  date?: string,
  translationURL?: string;
  status: string;
  proposalId: number | null;
  author?: string;
  coauthors?: string[];
  discussionThreadURL: string;
  ipfsURL: string;
  voteURL: string;
  voteSetup?: SnapshotVoteOptions;
  internalVoteResults?: InternalVoteResults;
  voteResults?: VoteResults;
  authorAddress?: string;
  authorDiscordId?: string;
  temperatureCheckVotes?: number[];
  createdTime?: Date;
  lastEditedTime?: Date;
  actions: Action[];
}

export type Action = {
  type: 'Payout' | 'Reserve' | 'Transfer' | 'Custom Transaction';
  payload: Payout | Reserve | Transfer | CustomTransaction;
  uuid?: string;
}

export type Payout = {
  type?: 'address' | 'project' | 'allocator';
  address: string;
  project?: number;
  amountUSD: number;
  count: number;
  payName: string;
  uuid?: string;
};

type Notification = {
  discordUserId: string;
  expiry: boolean;
  execution: boolean;
  progress: boolean;
};

/**
  @member preferClaimed A flag that only has effect if a projectId is also specified, and the project has a token contract attached. If so, this flag indicates if the tokens that result from making a payment to the project should be delivered claimed into the beneficiary's wallet, or unclaimed to save gas.
  @member preferAddToBalance A flag indicating if a distribution to a project should prefer triggering it's addToBalance function instead of its pay function.
  @member percent The percent of the whole group that this split occupies. This number is out of `JBConstants.SPLITS_TOTAL_PERCENT`.
  @member projectId The ID of a project. If an allocator is not set but a projectId is set, funds will be sent to the protocol treasury belonging to the project who's ID is specified. Resulting tokens will be routed to the beneficiary with the claimed token preference respected.
  @member beneficiary An address. The role the of the beneficary depends on whether or not projectId is specified, and whether or not an allocator is specified. If allocator is set, the beneficiary will be forwarded to the allocator for it to use. If allocator is not set but projectId is set, the beneficiary is the address to which the project's tokens will be sent that result from a payment to it. If neither allocator or projectId are set, the beneficiary is where the funds from the split will be sent.
  @member lockedUntil Specifies if the split should be unchangeable until the specified time, with the exception of extending the locked period.
  @member allocator If an allocator is specified, funds will be sent to the allocator contract along with all properties of this split.
*/
export interface JBSplitNanceStruct {
  preferClaimed: boolean
  preferAddToBalance: boolean
  percent: number
  projectId: number
  beneficiary: string
  lockedUntil: number
  allocator: string
}

export type Reserve = {
  splits: JBSplitNanceStruct[]
};

export type Transfer = {
  contract: string;
  to: string;
  amount: string;
  decimals: number;
}

export type CustomTransaction = {
  contract: string;
  value: string;
  // function approve(address guy, uint256 wad) returns (bool)
  // can pass as ABI
  // can have unnamed parameters
  functionName: string;
  args: any[];
  tenderlyId: string;
}

export function extractFunctionName(str: string) {
  return str.split("(")[0].split(" ").slice(-1)
}

export function parseFunctionAbiWithNamedArgs(functionAbi: string, args: any[] | object) {
  if(!args) return [];

  let abi = functionAbi;
  // compatiable with old minimal format functionName
  if(!functionAbi.startsWith("function")) {
    abi = `function ${functionAbi}`;
  }

  const ethersInterface = new Interface([abi]);
  const paramNames = ethersInterface.fragments[0].inputs.map(p => p.name || "_")
  let dict: any = [];
  Object.values(args).forEach((val, index) => dict.push([paramNames[index] || '_', val]));

  return dict;
}

export type ParameterUpdate = {
  durationDays: number;
  discountPercentage: number;
  reservedPercentage: number;
  redemptionPercentage: number;
};

export type InternalVoteResults = {
  voteProposalId: string;
  totalVotes: number;
  scoresState: string;
  scores: Record<string, number>;
  percentages: Record<string, number>;
  outcomePercentage: string;
  outcomeEmoji: string;
};

export type VoteResults = {
  choices: string[];
  scores: number[];
  votes: number;
};

export type GnosisTransaction = {
  address: string;
  bytes: string;
};

export type ProposalNoHash = Omit<Proposal, 'hash'>;

export type ProposalStore = Record<string, ProposalNoHash>;

export interface NanceConfig {
  name: string;
  juicebox: {
    network: string;
    projectId: string;
    gnosisSafeAddress: string;
  };
  discord: {
    API_KEY: string;
    guildId: string;
    roles: {
      governance: string;
    };
    channelIds: {
      proposals: string;
      bookkeeping: string;
      transactions: string;
    }
    poll: {
      voteYesEmoji: string;
      voteNoEmoji: string;
      voteGoVoteEmoji: string;
      votePassEmoji: string;
      voteCancelledEmoji: string;
      minYesVotes: number;
      yesNoRatio: number;
      showResults: boolean;
    };
    reminder: {
      channelIds: string[];
      imagesCID: string;
      imageNames: string[];
      links: Record<string, string>;
    };
  };
  propertyKeys: PropertyKeys;
  notion: {
    API_KEY: string;
    enabled: boolean;
    database_id: string;
    current_cycle_block_id: string;
    payouts_database_id: string;
    reserves_database_id: string;
  };
  dolt: DoltConfig,
  snapshot: {
    base: string;
    space: string;
    choices: string[];
    minTokenPassingAmount: number;
    passingRatio: number;
  };
  calendarCID?: string;
}

export type DoltConfig = {
  enabled: boolean;
  owner: string;
  repo: string;
};

export type PropertyKeys = {
  proposalId: string;
  status: string;
  statusTemperatureCheck: string;
  statusVoting: string;
  statusApproved: string;
  statusCancelled: string;
  proposalIdPrefix: string;
  discussionThread: string;
  ipfs: string;
  vote: string;
  type: string;
  typeRecurringPayout: string;
  typePayout: string;
  governanceCycle: string;
  governanceCyclePrefix: string;
  reservePercentage: string;
  payoutName: string;
  payoutType: string;
  payoutAmountUSD: string;
  payoutAddress: string;
  payoutCount: string;
  payName: string;
  treasuryVersion: string;
  payoutFirstFC: string;
  payoutLastFC: string;
  payoutRenewalFC: string;
  payoutProposalLink: string;
  publicURLPrefix: string;
};

export interface DateEvent {
  title: string;
  start: Date;
  end: Date;
  inProgress: boolean;
}

export interface PollResults {
  voteYesUsers: string[];
  voteNoUsers: string[];
}

export interface PollEmojis {
  voteYesEmoji: string;
  voteNoEmoji: string;
}

export interface PinataKey {
  KEY: string;
  SECRET: string;
}

export interface GithubFileChange {
  path: string,
  contents: string
}

export type SnapshotVoteOptions = {
  type: string,
  choices: string[]
};
