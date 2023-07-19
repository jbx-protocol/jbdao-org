import { Fragment, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Session } from 'next-auth';
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import Image from 'next/image'
import { DiscordChannel, DiscordGuild } from '../models/DiscordTypes'
import { guildIconBaseUrl } from '../libs/discordURL'
import { useFetchDiscordGuilds, useFetchDiscordChannels } from "../hooks/discordHooks";

const getGuildIconUrl = (guild: DiscordGuild | null) => {
  if (!guild) return "/images/default_server_icon.png"
  if (!guild.icon) return "/images/default_server_icon.png"
  return `${guildIconBaseUrl}/${guild.id}/${guild.icon}.png`
}

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}

export default function DiscordGuildSelector({ session }: { session: Session}) {
  const router = useRouter();

  const { data: guilds, isLoading: discordGuildsLoading } = useFetchDiscordGuilds({address: session?.user?.name || ''}, router.isReady);

  const [selectedGuild, setSelectedGuild] = useState<DiscordGuild | null>(null);

  const { data: channels, trigger: discordChannelsTrigger } = useFetchDiscordChannels(
    { address: session?.user?.name || '', guildId: selectedGuild?.id || '' },
    router.isReady
  );

  const [selectedChannel, setSelectedChannel] = useState(channels?.[0] || {} as DiscordChannel)

  const handleGuildChange = (guild: DiscordGuild) => {
    console.log('guild', guild)
    setSelectedGuild(guild)
    discordChannelsTrigger()
  }

  useEffect(() => {
    console.log(channels);
  })

  return (
    <div className="w-100">
      {/* guild select */}
      <Listbox value={selectedGuild} onChange={handleGuildChange}>
        {({ open }) => (
          <>
            <Listbox.Label className="block text-sm font-medium leading-6 text-gray-900">Select a Discord server</Listbox.Label>
            <div className="relative mt-2">
              <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-2 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6">
                <span className="flex items-center">
                  <Image src={getGuildIconUrl(selectedGuild || null)} alt="" className="h-10 w-10 flex-shrink-0 rounded-full" width={50} height={50} />
                  <span className="ml-3 block truncate">{selectedGuild?.name}</span>
                </span>
                <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                  <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </span>
              </Listbox.Button>

              <Transition
                show={open}
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {guilds?.map((guild) => (
                    <Listbox.Option
                      key={guild.id}
                      className={({ active }) =>
                        classNames(
                          active ? 'bg-indigo-600 text-white' : 'text-gray-900',
                          'relative cursor-default select-none py-2 pl-3 pr-9'
                        )
                      }
                      value={guild}
                    >
                      {({ selected, active }) => (
                        <>
                          <div className="flex items-center">
                            <Image src={getGuildIconUrl(guild)} alt="" className="h-10 w-10 flex-shrink-0 rounded-full" width={100} height={100} />
                            <span
                              className={classNames(selected ? 'font-semibold' : 'font-normal', 'ml-3 block truncate')}
                            >
                              {guild.name}
                            </span>
                          </div>

                          {selected ? (
                            <span
                              className={classNames(
                                active ? 'text-white' : 'text-indigo-600',
                                'absolute inset-y-0 right-0 flex items-center pr-4'
                              )}
                            >
                              <CheckIcon className="h-5 w-5" aria-hidden="true" />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </>
        )}
      </Listbox>

      {/* add bot to server button */}
      { selectedGuild && (
        <>
        <div className="mt-4">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none"
          >
            Add bot to server
          </button>
        </div>

        {/* channel select */}
        <Listbox value={selectedChannel} onChange={setSelectedChannel}>
        {({ open }) => (
          <>
            <Listbox.Label className="block text-sm font-medium leading-6 text-gray-900">Select a Discord server</Listbox.Label>
            <div className="relative mt-2">
              <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-2 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6">
                <span className="flex items-center">
                  <span className="ml-3 block truncate">{selectedChannel.name}</span>
                </span>
                <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                  <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </span>
              </Listbox.Button>

              <Transition
                show={open}
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                {/* <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {channels?.map((channel) => (
                    <Listbox.Option
                      key={channel.id}
                      className={({ active }) =>
                        classNames(
                          active ? 'bg-indigo-600 text-white' : 'text-gray-900',
                          'relative cursor-default select-none py-2 pl-3 pr-9'
                        )
                      }
                      value={channel}
                    >
                      {({ selected, active }) => (
                        <>
                          <div className="flex items-center">
                            <span
                              className={classNames(selected ? 'font-semibold' : 'font-normal', 'ml-3 block truncate')}
                            >
                              {channel.name}
                            </span>
                          </div>

                          {selected ? (
                            <span
                              className={classNames(
                                active ? 'text-white' : 'text-indigo-600',
                                'absolute inset-y-0 right-0 flex items-center pr-4'
                              )}
                            >
                              <CheckIcon className="h-5 w-5" aria-hidden="true" />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options> */}
              </Transition>
            </div>
          </>
        )}
        </Listbox>
      </>
      )}
    </div>
  )
}
