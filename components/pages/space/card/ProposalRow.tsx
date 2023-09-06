import { classNames } from "../../../../libs/tailwind";
import VotesBar from "./VotesBar";
import FormattedAddress from "../../../ethereum/FormattedAddress";
import { getLastSlash } from "../../../../libs/nance";
import NewVoteButton from "../../../NewVoteButton";
import getVotedIcon from "./VoteIcon";
import ProposalBadgeLabel from "./ProposalBadgeLabel";
import { Proposal } from "../../../../models/NanceTypes";
import ColorBar from "../../../ColorBar";

export default function ProposalRow(
  { proposal, proposalIdx, proposalIdPrefix, snapshotSpace, snapshotProposalDict, votedData, refetch, proposalUrlPrefix }:
    { proposal: Proposal, proposalIdx: number, proposalIdPrefix: string, snapshotSpace: string, snapshotProposalDict: any, votedData: any, refetch: any, proposalUrlPrefix: string }
) {
  return (
    <tr key={proposal.hash} className="hover:bg-slate-100 hover:cursor-pointer"
      onClick={() => {
        window.location.href = `${proposalUrlPrefix}${proposal.proposalId || proposal.hash}`;
      }}
    >
      <td
        className={classNames(
          proposalIdx === 0 ? '' : 'border-t border-transparent',
          'relative py-4 pl-6 pr-3 text-sm hidden md:table-cell'
        )}
      >
        <ProposalBadgeLabel status={proposal.status} />

        {proposalIdx !== 0 ? <div className="absolute right-0 left-6 -top-px h-px bg-gray-200" /> : null}
      </td>
      <td
        className={classNames(
          proposalIdx === 0 ? '' : 'border-t border-gray-200',
          'px-3 py-3.5 text-sm text-gray-500'
        )}
      >
        <div className="flex flex-col space-y-1">
          <div className="text-gray-900 block md:hidden">
            <ProposalBadgeLabel status={proposal.status} />
          </div>
          <span className="text-xs">
            {`GC-${proposal.governanceCycle}, ${proposalIdPrefix}${proposal.proposalId || "tbd"} - by `}
            <FormattedAddress address={proposal.authorAddress} noLink />
          </span>

          <p className="break-words text-base text-black">
            {proposal.title}
          </p>

          <div className="md:hidden">
            <VotesBar proposal={proposal} snapshotProposal={snapshotProposalDict[getLastSlash(proposal.voteURL)]} />
          </div>
        </div>

      </td>
      <td
        className={classNames(
          proposalIdx === 0 ? '' : 'border-t border-gray-200',
          'hidden px-3 py-3.5 text-sm text-gray-500 md:table-cell'
        )}
      >
        <VotesBar proposal={proposal} snapshotProposal={snapshotProposalDict[getLastSlash(proposal.voteURL)]} />
      </td>
      <td
        className={classNames(
          proposalIdx === 0 ? '' : 'border-t border-gray-200',
          'hidden px-3 py-3.5 text-sm text-black md:table-cell text-center'
        )}
      >
        {proposal?.voteResults?.votes || '-'}
      </td>
      <td
        className={classNames(
          proposalIdx === 0 ? '' : 'border-t border-gray-200',
          'px-3 py-3.5 text-sm text-gray-500 hidden md:table-cell text-center'
        )}
      >
        {!votedData?.[getLastSlash(proposal.voteURL)] && snapshotProposalDict[getLastSlash(proposal.voteURL)] && snapshotSpace ?
          <NewVoteButton snapshotSpace={snapshotSpace} proposal={snapshotProposalDict[getLastSlash(proposal.voteURL)]} refetch={refetch} isSmall />
          : <div className="flex justify-center">{getVotedIcon(votedData?.[getLastSlash(proposal.voteURL)]?.choice)}</div>}
      </td>
    </tr>
  );
}

export function ProposalRowSkeleton({ isFirst = false }: { isFirst?: boolean }) {
  return (
    <tr className="hover:bg-slate-100 hover:cursor-pointer">
      <td
        className={classNames(
          isFirst ? '' : 'border-t border-transparent',
          'relative py-4 pl-6 pr-3 text-sm hidden md:table-cell'
        )}
      >
        <ProposalBadgeLabel status="Discussion" />

        {!isFirst ? <div className="absolute right-0 left-6 -top-px h-px bg-gray-200" /> : null}
      </td>

      <td
        className={classNames(
          isFirst ? '' : 'border-t border-gray-200',
          'px-3 py-3.5 text-sm text-gray-500'
        )}
      >
        <div className="flex flex-col space-y-1">
          <div className="text-gray-900 block md:hidden">
            <ProposalBadgeLabel status="Discussion" />
          </div>
          {/* cycle metadata */}
          <span className="text-xs animate-pulse h-4 w-20 bg-slate-200 rounded"></span>
          {/* proposal title */}
          <p className="break-words text-base text-black animate-pulse h-6 w-32 bg-slate-200 rounded"></p>

          <div className="md:hidden">
            <ColorBar greenScore={0} redScore={0} />
          </div>
        </div>

      </td>

      {/* VotesBar */}
      <td
        className={classNames(
          isFirst ? '' : 'border-t border-gray-200',
          'hidden px-3 py-3.5 text-sm text-gray-500 md:table-cell'
        )}
      >
        <ColorBar greenScore={0} redScore={0} noTooltip />
      </td>

      {/* Votes */}
      <td
        className={classNames(
          isFirst ? '' : 'border-t border-gray-200',
          'hidden px-3 py-3.5 text-sm text-black md:table-cell text-center'
        )}
      >
        <div className="flex justify-center">
          <p className="animate-pulse h-6 w-6 bg-slate-200 rounded-full"></p>
        </div>
      </td>

      {/* VotedStatus or NewVoteButton */}
      <td
        className={classNames(
          isFirst ? '' : 'border-t border-gray-200',
          'px-3 py-3.5 text-sm text-gray-500 hidden md:table-cell text-center'
        )}
      >
        <div className="flex justify-center">
          <p className="animate-pulse h-6 w-16 bg-slate-200 rounded"></p>
        </div>
      </td>
    </tr>
  );
}
