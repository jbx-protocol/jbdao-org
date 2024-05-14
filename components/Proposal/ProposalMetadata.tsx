import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import { NANCE_API_URL } from "@/constants/Nance";
import { openInDiscord } from "@/utils/functions/discord";
import { useContext } from "react";
import Link from "next/link";
import ActionLabel from "@/components/ActionLabel/ActionLabel";
import { ProposalContext } from "./context/ProposalContext";
import { useSpaceInfo } from "@/utils/hooks/NanceHooks";
import { SpaceContext } from "@/context/SpaceContext";
import { format, toDate } from "date-fns";

export default function ProposalMetadata() {
  const { commonProps } = useContext(ProposalContext);
  const shouldFetchSpaceInfo = commonProps?.actions?.length > 0;
  const { data } = useSpaceInfo({ space: commonProps.space}, shouldFetchSpaceInfo);
  return (
    <div className="my-4 rounded-md border bg-gray-100 px-4 py-5 sm:px-6">
      <Link
        href={`${NANCE_API_URL}/${commonProps.space}/proposal/${commonProps.uuid}`}
        className="mb-3 text-gray-500">
          Metadata
      </Link>
      <div className="gaps-4">
        {commonProps.actions && commonProps.actions.length > 0 && (
          <>
            <p className="col-span-2 font-medium">Actions:</p>

            <div className="col-span-2 mt-2 flex w-full flex-col space-y-2">
              <SpaceContext.Provider value={data?.data}>
                {commonProps.actions.map((action, index) => (
                  <ActionLabel
                    action={action}
                    space={commonProps.space}
                    key={index}
                  />
                ))}
              </SpaceContext.Provider>
            </div>
          </>
        )}

        <div className="mt-2 grid grid-cols-3">
          {commonProps!.governanceCycle && (
            <>
              <span className="font-medium">Cycle:</span>
              <span className="col-span-2">
                <Link
                  className="col-span-2"
                  href={`/s/${commonProps.space}/?cycle=${
                    commonProps!.governanceCycle
                  }`}
                >
                  {commonProps!.governanceCycle}
                  <ArrowTopRightOnSquareIcon className="inline h-3 w-3 text-xs" />
                </Link>
              </span>
            </>
          )}

          {commonProps!.discussion && (
            <>
              <span className="font-medium">Discussion:</span>
              <a
                className="col-span-2"
                target="_blank"
                rel="noreferrer"
                href={openInDiscord(commonProps!.discussion)}
              >
                {getDomain(commonProps!.discussion)}
                <ArrowTopRightOnSquareIcon className="inline h-3 w-3 text-xs" />
              </a>
            </>
          )}

          {commonProps.snapshotSpace && commonProps.snapshotHash && (
            <>
              <span className="font-medium">Snapshot view:</span>
              <a
                className="col-span-2"
                target="_blank"
                rel="noreferrer"
                href={`https://snapshot.org/#/${
                  commonProps!.snapshotSpace
                }/proposal/${commonProps!.snapshotHash}`}
              >
                {commonProps!.snapshotHash.substring(0, 8)}
                <ArrowTopRightOnSquareIcon className="inline h-3 w-3 text-xs" />
              </a>
            </>
          )}

          {commonProps.voteStart && commonProps.voteEnd && (
            <>
              <span className="font-medium">Vote start:</span>
              <span className="col-span-2 font-mono">
                {format(toDate(commonProps.voteStart * 1000), "MM/dd/yy hh:mm a")}
              </span>
              <span className="font-medium">Vote end:</span>
              <span className="col-span-2 font-mono">
                {format(toDate(commonProps.voteEnd * 1000), "MM/dd/yy hh:mm a")}
              </span>
            </>
          )}

          {!commonProps!.discussion && commonProps!.status === "Discussion" && (
            <>
              <span className="font-medium">Discussion:</span>
              <a
                target="_blank"
                rel="noreferrer"
                className="col-span-2 cursor-pointer text-sky-800"
                onClick={() => {
                  fetch(
                    `${NANCE_API_URL}/${
                      commonProps!.space
                    }/discussion/${commonProps?.uuid}`,
                  ).then((response) => {
                    response.json().then((data) => {
                      if (data.success) window.location.reload();
                    });
                  });
                }}
              >
                start discussion
                <ArrowTopRightOnSquareIcon className="inline h-3 w-3 text-xs" />
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function getDomain(url: string) {
  // parse data between https:// and .<ending> to get name of domain, dont include www. or .<ending> in the name
  const domain = url.replace(/(https?:\/\/)?(www\.)?/i, "").split(".")[0];
  return domain;
}
