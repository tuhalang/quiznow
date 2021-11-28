import {
    CONNECT_WALLET
} from "./actions_type";

export const connectWallet = (callback) => {
    return {
        type: CONNECT_WALLET,
        callback: callback
    }
}