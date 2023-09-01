import { formatDistanceToNowStrict, toDate } from "date-fns";
import ColorBar from "../../../ColorBar";
import { SnapshotProposal } from "../../../../hooks/snapshot/Proposals";
import { Proposal } from "../../../../models/NanceTypes";
import { ClockIcon, PencilSquareIcon } from "@heroicons/react/24/solid";

export default function VotesBar({ snapshotProposal, proposal }: { snapshotProposal: SnapshotProposal, proposal: Proposal }) {
  const hasSnapshotVoting = snapshotProposal !== undefined;
  
  if (hasSnapshotVoting) {
    return (
      <div className="flex flex-col space-y-1">
        <VotingTimeIndicator p={snapshotProposal} />
  
        {['approval', 'ranked-choice', 'quadratic', 'weighted'].includes(snapshotProposal?.type) ? (
        // sum all scores to get the total score
          <ColorBar greenScore={snapshotProposal.scores_total || 0} redScore={0} />
        ) : (
          <ColorBar greenScore={proposal?.voteResults?.scores[0] || 0} redScore={proposal?.voteResults?.scores[1] || 0} />
        )
        }
      </div>
    );
  } else {
    return (
      <div className="flex flex-col space-y-1">

        {proposal.status === "Cancelled" && (
          <ColorBar greenScore={proposal?.temperatureCheckVotes?.[0] || 0} redScore={proposal?.temperatureCheckVotes?.[1] || 0} threshold={10} />
        )}

        {proposal.status === "Temperature Check" && (
          <div className="flex space-x-1 text-xs justify-center place-items-center">
            <ClockIcon className="h-3 w-3" />
          </div>
        )}
  
      </div>
    );
  }
}

function VotingTimeIndicator({p}: {p: SnapshotProposal}) {
  if (!p) return null;
  
  const currentTime = Math.floor(Date.now() / 1000);
  const startLabel = formatDistanceToNowStrict(toDate(p.start * 1000), { addSuffix: true });
  const endLabel = formatDistanceToNowStrict(toDate(p.end * 1000), { addSuffix: true });

  if (currentTime < p.start) {
    return (
      <div className="flex space-x-1 text-xs justify-center place-items-center">
        <PencilSquareIcon className="h-3 w-3" />
        <p>{startLabel}</p>
      </div>
    );
  } else if (currentTime >= p.start && currentTime <= p.end) {
    return (
      <div className="flex space-x-1 text-xs justify-center place-items-center">
        <ClockIcon className="h-3 w-3" />
        <p>{endLabel}</p>
      </div>
    );
  } else {
    return null;
  }
}