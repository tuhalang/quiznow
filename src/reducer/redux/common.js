import {
    CONNECT_WALLET_SUCCEED
} from "../action/actions_type";

const initialState = {
    account: "",
    balance: 0,
    chainId: "",
    balanceToken: 0
}

const common = (state, action) => {
    if (typeof state === "undefined") {
        return initialState
    }
    const { payload } = action

    switch (action.type) {
        case CONNECT_WALLET_SUCCEED:
            return {
                ...state,
                account: payload.account,
                balance: payload.balance,
                chainId: payload.chainId,
                balanceToken: payload.balanceToken
            }
        default:
            return state
    }
}

export default common
