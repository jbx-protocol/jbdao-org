import { useContext, useState, useEffect } from "react";
import Image from "next/image";
import { Tooltip } from "flowbite-react";
import { parseISO, format, differenceInSeconds } from "date-fns";
import { SpaceContext } from "@/context/SpaceContext";

export function calculateRemainingTime(endTime: string) {
  let remainingTime = [0, 0, 0, 0];
  let formattedEndTime = "";
  try {
    const endTimeDate = parseISO(endTime);
    formattedEndTime = format(endTimeDate, "EEE MMM dd yyyy h:mm a");
    const difference = differenceInSeconds(endTimeDate, new Date());
    if (difference <= 0) return { remainingTime, formattedEndTime };
    const days = Math.floor(difference / (3600 * 24));
    const hours = Math.floor((difference % (3600 * 24)) / 3600);
    const minutes = Math.floor((difference % 3600) / 60);
    const seconds = difference % 60;
    remainingTime = [days, hours, minutes, seconds];
  } catch (error) {
    console.error("Error calculating remaining time:", error);
  }
  return { remainingTime, formattedEndTime };
}

export default function SpaceHeader() {
  const spaceInfo = useContext(SpaceContext);
  const [remainingTime, setRemainingTime] = useState<number[]>([0, 0, 0, 0]);
  const [formattedEndTime, setFormattedEndTime] = useState("");

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (spaceInfo && spaceInfo.currentEvent) {
        const { remainingTime, formattedEndTime } = calculateRemainingTime(
          spaceInfo.currentEvent.end || ""
        );
        setRemainingTime(remainingTime);
        setFormattedEndTime(formattedEndTime);
      }
    }, 1000); // Update every second

    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, [spaceInfo]);

  if (!spaceInfo || !spaceInfo.currentEvent) {
    return null;
  }

  const { displayName, currentEvent, currentCycle, snapshotSpace, avatarURL } =
    spaceInfo;

  return (
    <div className="mb-6 hidden max-w-7xl rounded-md bg-white p-6 shadow md:flex md:flex-col md:space-x-5">
      <div className="flex w-full flex-col items-center space-x-0 space-y-6 md:flex-row md:justify-between md:space-x-6 md:space-y-0">
        <div className="flex flex-shrink-0 space-x-3 md:w-5/12">
          <Image
            className="h-16 w-16 rounded-full"
            src={avatarURL}
            alt={`${displayName} Logo`}
            height={64}
            width={64}
          />
          <div>
            <h1 className="text-4xl font-bold text-gray-900">{displayName}</h1>
            <p className="text-right text-sm font-medium text-gray-500">
              powered by Nance
            </p>
          </div>
        </div>
        {currentEvent.end && (
          <div className="rounded-md border-2 border-blue-600 bg-indigo-100 py-2 px-3 w-min-fit text-xs">
            <div className="flex flex-col">
              <div className="flex flex-row items-center">
                <div className="text-gray-500">Governance Cycle</div>
                <div className="ml-2">{currentCycle}</div>
              </div>
              <div className="flex flex-row items-center">
                <div className="text-gray-500">Current Event</div>
                <div className="ml-8">{currentEvent.title}</div>
              </div>
              <div className="flex justify-start items-center">
                <div className="text-gray-500">Time Remaining</div>
                <Tooltip content={formattedEndTime}>
                  <div className="ml-5">
                    <span className="countdown font-mono">
                      <span
                        style={
                          { "--value": remainingTime[0] } as React.CSSProperties
                        }
                      ></span>
                      :
                      <span
                        style={
                          { "--value": remainingTime[1] } as React.CSSProperties
                        }
                      ></span>
                      :
                      <span
                        style={
                          { "--value": remainingTime[2] } as React.CSSProperties
                        }
                      ></span>
                      :
                      <span
                        style={
                          { "--value": remainingTime[3] } as React.CSSProperties
                        }
                      ></span>
                    </span>
                  </div>
                </Tooltip>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
