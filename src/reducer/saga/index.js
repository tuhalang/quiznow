import { call, put, takeLatest } from 'redux-saga/effects'
import Web3 from 'web3';
import _ from "lodash";

import {
  CONNECT_WALLET, 
  CONNECT_WALLET_SUCCEED
} from "../action/actions_type";

function* connectWallet(action) {
  try{
    console.log("ACTION: ", action);
    if(window.ethereum){
      const accounts = yield call((param) => window.ethereum.request(param), {method: "eth_requestAccounts"});
      const web3 = new Web3(window.ethereum);

      const account = accounts[0];
      const balance = yield call((account) => web3.eth.getBalance(account), account);

      const payload = {
        account: account,
        balance: balance
      }
      yield put({type: CONNECT_WALLET_SUCCEED, payload: payload});
      if (_.isFunction(action.callback)) action.callback()
    }else{
      if (_.isFunction(action.callback)) action.callback("Please install metamask !")
    }
  }catch(e){
    if (_.isFunction(action.callback)) action.callback(e)
  }
}

function* rootSaga() {
  yield takeLatest(CONNECT_WALLET, connectWallet);
}

export default rootSaga;