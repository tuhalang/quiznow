import { useState, useEffect } from 'react'
import Web3 from 'web3';
import { QUIZ_ABI, QUIZ_ADDRESS } from './contracts/Quiz';
import { TOKEN_ABI, TOKEN_ADDRESS } from './contracts/Token';
import {
  CHAIN_ID,
  CHAIN_NAME,
  RPC_URL,
  NATIVE_TOKEN_DECIMALS,
  NATIVE_TOKEN_NAME,
  NATIVE_TOKEN_SYMBOL,
  BLOCK_EXPLORER,
} from './utils/constant'

export function useWeb3() {
  const [account, setAccount] = useState(undefined);
  const [chainId, setChainId] = useState(undefined);
  const [quizWeb3, setQuizWeb3] = useState(undefined);
  const [quizContract, setQuizContract] = useState(undefined);
  const [quizToken, setQuizToken] = useState(undefined);

  useEffect(() => {
    async function connectWallet() {
      let _accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      let _chainId = await window.ethereum.request({ method: 'eth_chainId' });

      if (_accounts[0] !== account || _chainId !== chainId) {

        if (CHAIN_ID !== _chainId) {
          try {
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: CHAIN_ID }],
            });
          } catch (switchError) {
            console.log(switchError)
            if (switchError.code === 4902) {
              try {
                await window.ethereum.request({
                  method: 'wallet_addEthereumChain',
                  params: [
                    {
                      "chainId": CHAIN_ID,
                      chainName: CHAIN_NAME,
                      nativeCurrency: {
                        name: NATIVE_TOKEN_NAME,
                        symbol: NATIVE_TOKEN_SYMBOL,
                        decimals: NATIVE_TOKEN_DECIMALS
                      },
                      blockExplorerUrls: [BLOCK_EXPLORER],
                      "rpcUrls": [RPC_URL]
                    }
                  ],
                });
              } catch (addError) {
                console.log(addError)
              }
            }
          }

          _accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
          _chainId = await window.ethereum.request({ method: 'eth_chainId' });
        }

        const _quizWeb3 = new Web3(window.ethereum);
        const _quizContract = new _quizWeb3.eth.Contract(QUIZ_ABI, QUIZ_ADDRESS);
        const _quizToken = new _quizWeb3.eth.Contract(TOKEN_ABI, TOKEN_ADDRESS);
        setAccount(_accounts[0]);
        setChainId(_chainId);
        setQuizWeb3(_quizWeb3);
        setQuizContract(_quizContract);
        setQuizToken(_quizToken);
      }
    }

    connectWallet();
  }, [account, chainId]);

  return { account, chainId, quizWeb3, quizContract, quizToken };
}

export function WriteContract(contract, account, method, params, value, callback) {
  contract.methods[method](...params).send(
    {
      value: value,
      from: account
    }
  ).on('receipt', (receipt) => {
    callback(null, receipt);
  }).on('error', function (error, receipt) {
    callback(error, receipt)
  });
}

export async function ReadContract(contract, method, params, callback) {
  const res = await contract.methods[method](...params).call();
  callback(res);
}