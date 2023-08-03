import { useState, Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { classNames } from '../libs/tailwind';
import { Tooltip } from "flowbite-react";

const hours = Array.from(Array(12).keys()).map((i) => i + 1);
const minutes = ['00', '30'];
const ampm = ['AM', 'PM'];

export default function TimePicker() {
  const [selectedHour, setSelectedHour] = useState(8);
  const [selectedMinute, setSelectedMinute] = useState(minutes[0]);
  const [selectedAMPM, setSelectedAMPM] = useState('PM');

  return (
    <>
      <div className="flex mb-2 mt-2 w-80">
        <label htmlFor="time" className="mt-2 block text-sm font-medium text-gray-700">Select Start Time</label>
        <div className="ml-1 mt-1">
          <Tooltip content="The time you progress to the next stage of governance (in your own timezone)">
            <span className="inline-flex items-center justify-center h-4 w-4 text-xs rounded-full bg-gray-400 text-white">?</span>
          </Tooltip>
        </div>
      </div> 
      <div className="inline-flex">
        <SmallListbox options={hours} selected={selectedHour} setSelected={setSelectedHour} /> 
        <div className="text-center mt-2 ml-2 font-semibold text-gray-900">:</div>
        <SmallListbox options={minutes} selected={selectedMinute} setSelected={setSelectedMinute} addClass="ml-2"/>
        <SmallListbox options={ampm} selected={selectedAMPM} setSelected={setSelectedAMPM} addClass="ml-2 z-10" />
      </div>
    </>
  );

}

const SmallListbox = ({
  options, selected, setSelected, addClass } :
  { options: string[] | number[], selected: string | number, setSelected: React.Dispatch<React.SetStateAction<any>>, addClass?: string
  }) => {
  return (
    <Listbox value={selected} onChange={setSelected}>
      {({ open }) => (
        <>
          <div className="relative">
            <Listbox.Button className={`${addClass} rounded-md relative w-12 cursor-default bg-white py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6 flex justify-center items-center`}>
              <span className="flex">
                {selected}
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center">
              </span>
            </Listbox.Button>
            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className={`${addClass} absolute z-12 mt-1 max-h-100 w-12 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm`}>
                {options.map((o) => (
                  <Listbox.Option
                    key={o}
                    className={({ active }) =>
                      classNames(
                        active ? 'bg-indigo-600 text-white' : 'text-gray-900',
                        'relative cursor-default select-none py-2 rounded-md text-center'
                      )
                    }
                    value={o}
                  >
                    {o}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}  
    </Listbox>
  );
};