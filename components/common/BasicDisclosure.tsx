import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/20/solid";
import { PropsWithChildren } from "react";

interface BasicDisclosureProps {
  /**
   * Title of the disclosure.
   */
  title: string;
  /**
   * Whether the disclosure should be open by default.
   */
  defaultOpen?: boolean;
}

/**
 * Multiple section which can be opened and closed independently.
 */
export default function BasicDisclosure({
  title,
  defaultOpen = false,
  children,
}: PropsWithChildren<BasicDisclosureProps>) {
  return (
    <Disclosure
      as="div"
      className="rounded-lg bg-blue-100"
      defaultOpen={defaultOpen}
    >
      {({ open }) => (
        <>
          <Disclosure.Button className="flex w-full justify-between rounded-lg bg-blue-100 px-4 py-2 text-left text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring focus-visible:ring-blue-500/75">
            <span>{title}</span>
            <ChevronUpIcon
              className={`${
                open ? "rotate-180 transform" : ""
              } h-5 w-5 text-blue-500`}
            />
          </Disclosure.Button>
          <Disclosure.Panel className="px-4 pb-2 pt-4 text-sm text-blue-500">
            {children}
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
