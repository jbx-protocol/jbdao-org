import { Action, CustomTransaction, Reserve } from "@nance/nance-sdk";
import CustomTransactionActionLabel from "./CustomTransactionActionLabel";
import PayoutActionLabel from "./PayoutActionLabel";
import { ReserveActionLabel } from "./ReserveActionLabel";
import TransferActionLabel from "./TransferActionLabel";

export default function ActionLabel({
  action,
  space,
}: {
  action: Action;
  space: string;
}) {
  return (
    <div className="ml-2 flex w-full space-x-2 break-words">
      <span className="inline-flex h-min w-min items-center rounded-md bg-blue-100 px-2.5 py-0.5 text-sm font-medium text-blue-800">
        {action.pollRequired && "Milestone-"}
        {action.type}

        {/* {action.type === "Reserve" && (
          <span>
            (Total: {(action.payload as Reserve).splits.reduce((acc, obj) => acc + obj.percent, 0) * 100 / JBConstants.TotalPercent.Splits[2]}%)
          </span>
        )} */}
      </span>

      {action.type === "Transfer" && <TransferActionLabel action={action} />}

      {action.type === "Payout" && <PayoutActionLabel action={action} />}

      {action.type === "Custom Transaction" && (
        <CustomTransactionActionLabel
          action={action}
          space={space}
          uuid={action.uuid}
        />
      )}

      {action.type === "Reserve" && (
        <ReserveActionLabel reserve={action.payload as Reserve} />
      )}
    </div>
  );
}
