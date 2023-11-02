import { ArrowUturnLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useContext, Fragment } from "react";
import { canEditProposal } from "@/utils/functions/nance";
import { ProposalContext } from "../../../pages/s/[space]/[proposal]";
import ProposalNavigator from "./ProposalNavigator";
import ProposalMetadata from "./ProposalMetadata";
import FormattedAddress from "@/components/Address/FormattedAddress";
import MarkdownWithTOC from "@/components/Markdown/MarkdownWithTOC";

export default function ProposalContent({ body }: { body: string }) {
  const { commonProps } = useContext(ProposalContext);

  return (
    <div className="">
      <div className="flex flex-col px-4 py-5 sm:px-6">
        <Link
          href={`/s/${commonProps.space}`}
          className="border-1 mb-4 flex w-fit rounded-md p-2 shadow-sm"
        >
          <ArrowUturnLeftIcon className="mr-1 h-5 w-5" />
          Back
        </Link>

        <h1 id="applicant-information-title" className="text-3xl font-medium">
          {canEditProposal(commonProps.status)
            ? `[${commonProps.status}] `
            : ""}
          {commonProps.title}
        </h1>

        <p className="text-right text-sm text-gray-500">
          by&nbsp;
          <FormattedAddress
            address={commonProps.author}
            style="text-gray-500"
            overrideURLPrefix="/u/"
            openInNewWindow={false}
          />
        </p>
        {commonProps.coauthors.length > 0 && (
          <p className="text-right text-sm text-gray-500">
            co-authored by&nbsp;
            {commonProps.coauthors.map((coauthor, i) => (
              <Fragment key={i}>
                <FormattedAddress
                  address={coauthor}
                  style="text-gray-500"
                  overrideURLPrefix="/u/"
                  openInNewWindow={false}
                />
                {i < commonProps!.coauthors.length - 1 && ", "}
              </Fragment>
            ))}
          </p>
        )}

        <ProposalMetadata />
      </div>

      <div className="px-4 sm:px-6">
        <MarkdownWithTOC body={body} />
      </div>

      <div className="mt-4 px-4 py-5 sm:px-6">
        <ProposalNavigator />
      </div>
    </div>
  );
}
