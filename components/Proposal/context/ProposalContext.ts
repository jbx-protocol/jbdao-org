import { Action, ProposalPacket } from "@nance/nance-sdk";
import { SnapshotProposal } from "@/models/SnapshotTypes";
import { createContext } from "react";

export interface ProposalCommonProps {
  space: string;
  snapshotSpace: string;
  status: string;
  title: string;
  author: string;
  coauthors: string[];
  body: string;
  created: number;
  edited: number;
  voteStart: number;
  voteEnd: number;
  snapshot: string;
  snapshotHash: string;
  ipfs: string;
  discussion: string;
  governanceCycle?: number;
  uuid: string;
  actions: Action[];
  proposalId?: string;
  minTokenPassingAmount: number;
  minVotingPowerSubmissionBalance: number;
}

export const ProposalContext = createContext<{
  commonProps: ProposalCommonProps;
  proposalInfo: SnapshotProposal | undefined;
  isLoading: boolean;
  nextProposalId: number;
  proposalIdPrefix?: string;
  proposalSummary?: string;
  threadSummary?: string;
  mutateNanceProposal?: (data: Partial<ProposalPacket>) => void;
  refetchSnapshotProposal?: () => void;
    }>({
      commonProps: {
        space: "",
        snapshotSpace: "",
        status: "",
        title: "",
        author: "",
        coauthors: [],
        body: "",
        created: 0,
        edited: 0,
        voteStart: 0,
        voteEnd: 0,
        snapshot: "",
        snapshotHash: "",
        ipfs: "",
        discussion: "",
        governanceCycle: 0,
        uuid: "",
        actions: [],
        proposalId: "",
        minTokenPassingAmount: 0,
        minVotingPowerSubmissionBalance: 0,
      },
      isLoading: true,
      proposalInfo: undefined,
      nextProposalId: 0,
      proposalIdPrefix: undefined,
      proposalSummary: undefined,
      threadSummary: undefined,
      mutateNanceProposal: undefined,
      refetchSnapshotProposal: undefined,
    });
