import { useRouter } from "next/router";
import { fetchProposalInfo, SnapshotProposal, useProposalVotes, VOTES_PER_PAGE } from "../../hooks/snapshot/Proposals";
import { useAccount } from 'wagmi'
import SiteNav from "../../components/SiteNav";
import { fetchSpaceInfo, SpaceInfo } from "../../hooks/snapshot/SpaceInfo";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import { Tooltip } from 'flowbite-react';
import FormattedAddress from "../../components/FormattedAddress";
import { fromUnixTime, format, formatDistanceToNowStrict } from "date-fns";
import { createContext, useContext, useEffect, useState } from "react";
import VotingModal from "../../components/VotingModal";
import { withDefault, NumberParam, createEnumParam, useQueryParams } from "next-query-params";
import Pagination from "../../components/Pagination";
import { formatChoices } from "../../libs/snapshotUtil";
import ProposalStats from "../../components/ProposalStats";
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

const formatter = new Intl.NumberFormat('en-GB', { notation: "compact" , compactDisplay: "short" });
const formatNumber = (num) => formatter.format(num);

const labelWithTooltip = (label: string, tooltip: string, colors: string) => (
    <Tooltip
      content={tooltip}
      trigger="hover"
    >
        <span className={classNames(
            colors,
            "flex-shrink-0 inline-block px-2 py-0.5 text-xs font-medium rounded-full"
        )}>
            {label}
        </span>
    </Tooltip>
)

const getColorOfPencentage = (percentage: number) => {
    if(percentage>33) {
        return 'text-red-600';
    } else if(percentage>20) {
        return 'text-orange-600';
    } else if(percentage>11) {
        return 'text-amber-600';
    } else {
        return '';
    }
}

const getColorOfChoice = (choice: string) => {
    if(choice=='For') {
        return 'text-green-500';
    } else if(choice=='Against') {
        return 'text-red-500';
    } else {
        return '';
    }
}

export async function getServerSideProps(context) {
    // Fetch data from external API
    const spaceInfo = await fetchSpaceInfo("jbdao.eth");
    const proposalInfo = await fetchProposalInfo(context.params.proposal);
  
    // Pass data to the page via props
    return { props: { spaceInfo, proposalInfo } }
}

interface ProposalContextType {
    spaceInfo: SpaceInfo,
    proposalInfo: SnapshotProposal
}

const ProposalContext = createContext<ProposalContextType>(undefined);

export default function SnapshotProposalPage({ spaceInfo, proposalInfo }: { spaceInfo: SpaceInfo, proposalInfo: SnapshotProposal }) {
    // router
    const router = useRouter();
    const space = "jbdao.eth";
    const { proposal } = router.query;
    const hideAbstain = true;

    const [query, setQuery] = useQueryParams({ 
        page: withDefault(NumberParam, 1), 
        sortBy: withDefault(createEnumParam(["created", "vp"]), "created"),
        withField: withDefault(createEnumParam(["reason", "app"]), "")
    });

    const { loading, data, error } = useProposalVotes(proposalInfo, Math.max((query.page-1)*VOTES_PER_PAGE, 0), query.sortBy as "created" | "vp", query.withField as "reason" | "app" | "");

    return (
        <>
            <SiteNav 
                pageTitle={`${proposalInfo.title} - ${spaceInfo?.name || (space as string) || ''}`} 
                description={proposalInfo.body?.slice(0, 140) || 'No content'} 
                image={`https://cdn.stamp.fyi/space/${space as string}?w=1200&h=630`}
                withWallet />

            <div className="min-h-full">
                <main className="py-10">
                    <ProposalContext.Provider value={{spaceInfo, proposalInfo}}>
                        <ProposalHeader />

                        <div className="mx-auto mt-8 grid max-w-3xl grid-cols-1 gap-6 sm:px-6 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-3">
                            <div className="space-y-6 lg:col-span-2 lg:col-start-1">
                                {/* Content */}
                                <section aria-labelledby="applicant-information-title">
                                    <ProposalContent proposalSnapshotHash={proposal} />
                                </section>
                            </div>

                            <section aria-labelledby="stats-title" className="lg:col-span-1 lg:col-start-3">
                                <div className="bg-white px-4 py-5 shadow sm:rounded-lg sm:px-6 sticky top-6 bottom-6 opacity-100 h-[52rem]">
                                    <h2 id="timeline-title" className="text-lg font-medium text-gray-900">
                                        Stats
                                    </h2>

                                    <div className="mt-6 flow-root">
                                        <ProposalStats proposal={proposalInfo} hideAbstain={hideAbstain} />
                                    </div>

                                    <div className="flex overflow-y-scroll h-[20rem] border-t">
                                        <ul role="list" className="space-y-2 pt-2">
                                            {loading && "loading..."}
                                            {data?.votesData?.map((vote) => (
                                                <li key={vote.id}>
                                                    <div className="flex flex-col">
                                                        <div className="text-sm flex justify-between">
                                                            <div>
                                                                <FormattedAddress address={vote.voter} style="text-gray-900" overrideURLPrefix="https://juicetool.xyz/snapshot/profile/" openInNewWindow={true} />
                                                                &nbsp;
                                                                <span className={classNames(
                                                                    getColorOfChoice(formatChoices(proposalInfo.type, vote.choice)),
                                                                    ''
                                                                )}>
                                                                    voted {formatChoices(proposalInfo.type, vote.choice)}
                                                                </span>
                                                            </div>

                                                            <div>
                                                                {`${formatNumber(vote.vp)} (${(vote.vp*100/proposalInfo?.scores_total).toFixed()}%)`}
                                                            </div>
                                                            
                                                        </div>

                                                        {
                                                            vote.reason && (
                                                                <div className="text-sm text-gray-600">
                                                                    {vote.reason}
                                                                </div>
                                                            )
                                                        }
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                </div>
                            </section>
                        </div>
                    </ProposalContext.Provider>
                </main>
            </div>
        </>
    )
}

function ProposalHeader() {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [voteDisabled, setVoteDisabled] = useState(true);
    const [voteTip, setVoteTip] = useState("Proposal is not active");
    const { address, isConnected } = useAccount();
    const { spaceInfo, proposalInfo } = useContext(ProposalContext);

    useEffect(() => {
        if(proposalInfo?.state === 'active') {
            if(isConnected) {
                setVoteTip("Proposal is active and you can vote on it");
                setVoteDisabled(false);
            } else {
                setVoteTip("You haven't connected wallet");
            }
        }
    }, [isConnected, proposalInfo]);

    return (
        <div className="mx-auto max-w-3xl px-4 sm:px-6 md:flex md:items-center md:justify-between md:space-x-5 lg:max-w-7xl lg:px-8">
            <div className="flex items-center space-x-5">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{proposalInfo.title}</h1>
                    <p className="text-sm font-medium text-gray-500">
                    By&nbsp;
                    <FormattedAddress address={proposalInfo.author} style="text-gray-900" overrideURLPrefix="/snapshot/profile/" openInNewWindow={false} />
                    &nbsp;on <time dateTime={proposalInfo.created ? fromUnixTime(proposalInfo.created).toString() : ''}>{proposalInfo.created && format(fromUnixTime(proposalInfo.created), 'MMMM d, yyyy')}</time>
                    </p>
                </div>
            </div>
            <div className="justify-stretch mt-6 flex flex-col-reverse space-y-4 space-y-reverse sm:flex-row-reverse sm:justify-end sm:space-y-0 sm:space-x-3 sm:space-x-reverse md:mt-0 md:flex-row md:space-x-3">
                <Link href={`/`}>
                    <a className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-100">
                        Back
                    </a>
                </Link>
                <button className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => setModalIsOpen(true)}
                    disabled={voteDisabled}>

                    <Tooltip trigger="hover" content={voteTip}>
                        <span>Vote</span>
                    </Tooltip>
                </button>
                {proposalInfo?.choices && (
                    <VotingModal modalIsOpen={modalIsOpen} closeModal={() => setModalIsOpen(false)} address={address} spaceId="jbdao.eth" proposal={proposalInfo} spaceHideAbstain={spaceInfo.voting.hideAbstain} />
                )}
            </div>
        </div>
    )
}

function ProposalContent({proposalSnapshotHash}) {
    const { spaceInfo, proposalInfo } = useContext(ProposalContext);

    const hideAbstain = spaceInfo.voting.hideAbstain && proposalInfo.type === "basic";
    const totalScore = hideAbstain ? 
        proposalInfo.scores_total-(proposalInfo?.scores[2]??0)
        : proposalInfo.scores_total;

    return (
        <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 flex space-x-3 flex-wrap">
                <h2 id="applicant-information-title" className="text-lg font-medium leading-6 text-gray-900">
                    Proposal
                </h2>

                {/* Proposal status */}
                <div className='min-w-fit'>
                    {proposalInfo.state === 'active' && (
                        <span className="text-green-800 bg-green-100 flex-shrink-0 inline-block px-2 py-0.5 text-xs font-medium rounded-full">
                            Active for {formatDistanceToNowStrict(fromUnixTime(proposalInfo.end))}
                        </span>
                    )}
                    {proposalInfo.state === 'pending' && labelWithTooltip('Pending', 'This proposal is currently pending and not open for votes.', 'text-yellow-800 bg-yellow-100')}
                    {proposalInfo.state === 'closed' && (
                        <span className="text-gray-800 bg-gray-100 flex-shrink-0 inline-block px-2 py-0.5 text-xs font-medium rounded-full">
                            Closed {formatDistanceToNowStrict(fromUnixTime(proposalInfo.end), { addSuffix: true })}
                        </span>
                    )}
                </div>

                {/* Under quorum status */}
                {proposalInfo.quorum != 0 && totalScore < proposalInfo.quorum && (
                    <div className='min-w-fit'>
                        <span className="text-purple-800 bg-purple-100 flex-shrink-0 inline-block px-2 py-0.5 text-xs font-medium rounded-full">
                            Approval Threshold: {(totalScore*100/proposalInfo.quorum).toFixed()}%
                        </span>
                    </div>
                )}

                {/* <p className="mt-1 max-w-2xl text-sm text-gray-500">Proposal details.</p> */}
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                <article className="prose prose-lg prose-indigo mx-auto mt-6 text-gray-500 break-words">
                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw, rehypeSanitize]}>{proposalInfo.body}</ReactMarkdown>
                </article>
            </div>
            <div>
                <Link href={`https://snapshot.org/#/jbdao.eth/proposal/${proposalSnapshotHash}`}>
                    <a target="_blank" rel="noopener noreferrer" className="block bg-gray-50 px-4 py-4 text-center text-sm font-medium text-gray-500 hover:text-gray-700 sm:rounded-b-lg">
                        Read on Snapshot
                    </a>
                </Link>
            </div>
        </div>
    )
}