import { Connection } from "@solana/web3.js";
import { CONFIRMATION_STATUS, FINALIZED_STATUS } from "./web3";
import { DEFAULT_RPC_URL } from "./general-transaction";

const pollConn: Connection = new Connection(DEFAULT_RPC_URL);

export enum ActionStatus {
    PENDING = "PENDING",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
}

export function generateTxnConfirmPollFunction(txnId: string, onSuccessFn?: () => Promise<void>) {
    return async () => {
        const result = await pollConn.getSignatureStatus(txnId);
        const status = result.value;

        if (!status)
            return {
                status: ActionStatus.PENDING,
                actionPayload: {},
            };

        if (status.err)
            return {
                status: ActionStatus.FAILED,
                actionPayload: { transactionId: txnId },
            };

        if (status.confirmationStatus === CONFIRMATION_STATUS || status.confirmationStatus === FINALIZED_STATUS)
            if (onSuccessFn) await onSuccessFn();
        return {
            status: ActionStatus.COMPLETED,
            actionPayload: { transactionId: txnId },
        };
    };
}
